import { B } from '../../lib/global.js';

const method = 'get';

const handle = async function({ hash }, ctx) {
	ctx.type = 'png';

	return (await B.db.queryOne('SELECT data FROM "Skin" WHERE "hash"=$', hash))?.data;
};


export { method, handle };