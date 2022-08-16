import { G } from '@nuogz/pangu';

import { DB } from '../../../../lib/db.js';

import LogError from './LogError.lib.js';



export const queryPlayer = async (nick) => {
	try {
		G.warnU('主线', '查询~[玩家]', `? ~[昵称]~{${nick}}`);

		const player = await DB.queryOne('SELECT * FROM "Player" WHERE "nick" = $', nick);

		if(player) {
			G.infoD('主线', `查询~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${player.id}}`);
		}
		else {
			G.warnD('主线', '查询~[玩家]', `不存在 ~[昵称]~{${nick}}`);
		}

		return player;
	}
	catch(error) { throw new LogError('fatal', '主线', '查询~[玩家]', `✖ ~[昵称]~{${nick}}`, error); }
};
export const createPlayer = async (nick) => {
	try {
		G.warnU('主线', `创建~[玩家]`, `? ~[昵称]~{${nick}}`);

		const player = await DB.queryOne('INSERT INTO "Player"$i RETURNING *', { nick });

		G.infoD('主线', `创建~[玩家]`, `✔ ~[昵称]~{${nick}} ~[id]~{${player.id}}`);

		return player;
	}
	catch(error) { throw new LogError('fatal', '主线', `创建~[玩家]`, `✖ ~[昵称]~{${nick}}`, error); }
};
export const ensurePlayer = async (nick) => (await queryPlayer(nick)) ?? (await createPlayer(nick));


export const queryPlayerProfiles = async () => {
	try {
		G.warnU('主线', `查询所有~[玩家]`, `? `);

		const players = await DB.query('SELECT P."nick", PP."ProfileID" FROM "PlayerProfileMap" PP LEFT JOIN "Player" P ON (P."id" = PP."PlayerID")');

		G.infoD('主线', `查询所有~[玩家]`, `✔ `);

		return players;
	}
	catch(error) { throw new LogError('fatal', '主线', `查询所有~[玩家]`, `✖ `, error); }
};
