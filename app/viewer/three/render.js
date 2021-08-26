import C, { radians } from './tool.js';

export default function render() {
	// C.canvas3d.attr('data-time', Math.round(C.renderState.time) % 360);
	// renderButton.attr('href', 'https://render.namemc.com/skin/3d/body.png?' + 'skin=' + canvas3d.attr('data-skin-hash') + '&model=' + canvas3d.attr('data-model') + '&theta=' + canvas3d.attr('data-theta') + '&phi=' + canvas3d.attr('data-phi') + '&time=' + canvas3d.attr('data-time') + '&width=600' + '&height=800');

	// 走路动作
	// let angle = Math.sin(radians(C.renderState.time));

	// C.renderState.model.children[2].rotation.x = -radians(18) * angle;
	// C.renderState.model.children[3].rotation.x = radians(18) * angle;
	// C.renderState.model.children[4].rotation.x = radians(20) * angle;
	// C.renderState.model.children[5].rotation.x = -radians(20) * angle;
	// if(C.renderState.model.children[6]) {
	// 	let capeAngle = Math.sin(radians(C.renderState.time / 4));
	// 	C.renderState.model.children[6].rotation.x = radians(18) - radians(6) * capeAngle;
	// }

	C.renderState.renderer.render(C.renderState.scene, C.renderState.camera);
	if(C.renderState.canvas !== C.renderState.renderer.domElement) {
		C.renderState.canvas.getContext('2d').drawImage(C.renderState.renderer.domElement, 0, 0);
	}
}