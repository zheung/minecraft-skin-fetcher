import Axios from 'axios';

import { $alert } from '../lib/plugin/alert/index.js';

export const prefixDefault = './api';

export const parseURLAction = function(action, prefix = prefixDefault) {
	return `${prefix}${prefix.endsWith('/') ? '' : '/'}${action}`;
};

export const conn = async function(action, params, configRaw = {}) {
	const urlAction = parseURLAction(action, configRaw.prefix);

	const config = Object.assign({ params }, configRaw);

	const response = await Axios.get(urlAction, config);

	const result = response.data;

	if(result.success) {
		if(result.message) { await $alert(result.message); }

		return result.data;
	}
	else {
		throw result.message || '请求不成功';
	}
};

export const post = async function(action, params, configRaw = {}) {
	const urlAction = parseURLAction(action, configRaw.prefix);

	const config = Object.assign({}, configRaw);

	if(params instanceof FormData) {
		if(typeof config.headers == 'object' && config.headers) {
			config.headers['Content-Type'] = 'multipart/form-data';
		}
		else {
			config.headers = { 'Content-Type': 'multipart/form-data' };
		}
	}

	const response = await Axios.post(urlAction, params, config);

	const result = response.data;

	if(result.success) {
		if(result.message) { await $alert(result.message); }

		return result.data;
	}
	else {
		throw result.message || '请求不成功';
	}
};