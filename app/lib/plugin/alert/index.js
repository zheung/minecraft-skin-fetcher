import { createApp } from 'vue';

import compAlert from './comp.vue';


const pluginAlert = {
	instance: null,

	showBox(
		text = '', title = '提示', cancelButton = true,
		btnText1 = null, btnValue1 = null,
		btnText2 = null, btnValue2 = null,
		btnText3 = null, btnValue3 = null,
	) {
		if(!pluginAlert.$app.$instance) { return; }

		pluginAlert.$app.$instance.title = String(title);
		pluginAlert.$app.$instance.text = String(text);

		pluginAlert.$app.$instance.btnText1 = (btnText1 === null || btnText1 === undefined) ? null : String(btnText1);
		pluginAlert.$app.$instance.btnValue1 = (btnValue1 === null || btnValue1 === undefined) ? null : String(btnValue1);
		pluginAlert.$app.$instance.btnText2 = (btnText2 === null || btnText2 === undefined) ? null : String(btnText2);
		pluginAlert.$app.$instance.btnValue2 = (btnValue2 === null || btnValue2 === undefined) ? null : String(btnValue2);
		pluginAlert.$app.$instance.btnText3 = (btnText3 === null || btnText3 === undefined) ? null : String(btnText3);
		pluginAlert.$app.$instance.btnValue3 = (btnValue3 === null || btnValue3 === undefined) ? null : String(btnValue3);

		pluginAlert.$app.$instance.cancelButton = Boolean(cancelButton);

		return new Promise(function(resolve) {
			pluginAlert.$app.$instance.waiter = resolve;
			pluginAlert.$app.$instance.show = true;
		});
	},

	$alert: function(text, title = '提示', btnText = '确定', btnValue = true) {
		return pluginAlert.showBox(text, title, false, btnText, btnValue);
	},

	install(app) {
		const elAlert = document.createElement('div');
		document.body.appendChild(elAlert);

		const appAlert = pluginAlert.$app = createApp(compAlert);
		appAlert.config.globalProperties.$app = appAlert;
		appAlert.mount(elAlert);

		app.config.globalProperties.$alert = alert;
		app.config.globalProperties.$quest = quest;
		app.config.globalProperties.$save = save;
		app.config.globalProperties.$okay = okay;
		app.config.globalProperties.$fail = fail;
	}
};

const alert = function(text, title = '提示', btnText = '确定', btnValue = true) {
	return pluginAlert.showBox(text, title, false, btnText, btnValue);
};
const quest = function(text, title = '提示', btnText1 = '是', btnText2 = '否', btnValue1 = true, btnValue2 = false) {
	return pluginAlert.showBox(text, title, false, btnText1, btnValue1, btnText2, btnValue2);
};
const save = function(text, title = '提示', btnText1 = '是', btnText2 = '否', btnText3 = '取消', btnValue1 = true, btnValue2 = false, btnValue3 = 'cancel') {
	return pluginAlert.showBox(text, title, true, btnText1, btnValue1, btnText2, btnValue2, btnText3, btnValue3);
};
const okay = function(action = '操作', title = '成功', next, btnText = '确定', btnValue = true) {
	const text = `${action}成功${next ? `。${next}` : ''}`;

	return pluginAlert.showBox(text, title, true, btnText, btnValue);
};
const fail = function(action = '操作', error, title = '失败', btnText = '确定', btnValue = true) {
	const text = (`${action}失败，原因：${error.message || error || '未知'}`);

	return pluginAlert.showBox(text, title, true, btnText, btnValue);
};


export default pluginAlert;
export const $alert = alert;
export const $quest = quest;
export const $save = save;
export const $okay = okay;
export const $fail = fail;