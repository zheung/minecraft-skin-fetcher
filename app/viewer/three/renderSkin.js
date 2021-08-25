import handleImages from './handleImages.js';

export default function renderSkin(option, src) {
	const imageSkin = new Image();
	imageSkin.crossOrigin = '';
	imageSkin.src = src;
	imageSkin.addEventListener('load', () => handleImages(option, imageSkin, null));
}