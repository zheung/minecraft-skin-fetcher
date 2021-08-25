import { C, G } from './lib/global.js';
import Postgre from './lib/Postgre.js';

import { ensurePlayer, queryPlayers } from './lib/function/Player.js';
import { ensurePlayerProfile } from './lib/function/ProfilePlayer.js';
import { ensureProfileSnap, fetchProfile, fetchProfileID } from './lib/function/Profile.js';
import { ensureSkin } from './lib/function/Skin.js';
import LogError from './lib/LogError.js';


const ensureSet = async (DB, idProfile) => {
	const [profile, urlSkin] = await fetchProfile(idProfile);

	await ensureProfileSnap(DB, profile);
	await ensureSkin(DB, profile.SkinHash, urlSkin);
};

(async function() {
	try {
		const PG = await new Postgre(C.$db);
		const DB = await PG.pick();


		const { fetchName, interval } = C;


		if(fetchName) {
			G.info('主线', `~[玩家更新模式]`);


			const [nick, userName] = fetchName.split('|');

			const player = await ensurePlayer(DB, nick);
			const idProfile = await fetchProfileID(userName);

			await ensurePlayerProfile(DB, player, idProfile);
			await ensureSet(DB, idProfile);


			await DB.close();
		}
		else if(interval) {
			G.info('主线', `~[轮询更新模式]`);

			const loop = async () => {
				const players = await queryPlayers(DB);

				for(const player of players) {

				}
			};

			loop();
			setInterval(loop, interval);
		}


		G.info('主线', '结束');
	}
	catch(error) {
		if(error instanceof LogError) {
			G[error.name](...error.args);
		}
		else {
			G.fatal('主线', '致命错误', error);
		}
	}
})();