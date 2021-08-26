import C from './tool.js';
import render from './render.js';

export default function renderAnimation() {
	if(C.renderState.animate) {
		let now = Date.now();
		C.renderState.time += (now - C.renderState.timestamp) * (360 / 1500);
		C.renderState.timestamp = now;
		render();
		window.requestAnimationFrame(renderAnimation);
	}
}