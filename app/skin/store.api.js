import { C, G } from '../../lib/global.js';
import LogError from '../../lib/LogError.js';
import { ensurePlayer, queryPlayerProfiles } from './lib/Player.lib.js';
import { ensureProfileSnap, fetchProfile, fetchProfileID } from './lib/Profile.lib.js';
import { ensurePlayerProfile } from './lib/ProfilePlayer.lib.js';
import { ensureSkin } from './lib/Skin.lib.js';


const ensureSet = async (idProfile) => {
	const [profile, urlSkin] = await fetchProfile(idProfile);

	await ensureProfileSnap(profile);
	await ensureSkin(profile.SkinHash, urlSkin);
};

const method = 'get';

const handle = async function({ nick, name }) {
	try {
		const idProfile = await fetchProfileID(name);
		const player = await ensurePlayer(nick);

		await ensurePlayerProfile(player, idProfile);
		await ensureSet(idProfile);

		return {
			success: true,
			data: idProfile
		};
	}
	catch(error) {
		G.fatal('主线', '入库错误', error);

		return {
			success: false,
			message: error.message
		};
	}
};

const looper = async () => {
	try {
		const playerProfiles = await queryPlayerProfiles();

		for(const playerProfile of playerProfiles) {
			G.info('轮询', `~[玩家]~{${playerProfile.nick}}`, `~[档案ID]~{${playerProfile.ProfileID}}`);

			await ensureSet(playerProfile.ProfileID);

			G.info();
		}
	}
	catch(error) {
		if(error instanceof LogError) { G[error.name](...error.args); }
		else { G.fatal('主线', '轮询错误', error); }
	}
};

G.info('主线', '轮询~[档案快照]', `间隔~{${~~(C.interval / 1000 / 60)}分}`);
setInterval(looper, C.interval);
setTimeout(looper, 1000 * 5);


export { method, handle };
