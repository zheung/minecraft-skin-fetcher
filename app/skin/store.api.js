import { ensurePlayer } from './lib/Player.lib.js';
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

	const idProfile = await fetchProfileID(name);
	const player = await ensurePlayer(nick);

	await ensurePlayerProfile(player, idProfile);
	await ensureSet(idProfile);

	return {
		success: true,
		data: idProfile
	};
};


export { method, handle };