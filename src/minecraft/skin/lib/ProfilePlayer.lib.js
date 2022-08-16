import { G } from '@nuogz/pangu';

import { DB } from '../../../../lib/db.js';

import LogError from './LogError.lib.js';



export const queryPlayerProfile = async (idProfile) => {
	try {
		G.warnU('主线', '查询~[玩家档案]', `? ~[档案ID]~{${idProfile}}`);

		const profilePlayer = await DB.queryOne('SELECT "PlayerID", "isMain" FROM "PlayerProfileMap" WHERE "ProfileID" = $', idProfile);

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
export const createPlayerProfile = async (player, idProfile) => {
	try {
		G.warnU('主线', `更新~[玩家档案]`, `? ~[档案ID]~{${idProfile}}`);

		const profilePlayer = await DB.queryOne('INSERT INTO "PlayerProfileMap"$i RETURNING *', { PlayerID: player.id, ProfileID: idProfile });

		G.infoD('主线', `更新~[玩家档案]`, `✔ ~[档案ID]~{${idProfile}}`);

		return profilePlayer;
	}
	catch(error) { throw new LogError('fatal', '主线', `更新~[玩家档案]`, `✖ ~[档案ID]~{${idProfile}}`, error); }
};
export const ensurePlayerProfile = async (player, idProfile) => (await queryPlayerProfile(idProfile)) ?? (await createPlayerProfile(player, idProfile));
