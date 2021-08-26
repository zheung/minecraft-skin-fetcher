import * as THREE from 'three/build/three.module.js';
import animateSkin from './animateSkin.js';
import C, { radians } from './tool.js';
import enableRotation from './enableRotation.js';
import render from './render.js';

export default function renderSkinHelper(option, model) {
	if(C.renderState) {
		C.renderState.canvas = C.canvas3d;
		C.renderState.scene.remove(C.renderState.model);
		C.renderState.model = model;
		C.renderState.scene.add(model);
		C.renderState.animate = option.animate;
		C.renderState.model.rotation.y = radians(option.theta);
		C.renderState.model.rotation.x = radians(option.phi);
		render();
		return;
	}
	if(!C.renderer) {
		C.renderer = new THREE.WebGLRenderer({
			canvas: C.canvas3d,
			alpha: true,
			antialias: true
		});
	}
	C.renderState = {
		canvas: C.canvas3d,
		animate: option.animate,
		model: model,
		theta: option.theta,
		phi: option.phi,
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(38, C.canvas3d.width / C.canvas3d.height, 60 - 20, 60 + 20),
		renderer: C.renderer,
		dragState: {},
		time: option.time
	};
	C.renderState.camera.position.x = 0;
	C.renderState.camera.position.z = 60;
	C.renderState.camera.position.y = 0;
	C.renderState.camera.lookAt(new THREE.Vector3(0, 0, 0));
	C.renderState.scene.add(model);
	let ambLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
	let dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
	dirLight.position.set(0.67763, 0.28571, 0.67763);
	C.renderState.scene.add(ambLight);
	C.renderState.scene.add(dirLight);
	C.renderState.model.rotation.y = radians(option.theta);
	C.renderState.model.rotation.x = radians(option.phi);
	enableRotation(C.renderState);
	render();
	if(C.renderState.animate) {
		for(let e of document.getElementsByClassName('play-pause-btn')) {
			animateSkin(e);
		}
	}
}