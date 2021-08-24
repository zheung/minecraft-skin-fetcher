import Axios from 'axios';

import { G } from '../global.js';


export const fetchProfileID = async (userName) => {
	try {
		G.warnU('主线', `获取~[映射]`, `? ~[档案名称]~{${userName}}`);

		const { data: { id: idProfile } } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${userName}`);

		G.infoD('主线', `获取~[映射]`, `✔ ~[档案名称]~{${userName}} ~[档案ID]~{${idProfile}}`);

		return idProfile;
	}
	catch(error) { G.fatalE('主线', `获取~[映射]`, `✖ ~[档案名称]~{${userName}}`, error); }
};
export const updatePlayerSubsProfileID = async (DB, player, idProfileNow) => {
	if(idProfileNow == player.ProfileMainID || player.ProfileSubsIDs.includes(idProfileNow)) { return; }

	try {
		player.ProfileSubsIDs.push(idProfileNow);

		G.warnU('主线', `更新~[玩家]`, `? ~[副档]~{${idProfileNow}}`);

		await DB.query('UPDATE "player" SET "ProfileSubsIDs"=$ WHERE "id"=$', player.ProfileSubsIDs, player.id);

		G.infoD('主线', `更新~[玩家]`, `✔ ~[副档]~{${idProfileNow}}`);
	}
	catch(error) { G.fatalE('主线', `更新~[玩家]`, `✖ `, error); }
};


export const fetchProfile = async idProfile => {
	try {
		G.warnU('主线', `获取~[档案]`, `? ~[ID]~{${idProfile}}`);

		const { data: { properties: [{ value: base64Textures }] } } = await Axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${idProfile}`);
		const { profileName: ProfileName, textures: { SKIN: { url: urlSkin, metadata: { model: SkinModel } = {} } } } = JSON.parse(Buffer.from(base64Textures, 'base64').toString());

		const infoURLSkin = new URL(urlSkin);

		const profile = {
			ProfileID: idProfile,
			ProfileName,
			SkinHash: infoURLSkin.pathname.split('/').find((seg, index, segs) => 'texture' == segs[index - 1]),
			SkinModel: SkinModel == 'slim' ? 1 : 0,
		};

		G.infoD('主线', `获取~[档案]`, `✔ ~[名称]~{${profile.ProfileName}} ~[ID]~{${idProfile}}`,
			`~[皮肤]~{${SkinModel == 'slim' ? '纤细' : '经典'}}~{${profile.SkinHash}}`,
		);

		return [profile, urlSkin];
	}
	catch(error) { G.fatalE('主线', `获取~[档案]`, `✖ ~[ID]~{${idProfile}}`, error); }
};
export const queryProfile = async (DB, profile) => {
	try {
		G.warnU('主线', '查询~[档案]', `? ~[名称]~{${profile.ProfileName}}`);

		const snapProfile = await DB.queryOne(
			'SELECT "timeInsert" FROM "profileSnap" WHERE "ProfileID" = $ AND "ProfileName" = $ AND "SkinHash" = $ AND "SkinModel" = $',
			profile.ProfileID, profile.ProfileName, profile.SkinHash, profile.SkinModel
		);

		if(snapProfile) {
			G.infoD('主线', `查询~[档案]`, `✔ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);
		}
		else {
			G.warnD('主线', '查询~[档案]', `不存在 ~[名称]~{${profile.ProfileName}}`);
		}

		return snapProfile;
	}
	catch(error) { G.fatalE('主线', '查询~[档案]', `✖ `, error); }
};
export const createProfile = async (DB, profile) => {
	try {
		G.warnU('主线', `创建~[档案]`, `? ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);

		await DB.query('INSERT INTO "profileSnap"$i', profile);

		G.infoD('主线', `创建~[档案]`, `✔ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);
	}
	catch(error) { G.fatalE('主线', `创建~[档案]`, `✖ `, error); }
};