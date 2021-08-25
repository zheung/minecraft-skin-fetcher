import { wocks } from './libAPI/bus.lib.js';


const method = 'wock';

const handle = function(raw, wock, route, $) {
	if(raw?.auth == 'lf') {
		wocks.add(wock);

		$.logTrace('添加 [客户端]', `数量{${wocks.size}}`);

		return { auth: true, platform: process.platform };
	}
};

export { method, handle };