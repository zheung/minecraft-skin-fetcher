import { readFileSync } from 'fs';


const method = 'get';

const handle = function() {
	try {
		return JSON.parse(readFileSync('package.json', 'utf8')).version;
	}
	catch {
		return 'error';
	}
};

export { method, handle };