import { AmbientLight, BoxGeometry, DirectionalLight, DoubleSide, FaceColors, Mesh, MeshLambertMaterial, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three/build/three.module';
import layoutsSkin from './SkinLayouts.js';


// 真圆周率
const TAU = 2 * Math.PI;
// 角度旋转换算
const radians = d => d * (TAU / 360);

const EPSILON = 1e-3;

const scaleCape = height => {
	if(height % 22 === 0) {
		return height / 22;
	}
	else if(height % 17 === 0) {
		return height / 17;
	}
	else if(height >= 32 && (height & (height - 1)) === 0) {
		return height / 32;
	}
	else {
		return Math.max(1, Math.floor(height / 22));
	}
};

// 图片转画布
const createCanvas = (image, x = 0, y = 0, w = image.width, h = image.height) => {
	const canvas = document.createElement('canvas');

	canvas.width = w;
	canvas.height = h;
	canvas.getContext('2d').drawImage(image, x, y, w, h, 0, 0, w, h);

	return canvas;
};

// 将画布像素转换为无透明
function makeCanvasOpaque(canvas) {
	const ctx = canvas.getContext('2d');
	const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = data.data;

	for(let p = 3; p < pixels.length; p += 4) { pixels[p] = 255; }
	ctx.putImageData(data, 0, 0);

	return canvas;
}

const createMaterial = alpha => {
	const material = new MeshLambertMaterial({
		vertexColors: FaceColors,
		opacity: alpha / 255,
		transparent: (alpha != 255),
	});
	material.side = DoubleSide;

	return material;
};

/** 染色 */
const dye = (geometry, canvas, rectangles) => {
	if(!rectangles) return null;

	const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

	const faces = [];
	const materials = [];

	const indexsMaterial_alpha = {};


	let f = 0;
	Object.keys(rectangles).forEach(function(k) {
		const rect = rectangles[k];

		const width = Math.abs(rect.w);
		const height = Math.abs(rect.h);

		const dj = Math.sign(rect.w);
		const di = Math.sign(rect.h);
		for(let y = 0, i = rect.y; y < height; y++, i += di) {
			for(let x = 0, j = rect.x; x < width; x++, j += dj, f += 2) {
				const posPoint = 4 * (i * canvas.width + j);

				const r = pixels[posPoint + 0];
				const g = pixels[posPoint + 1];
				const b = pixels[posPoint + 2];
				const a = pixels[posPoint + 3];

				// 透明像素不处理
				if(a === 0) { continue; }


				// 一个矩形包括两个三角形
				const face1 = geometry.faces[f];
				const face2 = geometry.faces[f + 1];

				// 三角形着色
				face1.color.r = r / 255;
				face1.color.g = g / 255;
				face1.color.b = b / 255;
				face2.color = face1.color;

				// 三角形设置对应的透明度
				const indexMaterial = indexsMaterial_alpha[a] ||
					(indexsMaterial_alpha[a] = materials.push(createMaterial(a)) - 1);
				face1.materialIndex = indexMaterial;
				face2.materialIndex = indexMaterial;


				faces.push(face1);
				faces.push(face2);
			}
		}
	});


	if(faces.length) {
		geometry.faces = faces;
	}

	return new Mesh(geometry, materials);
};

export default class SkinManager {
	constructor(canvas) {
		/**
		 * @type {HTMLCanvasElement}
		 */
		this.canvas = canvas;

		this.theta = 34;
		this.phi = -90;
		this.time = 90;

		this.isAnimate = true;


		this.model = null;

		this.dragState = {};

		this.inited = false;

		this.initRenderer();
		this.initSence();
		this.initCamera();

		this.initRotation();
		this.initDrop();
	}


	initRenderer() {
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
			antialias: true
		});
	}
	initSence() {
		this.scene = new Scene();

		this.scene.add(new AmbientLight(0xFFFFFF, 0.7));

		const dirLight = new DirectionalLight(0xFFFFFF, 0.4);
		dirLight.position.set(0.67763, 0.28571, 0.67763);

		this.scene.add(dirLight);
	}
	initCamera() {
		this.camera = new PerspectiveCamera(45, this.canvas.width / this.canvas.height, 1, 2000);
		this.camera.position.set(0, 60, 0);
		this.camera.lookAt(new Vector3(0, 0, 0));
	}
	initDrop() {
		this.canvas.addEventListener('dragenter', e => { e.stopPropagation(); e.preventDefault(); }, false);
		this.canvas.addEventListener('dragover', e => { e.stopPropagation(); e.preventDefault(); }, false);
		this.canvas.addEventListener('drop', e => {
			e.stopPropagation();
			e.preventDefault();

			this.applyURLImage(URL.createObjectURL(e.dataTransfer.files[0]));
		}, false);
	}


	initRotation() {
		this.canvas.addEventListener('mousedown', e => e.preventDefault(this.rotateStart('mouse', e.screenX, e.screenY)));
		window.addEventListener('mouseup', () => this.rotateEnd('mouse'));
		window.addEventListener('mousemove', e => this.rotating('mouse', e.screenX, e.screenY));


		this.canvas.addEventListener('touchstart', e => {
			for(const touch of e.changedTouches) { this.rotateStart(touch.identifier, touch.screenX, touch.screenY); }
		});
		this.canvas.addEventListener('touchend', e => {
			for(const touch of e.changedTouches) { this.rotateEnd(touch.identifier); }
		});
		this.canvas.addEventListener('touchmove', e => {
			let result = false;

			for(const touch of e.changedTouches) {
				if(this.rotating(touch.identifier, touch.screenX, touch.screenY)) {
					result = true;
				} else {
					delete this.dragState[touch.identifier];
				}
			}

			if(result) { e.preventDefault(); }
		});
	}
	rotateStart(id, screenX, screenY) { this.dragState[id] = { x: screenX, y: screenY }; }
	rotateEnd(id) { delete this.dragState[id]; }
	rotating(id, screenX, screenY) {
		if(!this.dragState[id]) { return false; }

		let result = true;

		this.theta += screenX - this.dragState[id].x;
		this.phi += screenY - this.dragState[id].y;

		if(this.phi < -90) {
			this.phi = -90;
			result = false;
		}
		else if(this.phi > 90) {
			this.phi = 90;
			result = false;
		}

		this.model.rotation.y = radians(this.theta);
		this.model.rotation.x = radians(this.phi);

		this.renderer.render(this.scene, this.camera);

		this.dragState[id].x = screenX;
		this.dragState[id].y = screenY;

		return result;
	}


	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		// this.renderer.setSize(width, height,true);
		this.camera.updateProjectionMatrix();
	}


	applyURLImage(srcImage, isSlim = false) {
		const imageSkin = new Image();

		imageSkin.crossOrigin = '';
		imageSkin.src = srcImage;

		imageSkin.addEventListener('load', () => {
			const model = this.buildModel(imageSkin, isSlim);

			if(model) { this.applyModel(model); }
		});
	}
	applyModel(model) {
		this.scene.remove(this.model);
		this.scene.add(this.model = model);

		this.model.rotation.x = radians(this.phi);
		this.model.rotation.y = radians(this.theta);

		this.render();

		if(this.isAnimate) {
			this.timestamp = Date.now();
			window.requestAnimationFrame(this.renderAnimation.bind(this));
		}
	}


	render() {
		const angle = Math.sin(radians(this.time));
		this.model.children[2].rotation.x = -radians(18) * angle;
		this.model.children[3].rotation.x = radians(18) * angle;
		this.model.children[4].rotation.x = radians(20) * angle;
		this.model.children[5].rotation.x = -radians(20) * angle;

		if(this.model.children[6]) {
			let capeAngle = Math.sin(radians(this.time / 4));
			this.model.children[6].rotation.x = radians(18) - radians(6) * capeAngle;
		}

		this.renderer.render(this.scene, this.camera);

		if(this.canvas !== this.renderer.domElement) {
			this.canvas.getContext('2d').drawImage(this.renderer.domElement, 0, 0);
		}
	}

	renderAnimation() {
		if(this.isAnimate) {
			const now = Date.now();

			this.time += (now - this.timestamp) * (360 / 1500);
			this.timestamp = now;

			this.render();

			window.requestAnimationFrame(this.renderAnimation.bind(this));
		}
	}


	buildModel(skinImage, isSlim = false, capeImage) {
		if(skinImage.width < 64 || skinImage.height < 32) {
			return null;
		}

		/** 皮肤版本 */
		const version = (skinImage.height >= 64 ? 2 : 1);
		const layoutSkin = layoutsSkin[version];

		const widthArm = isSlim ? 3 : 4;
		const flagSlim = isSlim ? 'S' : '';

		// 第一层皮肤, 完全不透明
		const canvasSkin1 = makeCanvasOpaque(createCanvas(skinImage));
		// 第二层皮肤
		const canvasSkin2 = createCanvas(skinImage);

		// 玩家组
		const groupPlayer = new Object3D();

		const groupHead = new Object3D();
		const groupTorso = new Object3D();
		const groupArmR = new Object3D();
		const groupArmL = new Object3D();
		const groupLegR = new Object3D();
		const groupLegL = new Object3D();

		groupPlayer.add(groupHead);
		groupPlayer.add(groupTorso);
		groupPlayer.add(groupArmR);
		groupPlayer.add(groupArmL);
		groupPlayer.add(groupLegR);
		groupPlayer.add(groupLegL);

		groupHead.position.set(0, 10, 0);
		groupTorso.position.set(0, 0, 0);
		groupArmR.position.set(isSlim ? -5.5 : -6, 4, 0);
		groupArmL.position.set(isSlim ? 5.5 : 6, 4, 0);
		groupLegR.position.set(-2, -6, 0);
		groupLegL.position.set(2, -6, 0);


		// 第一层
		groupHead.add(dye(new BoxGeometry(8, 8, 8, 8, 8, 8), canvasSkin1, layoutSkin.head[0]));
		groupTorso.add(dye(new BoxGeometry(8 + EPSILON, 12 + EPSILON, 4 + EPSILON, 8, 12, 4), canvasSkin1, layoutSkin.torso[0]));
		groupArmR.add(dye(new BoxGeometry(widthArm, 12, 4, widthArm, 12, 4).translate(0, -4, 0), canvasSkin1, layoutSkin[`armR${flagSlim}`][0]));
		groupArmL.add(dye(new BoxGeometry(widthArm, 12, 4, widthArm, 12, 4).translate(0, -4, 0), canvasSkin1, layoutSkin[`armL${flagSlim}`][0]));
		groupLegR.add(dye(new BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0), canvasSkin1, layoutSkin.legR[0]));
		groupLegL.add(dye(new BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0), canvasSkin1, layoutSkin.legL[0]));


		// 第二层
		groupHead.add(dye(new BoxGeometry(9, 9, 9, 8, 8, 8), canvasSkin2, layoutSkin.head[1]));
		if(version >= 2) {
			groupTorso.add(dye(new BoxGeometry(8.5 + EPSILON, 12.5 + EPSILON, 4.5 + EPSILON, 8, 12, 4), canvasSkin2, layoutSkin.torso[1]));
			groupArmR.add(dye(new BoxGeometry((widthArm + 0.5) + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, widthArm, 12, 4).translate(0, -4, 0), canvasSkin2, layoutSkin[`armR${flagSlim}`][1]));
			groupArmL.add(dye(new BoxGeometry((widthArm + 0.5) + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, widthArm, 12, 4).translate(0, -4, 0), canvasSkin2, layoutSkin[`armL${flagSlim}`][1]));
			groupLegR.add(dye(new BoxGeometry(4.5 + EPSILON * 2, 12.5 + EPSILON * 2, 4.5 + EPSILON * 2, 4, 12, 4).translate(0, -6, 0), canvasSkin2, layoutSkin.legR[1]));
			groupLegL.add(dye(new BoxGeometry(4.5 + EPSILON * 3, 12.5 + EPSILON * 3, 4.5 + EPSILON * 3, 4, 12, 4).translate(0, -6, 0), canvasSkin2, layoutSkin.legL[1]));
		}


		// 披风
		if(capeImage) {
			const canvasCape = makeCanvasOpaque(capeImage);

			const cs = scaleCape(capeImage.height);

			const groupCape = new Object3D();

			groupPlayer.add(groupCape);

			groupCape.position.set(0, 8, -2);
			groupCape.rotation.y += radians(180);

			groupCape.add(dye(new BoxGeometry(10, 16, 1, 10 * cs, 16 * cs, cs).translate(0, -8, 0.5), canvasCape, {
				l: { x: 11 * cs, y: cs, w: cs, h: 16 * cs },
				r: { x: 0, y: cs, w: cs, h: 16 * cs },
				u: { x: cs, y: 0, w: 10 * cs, h: cs },
				d: { x: 11 * cs, y: cs - 1, w: 10 * cs, h: -cs },
				f: { x: cs, y: cs, w: 10 * cs, h: 16 * cs },
				b: { x: 12 * cs, y: cs, w: 10 * cs, h: 16 * cs },
			}));
		}

		return groupPlayer;
	}
}