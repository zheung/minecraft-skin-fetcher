import Axios from 'axios';

import { G } from '@nuogz/pangu';

import { DB } from '../../../../lib/db.js';

import LogError from './LogError.lib.js';



export const queryProfileSnap = async (profile) => {
	try {
		G.warnU('主线', '查询~[档案快照]', `? ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);

		const snapProfile = await DB.queryOne(
			'SELECT "timeInsert" FROM "ProfileSnap" WHERE "ProfileID" = $ AND "ProfileName" = $ AND "SkinHash" = $ AND "SkinModel" = $',
			profile.ProfileID, profile.ProfileName, profile.SkinHash, profile.SkinModel
		);

		if(snapProfile) {
			G.infoD('主线', `查询~[档案快照]`, `✔ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);
		}
		else {
			G.warnD('主线', '查询~[档案快照]', `不存在 ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);
		}

		return snapProfile;
	}
	catch(error) { throw new LogError('fatal', '主线', '查询~[档案快照]', `✖ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`, error); }
};
export const createProfileSnap = async (profile) => {
	try {
		G.warnU('主线', `创建~[档案快照]`, `? ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);

		const snapProfile = await DB.queryOne('INSERT INTO "ProfileSnap"$i RETURNING *', profile);

		G.infoD('主线', `创建~[档案快照]`, `✔ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);

		return snapProfile;
	}
	catch(error) { throw new LogError('fatal', '主线', `创建~[档案快照]`, `✖ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`, error); }
};
export const ensureProfileSnap = async (profile) => (await queryProfileSnap(profile)) ?? (await createProfileSnap(profile));


export const fetchProfileID = async (userName) => {
	try {
		G.warnU('主线', `获取~[映射]`, `? ~[档案名称]~{${userName}}`);

		const response = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${userName}`);

		if(response.status == 204) { throw Error('~[映射]不存在'); }

		const { data: { id: idProfile } } = response;

		G.infoD('主线', `获取~[映射]`, `✔ ~[档案名称]~{${userName}} ~[档案ID]~{${idProfile}}`);

		return idProfile;
	}
	catch(error) { throw new LogError('fatal', '主线', `获取~[映射]`, `✖ ~[档案名称]~{${userName}}`, error); }
};
export const fetchProfile = async (idProfile) => {
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
	catch(error) { throw new LogError('fatal', '主线', `获取~[档案]`, `✖ ~[ID]~{${idProfile}}`, error); }
};
