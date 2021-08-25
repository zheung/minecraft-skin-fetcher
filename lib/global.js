import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import Poseidon from '@nuogz/poseidon';
import Hades from '@nuogz/hades';


process.title = 'minecraft-skin-manager';
// eslint-disable-next-line no-unused-vars, no-debugger
process.on('unhandledRejection', (error, promise) => { G.fatal('进程', '未处理的拒绝', error); debugger; });


export const dirLib = dirname(fileURLToPath(import.meta.url));
export const dirApp = resolve(dirLib, '..');

export const dirConfig = resolve(dirApp, 'config');
export const dirLog = resolve(dirApp, 'log');

export const C = new Poseidon('_,log,$db', dirConfig);
export const G = new Hades(C.log.name, C.log.level, dirLog, C.log.option);
export const B = { db: null };
