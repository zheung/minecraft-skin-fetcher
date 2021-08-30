<template>
	<module ref="moduleApp" class="_heightFull">
		<canvas id="Canvas" ref="canvasSkin" class="inline" width="360" height="640" />
		<div class="inline List">
			<div v-for="skinLite of skinsLite" :key="`list-${skinLite.nick}-${skinLite.timeInsert}`" class="item" @click="atSelectSkin(skinLite)">
				<div class="inline w-6 select-none">●</div>
				<div class="inline elli w-32" :title="skinLite.nick">{{skinLite.nick}}</div>
				<div class="inline elli w-32" :title="skinLite.ProfileName">{{skinLite.ProfileName}}</div>
				<div class="inline elli w-32 select-none" :title="skinLite.timeInsert">{{skinLite.fromNow}}</div>

				<img class="inline select-none" :src="`./api/skin/image?hash=${skinLite.SkinHash}`" alt="原文件" />
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

	const skinsLite = ref([]);

	let skinManager;


	const atSelectSkin = async ({ SkinHash, SkinModel }) => skinManager.applyURLImage(`./api/skin/image?hash=${SkinHash}`, SkinModel == 1);
	const atQuery = async () => {
		const result = await conn('skin/list');

		result.forEach(skin => skin.fromNow = Moment(skin.timeInsert).fromNow());

		skinsLite.value = result;
	};
	const onResizeWindow = () => skinManager.resize(
		360,
		window.getComputedStyle(moduleApp.value).height.replace('px', '') - 64,
	);


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

	.List {
		@apply relative p-2 overflow-x-hidden overflow-y-auto;
		width: calc(40rem);
		height: 100%;
	}
	.List > .item {
		@apply cursor-pointer hover:bg-green-700;
		height: 64px;
		line-height: 64px;
	}
</style>