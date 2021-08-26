
// 真圆周率
export const TAU = 2 * Math.PI;
// 角度旋转换算
export const radians = d => d * (TAU / 360);

export const EPSILON = 1e-3;

export default {
	renderState: null,
	renderer: null,
	canvas3d: null,
	TAU,
	EPSILON,
};