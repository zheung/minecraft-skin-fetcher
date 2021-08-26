import { B } from '../../lib/global.js';

const method = 'get';

const handle = async function({ hash }) {
	const skin = await B.db.queryOne('SELECT data FROM "Skin" WHERE "hash"=$', hash);

	return {
		success: true,
		data: [...skin.data]
	};
};


export { method, handle };