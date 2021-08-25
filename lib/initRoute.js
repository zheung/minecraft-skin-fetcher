import { resolve, parse, sep, basename, posix } from 'path';
import { pathToFileURL } from 'url';

import ReaddirRecur from 'fs-readdir-recursive';


export default async function initRoute(pathApp) {
	const faces = [];
	const folds = [];

	const pathsAPI = ReaddirRecur(pathApp).filter(p => p.endsWith('.api.js'));

	for(const pathAPI of pathsAPI) {
		const pathFullAPI = resolve(pathApp, pathAPI);

		const api = await import(pathToFileURL(pathFullAPI));


		const pathInfoAPI = parse(pathAPI);
		faces.push({
			route: posix.join(
				...pathInfoAPI.dir.split(sep),
				basename(pathInfoAPI.base, '.api.js')
			),
			method: api.method ?? 'get',
			handle: api.handle
		});
	}

	return { faces, folds };
}