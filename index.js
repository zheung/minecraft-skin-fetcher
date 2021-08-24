import { C, G } from './lib/global.js';
import Postgre from './lib/Postgre.js';

import { createProfile, fetchProfile, fetchProfileID, queryProfile, updatePlayerSubsProfileID } from './lib/function/profile.js';
import { createSkin, fetchSkin, querySkin } from './lib/function/skin.js';
import { createPlayer, queryPlayer, queryPlayers } from './lib/function/player.js';

export const getProfileID = async (DB, nick, userName) => {
	let idProfileNow;

	const player = await queryPlayer(DB, nick);

	idProfileNow = await fetchProfileID(userName);
	if(player) {
		await updatePlayerSubsProfileID(DB, player, idProfileNow);
	}
	else {
		await createPlayer(DB, nick, idProfileNow);
	}

	return idProfileNow;
};

const createSet = async (DB, idProfile) => {
	const [profile, urlSkin] = await fetchProfile(idProfile);

	const snapProfile = await queryProfile(DB, profile);
	if(!snapProfile) {
		await createProfile(DB, profile);
	}

	const skin = await querySkin(DB, profile.SkinHash);
	if(!skin) {
		await createSkin(DB, profile, await fetchSkin(profile, urlSkin));
	}
};

(async function() {
	const PG = await new Postgre(C.$db);
	const DB = await PG.pick();


	const { fetchName, interval } = C;


	if(fetchName) {
		G.info('主线', `~[玩家更新模式]`);


		const [nick, userName] = fetchName.split('|');


		const [idProfile] = await getProfileID(DB, nick, userName);

		await createSet(DB, idProfile);


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
})();