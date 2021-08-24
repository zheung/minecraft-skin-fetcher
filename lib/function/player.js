import { G } from '../global.js';


export const queryPlayer = async (DB, nick) => {
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

export const createPlayer = async (DB, nick, idProfileMain, idsProfileSubs = []) => {
	try {
		G.warnU('主线', `创建~[玩家]`, `? ~[昵称]~{${nick}}`, `~[主档]~{${idProfileMain}}`);

		const idPlayer = await DB.query('INSERT INTO "player"$i RETURNING "id"', { nick, ProfileMainID: idProfileMain, ProfileSubsIDs: idsProfileSubs });

		G.infoD('主线', `创建~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${idPlayer}}`, `~[主档]~{${idProfileMain}}`);

		return idPlayer;
	}
	catch(error) { G.fatalE('主线', `创建~[玩家]`, `✖ `, error); }
};

export const queryPlayers = async (DB, ) => {
	try {
		G.warnU('主线', `查询~[玩家]`, `? 所有~[玩家]`);

		const idPlayer = await DB.query('SELECT * FROM "player"');

		G.infoD('主线', `查询~[玩家]`, `✔ 所有~[玩家]`);

		return idPlayer;
	}
	catch(error) { G.fatalE('主线', `查询~[玩家]`, `✖ `, error); }
};