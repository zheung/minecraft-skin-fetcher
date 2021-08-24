import Axios from 'axios';

import { G } from '../global.js';


export const querySkin = async (DB, hashSkin) => {
	try {
		G.warnU('主线', '查询~[皮肤]', `? ~[哈希]~{${hashSkin}}`);

		const skinLite = await DB.queryOne('SELECT hash FROM "skin" WHERE "hash" = $', hashSkin);

		if(skinLite) {
			G.infoD('主线', `查询~[皮肤]`, `✔ ~[哈希]~{${hashSkin}}`);
		}
		else {
			G.warnD('主线', '查询~[皮肤]', `不存在 ~[哈希]~{${hashSkin}}`);
		}

		return skinLite;
	}
	catch(error) { G.fatalE('主线', '查询~[皮肤]', `✖ `, error); }
};
export const fetchSkin = async (profile, urlSkin) => {
	try {
		G.warnU('主线', '获取~[皮肤]', `? ~[哈希]~{${profile.SkinHash}}`);

		const { data: bufferSkin } = await Axios.get(urlSkin, { responseType: 'arraybuffer' });

		G.infoD('主线', `获取~[皮肤]`, `✔ ~[哈希]~{${profile.SkinHash}}`);

		return bufferSkin;
	}
	catch(error) { G.fatalE('主线', `获取~[皮肤]`, `✖ ~[皮肤]~{${profile.SkinHash}}`, error); }
};
export const createSkin = async (DB, profile, bufferSkin) => {
	try {
		G.warnU('主线', '创建~[皮肤]', `? ~[哈希]~{${profile.SkinHash}}`);

		await DB.query('INSERT INTO "skin"$i', { hash: profile.SkinHash, data: bufferSkin, });

		G.infoD('主线', `创建~[皮肤]`, `✔ ~[哈希]~{${profile.SkinHash}}`);
	}
	catch(error) { G.fatalE('主线', `创建~[皮肤]`, `✖ ~[皮肤]~{${profile.SkinHash}}`, error); }
};