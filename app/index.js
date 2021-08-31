/*
	前端系统的JavaScript入口，主要作用：
	1、创建Vue的主应用并挂载
	2、加载数据总线B（BUS的意思）
	3、加载各种依赖Vue的公共插件，如图标、提示、菜单

	注1：编译环境为Vite，语言环境为最新的ESNext，目前支持ES2021，打包目标为ES2015
	注2：调试环境必须的原生支持ES Import的现代浏览器，线上环境支持ES2015（ES6）即可
	注3：不依赖Vue的独立工具一切使用ES Import/Export的标准模块化。只在使用时导入，以便Vite打包时自动分析裁剪
	注4：请合理配置VSCode以启用足够的智能提示功能
*/

import './lib/css/index.pcss';

import { createApp } from 'vue';

import B from './lib/bus.js';

import App from './index.vue';
import pluginAlert from './lib/plugin/alert/index.js';

window.B = B;

window.addEventListener('load', async () => {
	const app = B.app = createApp(App);

	app.mixin({
		data() { return { B }; }
	});
	app.config.globalProperties.$app = app;

	pluginAlert.install(app);

	app.mount('#app');
});