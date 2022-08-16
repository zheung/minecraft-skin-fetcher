import { C, G } from '@nuogz/pangu';

import LogError from './lib/LogError.lib.js';
import { ensurePlayer, queryPlayerProfiles } from './lib/Player.lib.js';
import { ensureProfileSnap, fetchProfile, fetchProfileID } from './lib/Profile.lib.js';
import { ensurePlayerProfile } from './lib/ProfilePlayer.lib.js';
import { ensureSkin } from './lib/Skin.lib.js';



const ensureSet = async (idProfile) => {
	const [profile, urlSkin] = await fetchProfile(idProfile);

	await ensureProfileSnap(profile);
	await ensureSkin(profile.SkinHash, urlSkin);
};


export const method = 'post';
export const handle = async ({ nick, name }) => {
	try {
		const idProfile = await fetchProfileID(name);
		const player = await ensurePlayer(nick);

		await ensurePlayerProfile(player, idProfile);
		await ensureSet(idProfile);

		return idProfile;
	}
	catch(error) {
		if(error instanceof LogError) { G[error.name](...error.args); }
		else { G.fatal('主线', '入库错误', error); }

		throw `入库错误：${error.message ?? error}`;
	}
};

const looper = async () => {
	const playerProfiles = await queryPlayerProfiles();

	for(const playerProfile of playerProfiles) {
		try {
			G.info('轮询', `~[玩家]~{${playerProfile.nick}}`, `~[档案ID]~{${playerProfile.ProfileID}}`);

			await ensureSet(playerProfile.ProfileID);

			G.info();
		}
		catch(error) {
			if(error instanceof LogError) { G[error.name](...error.args); }
			else { G.fatal('主线', '轮询错误', error); }
		}
	}
};


G.info('主线', '轮询~[档案快照]', `间隔~{${~~(C.interval / 1000 / 60)}分}`);
setInterval(looper, C.interval);
// setTimeout(looper, 1000 * 5);
