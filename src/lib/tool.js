/**
 * 通过JSON化函数深度拷贝数据
 * @param {any} object 可JSON化的数据
 */
export const copyJSON = object => JSON.parse(JSON.stringify(object));


export const randomString = (len = 32) => {
	let dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let max = dict.length;

	let result = '';

	for(let i = 0; i < len; i++) {
		result += dict.charAt(Math.floor(Math.random() * max));
	}

	return result;
};
