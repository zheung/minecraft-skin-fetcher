import { G } from '../global.js';
import LogError from '../LogError.js';


export const queryPlayerProfile = async (DB, idProfile) => {
	try {
		G.warnU('主线', '查询~[玩家档案]', `? ~[档案ID]~{${idProfile}}`);

		const profilePlayer = await DB.queryOne('SELECT "PlayerID", "isMain" FROM "PlayerProfile" WHERE "ProfileID" = $', idProfile);

		if(profilePlayer) {
			G.infoD('主线', `查询~[玩家档案]`, `✔ ~[档案ID]~{${idProfile}}`);
		}
		else {
			G.warnD('主线', '查询~[玩家档案]', `不存在 ~[档案ID]~{${idProfile}}`);
		}

		return profilePlayer;
	}
	catch(error) { throw new LogError('fatal', '主线', '查询~[玩家档案]', `✖ `, error); }
};
export const createPlayerProfile = async (DB, player, idProfile) => {
	try {
		G.warnU('主线', `更新~[玩家档案]`, `? ~[档案ID]~{${idProfile}}`);

		const profilePlayer = await DB.queryOne('INSERT INTO "PlayerProfile"$i RETURNING *', { PlayerID: player.id, ProfileID: idProfile });

		G.infoD('主线', `更新~[玩家档案]`, `✔ ~[档案ID]~{${idProfile}}`);

		return profilePlayer;
	}
	catch(error) { throw new LogError('fatal', '主线', `更新~[玩家档案]`, `✖ ~[档案ID]~{${idProfile}}`, error); }
};
export const ensurePlayerProfile = async (DB, player, idProfile) => (await queryPlayerProfile(DB, idProfile)) ?? (await createPlayerProfile(DB, player, idProfile));