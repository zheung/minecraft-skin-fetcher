import { B } from '../../lib/global.js';

const method = 'get';

const handle = async function() {
	return {
		success: true,
		data: (await B.db.query('SELECT * FROM "PlayerSkinAll"'))
	};
};


export { method, handle };