import C from './const.js';
import renderAnimation from './renderAnimation.js';

export default function animateSkin(e, toggle) {
	// C.renderState.animate = getCookie('animate') === 'true';
	if(toggle) {
		C.renderState.animate = !C.renderState.animate;
		// setCookie('animate', C.renderState.animate.toString());
	}
	if(C.renderState.animate) {
		e.children[0].classList.remove('fa-play');
		e.children[0].classList.add('fa-pause');
		// C.canvas3d.parent().removeClass('animation-paused');
		C.renderState.timestamp = Date.now();
		window.requestAnimationFrame(renderAnimation);
	} else {
		e.children[0].classList.remove('fa-pause');
		e.children[0].classList.add('fa-play');
		// C.canvas3d.parent().addClass('animation-paused');
	}
}