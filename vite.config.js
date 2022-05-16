import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { defineConfig } from 'vite';
import pluginVue from '@vitejs/plugin-vue';


const dirPackage = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		pluginVue({
			template: {
				compilerOptions: {
					isCustomElement: tag => /^((module-|sub-|comp-).+?|module)$/.test(tag)
				}
			}
		}),
	],
	root: resolve(dirPackage, 'app'),
	base: './',
	build: {
		outDir: resolve(dirPackage, 'dist'),
		emptyOutDir: true,
		chunkSizeWarningLimit: 1024
	},
	server: {
		port: 4788,
		proxy: {
			'^/api/': {
				target: 'http://127.0.0.1:14788',
				changeOrigin: true,
			},
		}
	}
});
