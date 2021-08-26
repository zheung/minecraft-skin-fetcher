import * as THREE from 'three/build/three.module.js';

import { EPSILON, radians } from './tool.js';
import skinLayout from './layout.js';


function capeScale(height) {
	if(height % 22 === 0) {
		return height / 22;
	} else if(height % 17 === 0) {
		return height / 17;
	} else if(height >= 32 && (height & (height - 1)) === 0) {
		return height / 32;
	} else {
		return Math.max(1, Math.floor(height / 22));
	}
}

// 图片转画布
function createCanvas(image, x, y, w, h) {
	x = (typeof x === 'undefined' ? 0 : x);
	y = (typeof y === 'undefined' ? 0 : y);
	w = (typeof w === 'undefined' ? image.width : w);
	h = (typeof h === 'undefined' ? image.height : h);
	let canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	let ctx = canvas.getContext('2d');
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
	return canvas;
}

// 将画布像素转换为无透明
function makeOpaque(image) {
	let canvas = createCanvas(image);
	let ctx = canvas.getContext('2d');
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let pixels = data.data;

	for(let p = 3; p < pixels.length; p += 4) { pixels[p] = 255; }
	ctx.putImageData(data, 0, 0);

	return canvas;
}
// 判断是否半透明像素
function hasAlphaLayer(image) {
	let canvas = createCanvas(image);
	let ctx = canvas.getContext('2d');
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let pixels = data.data;
	for(let p = 3; p < pixels.length; p += 4) {
		if(pixels[p] !== 255) {
			return true;
		}
	}
	return false;
}

function colorFaces(geometry, canvas, rectangles) {
	if(!rectangles) return null;

	let pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
	let f = 0;
	let faces = [];
	let materials = [];
	let materialIndexMap = {};
	let side = THREE.FrontSide;

	Object.keys(rectangles).forEach(function(k) {
		const rect = rectangles[k];

		const width = Math.abs(rect.w);
		const height = Math.abs(rect.h);

		let dj = Math.sign(rect.w);
		let di = Math.sign(rect.h);

		for(let y = 0, i = rect.y; y < height; y++, i += di) {
			for(let x = 0, j = rect.x; x < width; x++, j += dj, f += 2) {
				let p = 4 * (i * canvas.width + j);
				let a = pixels[p + 3];
				if(a === 0) {
					side = THREE.DoubleSide;
					continue;
				}
				let materialIndex = materialIndexMap[a];
				if(typeof materialIndex === 'undefined') {
					materials.push(new THREE.MeshLambertMaterial({
						vertexColors: THREE.FaceColors,
						opacity: a / 255,
						transparent: (a !== 255)
					}));
					materialIndex = materials.length - 1;
					materialIndexMap[a] = materialIndex;
					if(a !== 255) {
						side = THREE.DoubleSide;
					}
				}
				let face1 = geometry.faces[f];
				let face2 = geometry.faces[f + 1];
				face1.color.r = pixels[p] / 255;
				face1.color.g = pixels[p + 1] / 255;
				face1.color.b = pixels[p + 2] / 255;
				face2.color = face1.color;
				face1.materialIndex = materialIndex;
				face2.materialIndex = materialIndex;

				faces.push(face1);
				faces.push(face2);
			}
		}
	});

	if(faces.length === 0) return null;

	geometry.faces = faces;
	materials.forEach(function(m) {
		m.side = side;
	});

	return new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), materials);
}


