import buildMinecraftModel from './buildMinecraftModel.js';
import handleModel from './handleModel.js';

export default function handleImages(option, skinImage, capeImage) {
	const model = buildMinecraftModel(option, skinImage, capeImage);

	if(model) {
		handleModel(option, model);
	}
}