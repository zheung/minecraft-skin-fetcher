import { DB } from '../../../lib/db.js';



export const parseResult = false;
export const method = 'get';
export const handle = async ({ hash }, ctx) => {
	ctx.type = 'png';

	return (await DB.queryOne('SELECT data FROM "Skin" WHERE "hash"=$', hash))?.data;
};
