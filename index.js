import Axios from 'axios';

import { C, G } from './lib/global.js';
import Postgre from './lib/Postgre.js';

let DB;

const queryPlayer = async nick => {
	try {
		G.warnU('主线', '查询~[玩家]', `? ~[昵称]~{${nick}}`);

		const player = await DB.queryOne('SELECT * FROM "player" WHERE "nick" = $', nick);

		if(player) {
			G.infoD('主线', `查询~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${player.id}} ~[主档]~{${player.ProfileMainID}}`);
		}
		else {
			G.warnD('主线', '查询~[玩家]', `不存在 ~[昵称]~{${nick}}`);
		}

		return player;
	}
	catch(error) { G.fatalE('主线', '查询~[玩家]', `✖ `, error); }
};
const fetchProfileID = async userName => {
	try {
		G.warnU('主线', `获取~[映射]`, `? ~[档案名称]~{${userName}}`);

		const { data: { id: idProfile } } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${userName}`);

		G.infoD('主线', `获取~[映射]`, `✔ ~[档案名称]~{${userName}} ~[档案ID]~{${idProfile}}`);

		return idProfile;
	}
	catch(error) { G.fatalE('主线', `获取~[映射]`, `✖ ~[档案名称]~{${userName}}`, error); }
};
const updatePlayerSubsProfileID = async (player, idProfileNow) => {
	if(idProfileNow == player.ProfileMainID || player.ProfileSubsIDs.includes(idProfileNow)) { return; }

	try {
		player.ProfileSubsIDs.push(idProfileNow);

		G.warnU('主线', `更新~[玩家]`, `? ~[副档]~{${idProfileNow}}`);

		await DB.query('UPDATE "player" SET "ProfileSubsIDs"=$ WHERE "id"=$', player.ProfileSubsIDs, player.id);

		G.infoD('主线', `更新~[玩家]`, `✔ ~[副档]~{${idProfileNow}}`);
	}
	catch(error) { G.fatalE('主线', `更新~[玩家]`, `✖ `, error); }
};
const createPlayer = async (nick, idProfileMain, idsProfileSubs = []) => {
	try {
		G.warnU('主线', `创建~[玩家]`, `? ~[昵称]~{${nick}}`, `~[主档]~{${idProfileMain}}`);

		const idPlayer = await DB.query('INSERT INTO "player"$i RETURNING "id"', { nick, ProfileMainID: idProfileMain, ProfileSubsIDs: idsProfileSubs });

		G.infoD('主线', `创建~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${idPlayer}}`, `~[主档]~{${idProfileMain}}`);

		return idPlayer;
	}
	catch(error) { G.fatalE('主线', `创建~[玩家]`, `✖ `, error); }
};

const accessInfo = async (nick, userName) => {
	let idProfileNow;

	const player = await queryPlayer(nick);

	idProfileNow = await fetchProfileID(userName);
	if(player) {
		await updatePlayerSubsProfileID(player, idProfileNow);
	}
	else {
		await createPlayer(nick, idProfileNow);
	}

	return [idProfileNow, player];
};


const fetchProfile = async idProfile => {
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
const queryProfile = async profile => {
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
const createProfile = async profile => {
	try {
		G.warnU('主线', `创建~[档案]`, `? ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);

		await DB.query('INSERT INTO "profileSnap"$i', profile);

		G.infoD('主线', `创建~[档案]`, `✔ ~[名称]~{${profile.ProfileName}} ~[id]~{${profile.ProfileID}}`);
	}
	catch(error) { G.fatalE('主线', `创建~[档案]`, `✖ `, error); }
};
const querySkin = async hashSkin => {
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
const fetchSkin = async (profile, urlSkin) => {
	try {
		G.warnU('主线', '获取~[皮肤]', `? ~[哈希]~{${profile.SkinHash}}`);

		const { data: bufferSkin } = await Axios.get(urlSkin, { responseType: 'arraybuffer' });

		G.infoD('主线', `获取~[皮肤]`, `✔ ~[哈希]~{${profile.SkinHash}}`);

		return bufferSkin;
	}
	catch(error) { G.fatalE('主线', `获取~[皮肤]`, `✖ ~[皮肤]~{${profile.SkinHash}}`, error); }
};
const createSkin = async (profile, bufferSkin) => {
	try {
		G.warnU('主线', '创建~[皮肤]', `? ~[哈希]~{${profile.SkinHash}}`);

		await DB.query('INSERT INTO "skin"$i', { hash: profile.SkinHash, data: bufferSkin, });

		G.infoD('主线', `创建~[皮肤]`, `✔ ~[哈希]~{${profile.SkinHash}}`);
	}
	catch(error) { G.fatalE('主线', `创建~[皮肤]`, `✖ ~[皮肤]~{${profile.SkinHash}}`, error); }
};


(async function() {
	const PG = await new Postgre(C.$db);
	DB = await PG.pick();


	const { fetchName } = C;


	if(fetchName) {
		const [nick, userName] = fetchName.split('|');


		G.info('主线', `~[玩家更新模式]`);


		const [idProfile] = await accessInfo(nick, userName);
		const [profile, urlSkin] = await fetchProfile(idProfile);


		const snapProfile = await queryProfile(profile);
		if(!snapProfile) {
			await createProfile(profile);
		}


		const skin = await querySkin(profile.SkinHash);
		if(!skin) {
			await createSkin(profile, await fetchSkin(profile, urlSkin));
		}
	}


	await DB.close();

	G.info('主线', '结束');
})();