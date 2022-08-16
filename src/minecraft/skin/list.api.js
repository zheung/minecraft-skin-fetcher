import { DB } from '../../../lib/db.js';



export const method = 'get';
export const handle = async () => {
	return DB.query('SELECT * FROM "LatestSkin"');
};
