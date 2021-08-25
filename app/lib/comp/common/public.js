// 非标准HTML布尔属性: undefined|null|"false"|false为false, 其他任意值为true
export const parseBoolAttr = function(value) {
	return (
		value === undefined ||
		value === null ||
		value === false ||
		(typeof value == 'string' && value.toLowerCase() == 'false')
	)
		? false
		: true;
};