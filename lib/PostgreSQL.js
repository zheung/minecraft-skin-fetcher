import PostgreSQL from 'pg';

import { G } from '@nuogz/pangu';



// 基本类型格式化
const baseFormat = (match, values, type = typeof match, wild) => {
	if(type == 'number' || type == 'bigint') {
		return match;
	}
	else if(type == 'string') {
		return `'${match.replace(/'/g, '\'\'')}'`;
	}
	else if(type == 'boolean') {
		return match.toString().toUpperCase();
	}
	else if(match == null) {
		return 'NULL';
	}
	else if(match instanceof Array) {
		match = match.map(m => baseFormat(m, values, typeof m, wild)).join(', ');

		// 数据数组格式
		if(wild != '$r') {
			if(match.length) {
				return `ARRAY[${match}]`;
			}
			else {
				return '\'{}\'';
			}
		}

		return match;
	}
	else if(match instanceof Buffer) {
		return `$${values.push(match)}`;
	}

	throw `格式化~[SQL]: 错误, ~[匹配数据]类型~{${type}}不支持`;
};

// Number|Bigint  : 1 ==> 1
// String         : `a` ==> `a`
// String with $$ : `a` ==> "a"
// Boolean        : true ==> TRUE
// Null           : null ==> NULL
// Array          : [1, `a`, true] ==> ARRAY[1, `a`, TRUE]
// Array with $r  : [1, `a`, true] ==> 1, `a`, TRUE
// Object         : { a: 1, b: `a` } ==> a=1, b=`a`
// Object with $i : { a: 1, b: `a` } ==> (a, b) VALUES (1, `a`)
// Buffer         : Do nothing. It should be passed until parameterized query
const formatSQL = (sql, param = []) => {
	let index = 0;
	const values = [];
	let sqlFormatted = sql.replace(/\$(r|i|b|\$+)?/g, (wild, idx) => {
		const match = param[index++];
		const type = typeof match;

		// 通配符长度错误
		if(wild.length > 3) {
			throw `格式化~[SQL]: 错误, 匹配到长度为~{${wild.length}}的通配符, 无法断定`;
		}

		// 检查特殊通配符
		if(wild == '$i' && type != 'object') {
			throw `格式化~[SQL]: 错误, 特殊通配符~[$i]匹配类型应为~[object], 当前为~{${type}}`;
		}
		else if(wild == '$r' && !(match instanceof Array)) {
			throw `格式化~[SQL]: 错误, 特殊通配符~[$r]匹配类型应为~[object|Array], 当前为~{${type}}`;
		}

		try {
			// undefined不匹配
			if(match === undefined) { return wild; }

			let resultMatch;

			// $$处理
			let isSystem = wild == '$$' && type == 'string';
			if(isSystem && type != 'string') {
				G.warn(`数据`, '格式化~[SQL]', `系统通配符 $$ 匹配类型应为~[string], 当前为~{${type}}`);
			}

			if(type == 'object' && !(match instanceof Array)) {
				let entries = [];

				for(let mkey in match) {
					entries.push([mkey, match[mkey]]);
				}

				// 对象
				if(wild != '$i') {
					resultMatch = entries.map(arr => `"${arr[0]}"=${baseFormat(arr[1], values)}`).join(', ');
				}
				// 对象, 插入用格式
				else {
					let keys = [];
					let vals = [];

					entries.forEach(arr => {
						let a = arr[0];
						let b = arr[1];

						let aType = typeof a;

						if(aType != 'string') {
							G.warn(`数据`, '格式化~[SQL]', `系统通配符 $$ [匹配数据]类型应为[string], 当前为${type}`);
						}

						keys.push(`"${a}"`);
						vals.push(baseFormat(b, values));
					});

					resultMatch = `(${keys.join(', ')})VALUES(${vals.join(', ')})`;
				}
			}
			else {
				// 基本类型
				resultMatch = baseFormat(match, values, type, wild);
			}

			return isSystem ? `"${match}"` : resultMatch;
		}
		catch(error) {
			if(typeof error == 'string') {
				throw `${error}, 位置~{${idx}}`;
			}
			else {
				throw error;
			}
		}
	});

	return [sqlFormatted, values];
};

const parseResult = result => {
	if(result.command == 'INSERT' || result.command == 'UPDATE' || result.command == 'DELETE') {
		if(result.rows.length) {
			return result.rows;
		}
		else {
			return result.rowCount;
		}
	}
	else if(result.command == 'SELECT') {
		return result.rows;
	}
	else {
		return result;
	}
};

class PostgresClient {
	/**
	 * @type {PostgreSQL.PoolClient}
	 */
	client;
	/**
	 * @type {Postgres}
	 */
	parent;

	constructor(client, parent) {
		this.client = client;
		this.parent = parent;
	}

	format(sql, ...params) { return formatSQL(sql, params); }

	async query(sql, ...params) {
		const [sqlForamted, values] = formatSQL(sql, params);
		const result = await this.client.query(sqlForamted, values);

		return parseResult(result);
	}
	async queryOne(sql, ...params) {
		const [sqlForamted, values] = formatSQL(sql, params);
		const result = await this.client.query(sqlForamted, values);

		return parseResult(result)[0];
	}

	async begin() {
		return this.client.query('BEGIN');
	}
	async commit() {
		return this.client.query('COMMIT');
	}
	async rollback() {
		return this.client.query('ROLLBACK');
	}

	close(error) {
		return new Promise(resolve => {
			this.client.once('end', () => resolve());
			this.client.release(error);
		});
	}
}

class Postgres {
	constructor(auth) {
		/**
		 * @type {PostgreSQL.Pool}
		 */
		this.pool = new PostgreSQL.Pool({
			host: auth.host,
			port: auth.port,
			database: auth.database,
			user: auth.user,
			password: auth.password,
			max: 48,
		});

		return this.pool.query('SHOW CLIENT_ENCODING')
			.then(result => {
				G.debug('数据', '连接', '✔ ', `客户端编码~{${result.rows[0].client_encoding}}`);

				return this;
			});
	}

	format(sql, ...params) { return formatSQL(sql, params); }

	async pick() {
		return new PostgresClient(await this.pool.connect(), this);
	}

	async query(sql, ...params) {
		const [sqlForamted, values] = formatSQL(sql, params);
		const result = await this.pool.query(sqlForamted, values);

		return parseResult(result);
	}
	async queryOne(sql, ...params) {
		const [sqlForamted, values] = formatSQL(sql, params);
		const result = await this.pool.query(sqlForamted, values);

		return parseResult(result)[0];
	}
}

export { PostgresClient };
export default Postgres;
