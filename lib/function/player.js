import { G } from '../global.js';
import LogError from '../LogError.js';


export const queryPlayer = async (DB, nick) => {
	try {
		G.warnU('主线', '查询~[玩家]', `? ~[昵称]~{${nick}}`);

		const player = await DB.queryOne('SELECT * FROM "Player" WHERE "nick" = $', nick);

		if(player) {
			G.infoD('主线', `查询~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${player.id}}`);
		}
		else {
			G.warnD('主线', '查询~[玩家]', `不存在 ~[昵称]~{${nick}}`);
		}

		return player;
	}
	catch(error) { throw LogError('fatal', '主线', '查询~[玩家]', `✖ `, error); }
};
export const createPlayer = async (DB, nick) => {
	try {
		G.warnU('主线', `创建~[玩家]`, `? ~[昵称]~{${nick}}`);

		const player = await DB.query('INSERT INTO "Player"$i RETURNING *', { nick });

		G.infoD('主线', `创建~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${player.id}}`);

		return player;
	}
	catch(error) { throw LogError('fatal', '主线', `创建~[玩家]`, `✖ `, error); }
};
export const ensurePlayer = async (DB, nick) => (await queryPlayer(DB, nick)) ?? (await createPlayer(DB, nick));


export const queryPlayers = async (DB) => {
	try {
		G.warnU('主线', `查询~[玩家]`, `? 所有~[玩家]`);

		const idPlayer = await DB.query('SELECT * FROM "Player"');

		G.infoD('主线', `查询~[玩家]`, `✔ 所有~[玩家]`);

		return idPlayer;
	}
	catch(error) { throw LogError('fatal', '主线', `查询~[玩家]`, `✖ `, error); }
};