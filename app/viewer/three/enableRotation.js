import radians from './radians.js';

export default function enableRotation(renderState) {
	function startRotation(t, id) {
		renderState.dragState[id] = {
			x: t.screenX,
			y: t.screenY
		};
	}
	function rotate(t, id) {
		if(!renderState.dragState[id]) {
			return false;
		}
		let result = true;
		renderState.theta += t.screenX - renderState.dragState[id].x;
		renderState.phi += t.screenY - renderState.dragState[id].y;
		renderState.canvas.setAttribute('data-theta', (renderState.theta % 360).toString());
		renderState.canvas.setAttribute('data-phi', (renderState.phi % 360).toString());
		// renderButton.attr('href', 'https://render.namemc.com/skin/3d/body.png?' + 'skin=' + canvas3d.attr('data-skin-hash') + '&model=' + canvas3d.attr('data-model') + '&theta=' + canvas3d.attr('data-theta') + '&phi=' + canvas3d.attr('data-phi') + '&time=' + canvas3d.attr('data-time') + '&width=600' + '&height=800');
		if(renderState.phi < -90) {
			renderState.phi = -90;
			result = false;
		} else if(renderState.phi > 90) {
			renderState.phi = 90;
			result = false;
		}
		renderState.model.rotation.y = radians(renderState.theta);
		renderState.model.rotation.x = radians(renderState.phi);
		renderState.renderer.render(renderState.scene, renderState.camera);
		renderState.dragState[id].x = t.screenX;
		renderState.dragState[id].y = t.screenY;
		return result;
	}
	function endRotation(t, id) {
		delete renderState.dragState[id];
	}
	renderState.canvas.onmousedown = function(e) {
		e.preventDefault();
		startRotation(e, 'mouse');
	};
	window.onmousemove = function(e) {
		rotate(e, 'mouse');
	};
	window.onmouseup = function(e) {
		endRotation(e, 'mouse');
	};
	renderState.canvas.ontouchstart = function(e) {
		for(let i = 0; i < e.changedTouches.length; i++) {
			startRotation(e.changedTouches[i], e.changedTouches[i].identifier);
		}
	};
	renderState.canvas.ontouchmove = function(e) {
		let result = false;
		for(let i = 0; i < e.changedTouches.length; i++) {
			if(rotate(e.changedTouches[i], e.changedTouches[i].identifier)) {
				result = true;
			} else {
				delete renderState.dragState[e.changedTouches[i].identifier];
			}
		}
		if(result) {
			e.preventDefault();
		}
	};
	renderState.canvas.ontouchend = renderState.canvas.ontouchcancel = function(e) {
		for(let i = 0; i < e.changedTouches.length; i++) {
			endRotation(e.changedTouches[i], e.changedTouches[i].identifier);
		}
	};
}