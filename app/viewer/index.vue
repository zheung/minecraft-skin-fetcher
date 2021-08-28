<template>
	<module ref="moduleApp" class="_heightFull">
		<canvas id="Canvas" ref="canvasSkin" class="inline" width="360" height="640" />
		<div class="inline List">
			<div v-for="skinLite of skinsLite" :key="`list-${skinLite.nick}-${skinLite.timeInsert}`" class="item" @click="atSelectSkin(skinLite)">
				<span class="select-none">- </span>
				<div class="inline w-32">{{skinLite.nick}}</div>
				<div class="inline w-32 select-none" :title="skinLite.timeInsert">{{skinLite.fromNow}}</div>

				<img v-if="urlsObject[skinLite.SkinHash]" class="inline select-none" :src="urlsObject[skinLite.SkinHash]" alt="原文件" />
			</div>
		</div>
	</module>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { conn } from '../lib/aegis.js';
	import Moment from '../lib/Moment.js';

	import SkinManager from './SkinManager.js';


	const canvasSkin = ref(null);
	const moduleApp = ref(null);

	const urlsObject = ref({});
	const skinsLite = ref([]);

	let skinManager;


	const atSelectSkin = async skinLite => {
		const hash = skinLite.SkinHash;

		if(!urlsObject.value[hash]) {
			const data = await conn('skin/data', { hash: skinLite.SkinHash });

			urlsObject.value[hash] = URL.createObjectURL(new Blob([new Uint8Array(data)], { type: 'image/png' }));
		}

		skinManager.applyURLImage(urlsObject.value[hash], skinLite.SkinModel == 1);
	};
	const atQuery = async () => {
		const result = await conn('skin/list');

		result.forEach(skin => skin.fromNow = Moment(skin.timeInsert).fromNow());

		skinsLite.value = result;
	};
	const onResizeWindow = () => {
		skinManager.resize(360, window.getComputedStyle(moduleApp.value).height.replace('px', '') - 64);
	};


	onMounted(async () => {
		skinManager = new SkinManager(canvasSkin.value);

		await atQuery();

		await atSelectSkin(skinsLite.value[0]);

		window.addEventListener('resize', onResizeWindow);
		onResizeWindow();
	});
</script>

<style lang="postcss" scoped>
	module {
		@apply relative w-full p-8 bg-gray-800 text-gray-200;
	}

	#Canvas {
		/* @apply bg-green-700; */
	}

	.List {
		@apply relative p-2 overflow-x-hidden overflow-y-auto;
		width: calc(30rem);
		height: 100%;
	}

	.List > .item {
		@apply cursor-pointer hover:bg-green-700;
		height: 64px;
		line-height: 64px;
	}
</style>