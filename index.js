import { C, G } from './lib/global.js';
import Postgre from './lib/Postgre.js';

import { ensurePlayer, queryPlayerProfiles } from './lib/function/Player.js';
import { ensurePlayerProfile } from './lib/function/ProfilePlayer.js';
import { ensureProfileSnap, fetchProfile, fetchProfileID } from './lib/function/Profile.js';
import { ensureSkin } from './lib/function/Skin.js';
import LogError from './lib/LogError.js';

const { mode, fetchName, interval } = C;

const ensureSet = async (DB, idProfile) => {
	const [profile, urlSkin] = await fetchProfile(idProfile);

	await ensureProfileSnap(DB, profile);
	await ensureSkin(DB, profile.SkinHash, urlSkin);
};

const initLooper = (DB) => async () => {
	try {
		const playerProfiles = await queryPlayerProfiles(DB);

		for(const playerProfile of playerProfiles) {
			G.info('轮询', `~[玩家]~{${playerProfile.nick}}`, `~[档案ID]~{${playerProfile.ProfileID}}`);

			await ensureSet(DB, playerProfile.ProfileID);

			G.info();
		}
	}
	catch(error) {
		if(error instanceof LogError) { G[error.name](...error.args); }
		else { G.fatal('主线', '轮询错误', error); }
	}
};

(async function() {
	const PG = await new Postgre(C.$db);
	const DB = await PG.pick();


	if(mode == 1) {
		try {
			G.infoD('主线', `~[入库模式]`);


			const [nick, userName] = fetchName.split('|');

			const idProfile = await fetchProfileID(userName);
			const player = await ensurePlayer(DB, nick);

			await ensurePlayerProfile(DB, player, idProfile);
			await ensureSet(DB, idProfile);
		}
		catch(error) {
			if(error instanceof LogError) { G[error.name](...error.args); }
			else { G.fatal('主线', '入库错误', error); }
		}
		finally {
			await DB.close();
		}
	}
	else if(interval) {
		G.infoD('主线', `~[轮询模式]`);

		const looper = initLooper(DB);

		looper();
		setInterval(looper, interval);
	}


	G.info('主线', '结束');
})();