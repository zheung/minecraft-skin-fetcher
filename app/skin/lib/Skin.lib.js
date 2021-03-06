import Axios from 'axios';
import { B, G } from '../../../lib/global.js';
import LogError from '.././lib/LogError.lib.js';



export const querySkin = async (hashSkin) => {
	try {
		G.warnU('主线', '查询~[皮肤]', `? ~[哈希]~{${hashSkin}}`);

		const skinLite = await B.db.queryOne('SELECT hash FROM "Skin" WHERE "hash" = $', hashSkin);

		if(skinLite) {
			G.infoD('主线', `查询~[皮肤]`, `✔ ~[哈希]~{${hashSkin}}`);
		}
		else {
			G.warnD('主线', '查询~[皮肤]', `不存在 ~[哈希]~{${hashSkin}}`);
		}

		return skinLite;
	}
	catch(error) { throw new LogError('fatal', '主线', '查询~[皮肤]', `✖ ~[哈希]~{${hashSkin}}`, error); }
};
export const createSkin = async (hashSkin, bufferSkin) => {
	try {
		G.warnU('主线', '创建~[皮肤]', `? ~[哈希]~{${hashSkin}}`);

		const skin = await B.db.queryOne('INSERT INTO "Skin"$i RETURNING *', { hash: hashSkin, data: bufferSkin, });

		G.infoD('主线', `创建~[皮肤]`, `✔ ~[哈希]~{${hashSkin}}`);

		return skin;
	}
	catch(error) { throw new LogError('fatal', '主线', `创建~[皮肤]`, `✖ ~[哈希]~{${hashSkin}}`, error); }
};
export const ensureSkin = async (hashSkin, urlSkin) => {
	const skinLite = await querySkin(hashSkin);

	if(!skinLite) {
		return await createSkin(hashSkin, await fetchSkin(hashSkin, urlSkin));
	}

	return skinLite;
};


export const fetchSkin = async (hashSkin, urlSkin) => {
	try {
		G.warnU('主线', '获取~[皮肤]', `? ~[哈希]~{${hashSkin}}`);

		const { data: bufferSkin } = await Axios.get(urlSkin, { responseType: 'arraybuffer' });

		G.infoD('主线', `获取~[皮肤]`, `✔ ~[哈希]~{${hashSkin}}`);

		return bufferSkin;
	}
	catch(error) { throw new LogError('fatal', '主线', `获取~[皮肤]`, `✖ ~[哈希]~{${hashSkin}}`, error); }
};