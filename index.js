import { writeFileSync } from 'fs';
import { resolve } from 'path';

import Axios from 'axios';
import Moment from 'moment';

import { C, G } from './lib/global.js';


(async function() {
	const { data: { id: uuid } } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${C.userName}`);

	const { data: { properties: [{ value: skinInfoBase64 }] } } = await Axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

	const { textures: { SKIN: { url } } } = JSON.parse(Buffer.from(skinInfoBase64, 'base64').toString());

	const { data: skinBuffer } = await Axios.get(url, { responseType: 'arraybuffer' });

	writeFileSync(resolve(C.path.save, `${C.userName}-${Moment().format('YYMMDDHHMMSS')}.png`), skinBuffer);

	G.info('程序', '完成');
})();