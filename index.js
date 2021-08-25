import { resolve } from 'path';

import Desire from '@nuogz/desire';

import { C, G, B, dirApp } from './lib/global.js';
import Postgre from './lib/Postgre.js';
import initRoute from './lib/initRoute.js';


(async () => {
	B.db = await new Postgre(C.$db);

	const { folds, faces } = await initRoute(resolve(dirApp, 'app'));

	await new Desire({
		name: '服务',
		host: C.server.host,
		port: C.server.port,

		mare: { before: ['parseRaw'] },

		facePrefix: '/api',
		faces,

		folds: folds.concat([
			{
				route: '/',
				path: resolve(dirApp, 'dist')
			},
		]),

		logger: G,
	}).start();
})();