export default function buildMinecraftModel(option, skinImage) {
	if(skinImage.width < 64 || skinImage.height < 32) {
		return null;
	}

	const version = (skinImage.height >= 64 ? 2 : 1);
	const layoutSkin = skinLayout[version];

	let opaqueSkinCanvas = makeOpaque(skinImage);
	let transparentSkinCanvas = createCanvas(skinImage);

	let hasAlpha = hasAlphaLayer(skinImage);

	// 玩家
	const playerGroup = new THREE.Object3D();

	// 头
	let headGroup = new THREE.Object3D();
	headGroup.position.x = 0;
	headGroup.position.y = 12;
	headGroup.position.z = 0;
	let box = new THREE.BoxGeometry(8, 8, 8, 8, 8, 8);
	let headMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['head'][0]);
	headGroup.add(headMesh);
	if(hasAlpha) {
		box = new THREE.BoxGeometry(9, 9, 9, 8, 8, 8);
		let hatMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['head'][1]);
		hatMesh && headGroup.add(hatMesh);
	}
	playerGroup.add(headGroup);

	// 躯干
	let torsoGroup = new THREE.Object3D();
	torsoGroup.position.x = 0;
	torsoGroup.position.y = 2;
	torsoGroup.position.z = 0;
	box = new THREE.BoxGeometry(8 + EPSILON, 12 + EPSILON, 4 + EPSILON, 8, 12, 4);
	let torsoMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['torso'][0]);
	torsoGroup.add(torsoMesh);
	if(version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(8.5 + EPSILON, 12.5 + EPSILON, 4.5 + EPSILON, 8, 12, 4);
		let jacketMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['torso'][1]);
		jacketMesh && torsoGroup.add(jacketMesh);
	}
	playerGroup.add(torsoGroup);

	// 右臂
	let rightArmGroup = new THREE.Object3D();
	rightArmGroup.position.x = option.slim ? -5.5 : -6;
	rightArmGroup.position.y = 6;
	rightArmGroup.position.z = 0;
	let rightArmMesh;
	if(option.slim) {
		box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0);
		rightArmMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['armRS'][0]);
	} else {
		box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0);
		rightArmMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['armR'][0]);
	}
	rightArmGroup.add(rightArmMesh);
	if(version >= 1 && hasAlpha) {
		let rightSleeveMesh;
		if(option.slim) {
			box = new THREE.BoxGeometry(3.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 3, 12, 4).translate(0, -4, 0);
			rightSleeveMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['armRS'][1]);
		} else {
			box = new THREE.BoxGeometry(4.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 4, 12, 4).translate(0, -4, 0);
			rightSleeveMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['armR'][1]);
		}
		rightSleeveMesh && rightArmGroup.add(rightSleeveMesh);
	}
	playerGroup.add(rightArmGroup);

	// 左臂
	let leftArmGroup = new THREE.Object3D();
	leftArmGroup.position.x = option.slim ? 5.5 : 6;
	leftArmGroup.position.y = 6;
	leftArmGroup.position.z = 0;
	let leftArmMesh;
	if(option.slim) {
		box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0);
		leftArmMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['armLS'][0]);
	} else {
		box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0);
		leftArmMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['armL'][0]);
	}
	leftArmGroup.add(leftArmMesh);
	if(version >= 1 && hasAlpha) {
		let leftSleeveMesh;
		if(option.slim) {
			box = new THREE.BoxGeometry(3.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 3, 12, 4).translate(0, -4, 0);
			leftSleeveMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['armLS'][1]);
		} else {
			box = new THREE.BoxGeometry(4.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 4, 12, 4).translate(0, -4, 0);
			leftSleeveMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['armL'][1]);
		}
		leftSleeveMesh && leftArmGroup.add(leftSleeveMesh);
	}
	playerGroup.add(leftArmGroup);

	// 右腿
	let rightLegGroup = new THREE.Object3D();
	rightLegGroup.position.x = -2;
	rightLegGroup.position.y = -4;
	rightLegGroup.position.z = 0;
	box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0);
	let rightLegMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['legR'][0]);
	rightLegGroup.add(rightLegMesh);
	if(version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(4.5 + EPSILON * 2, 12.5 + EPSILON * 2, 4.5 + EPSILON * 2, 4, 12, 4).translate(0, -6, 0);
		let rightPantMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['legR'][1]);
		rightPantMesh && rightLegGroup.add(rightPantMesh);
	}
	playerGroup.add(rightLegGroup);

	// 左腿
	let leftLegGroup = new THREE.Object3D();
	leftLegGroup.position.x = 2;
	leftLegGroup.position.y = -4;
	leftLegGroup.position.z = 0;
	box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0);
	let leftLegMesh = colorFaces(box, opaqueSkinCanvas, layoutSkin['legL'][0]);
	leftLegGroup.add(leftLegMesh);
	if(version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(4.5 + EPSILON * 3, 12.5 + EPSILON * 3, 4.5 + EPSILON * 3, 4, 12, 4).translate(0, -6, 0);
		let leftPantMesh = colorFaces(box, transparentSkinCanvas, layoutSkin['legL'][1]);
		leftPantMesh && leftLegGroup.add(leftPantMesh);
	}
	playerGroup.add(leftLegGroup);


	// // 披风部分
	// let cs = capeImage ? capeScale(capeImage.height) : null;
	// if(capeImage) {
	// 	let capeCanvas = makeOpaque(capeImage);
	// 	let capeGroup = new THREE.Object3D();
	// 	capeGroup.position.x = 0;
	// 	capeGroup.position.y = 8;
	// 	capeGroup.position.z = -2;
	// 	capeGroup.rotation.y += radians(180);
	// 	let capeMesh;
	// 	box = new THREE.BoxGeometry(10, 16, 1, 10 * cs, 16 * cs, cs).translate(0, -8, 0.5);
	// 	capeMesh = colorFaces(box, capeCanvas, {
	// 		left: {
	// 			x: 11 * cs,
	// 			y: cs,
	// 			w: cs,
	// 			h: 16 * cs
	// 		},
	// 		right: {
	// 			x: 0,
	// 			y: cs,
	// 			w: cs,
	// 			h: 16 * cs
	// 		},
	// 		top: {
	// 			x: cs,
	// 			y: 0,
	// 			w: 10 * cs,
	// 			h: cs
	// 		},
	// 		bottom: {
	// 			x: 11 * cs,
	// 			y: cs - 1,
	// 			w: 10 * cs,
	// 			h: -cs
	// 		},
	// 		front: {
	// 			x: cs,
	// 			y: cs,
	// 			w: 10 * cs,
	// 			h: 16 * cs
	// 		},
	// 		back: {
	// 			x: 12 * cs,
	// 			y: cs,
	// 			w: 10 * cs,
	// 			h: 16 * cs
	// 		}
	// 	});
	// 	capeGroup.add(capeMesh);
	// 	playerGroup.add(capeGroup);
	// }

	// 上下翻转
	if(option.flip) { playerGroup.rotation.z += radians(180); }

	return playerGroup;
}