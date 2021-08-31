<template>
	<module ref="moduleApp" class="_heightFull">
		<div class="">
			<Texter v-model="forms.store.nick" class="inline line-8 w-64 ml-2" label="玩家名" />
			<Texter v-model="forms.store.name" class="inline line-8 w-64 ml-2" label="用户名" />
			<Button class="inline line-8 w-16 ml-2" text="入库" @click="atStore" />
		</div>
		<canvas id="Canvas" ref="canvasSkin" class="inline bg-gray-700" width="180" height="640" />
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

	import { conn, post } from '../lib/Aegis.js';
	import Moment from '../lib/Moment.js';

	import Texter from '../lib/comp/Texter.vue';
	import Button from '../lib/comp/Button.vue';

	import SkinManager from './SkinManager.js';


	const forms = ref({
		store: { nick: '', name: '', }
	});


	const canvasSkin = ref(null);
	const moduleApp = ref(null);

	const skinsLite = ref([]);

	let skinManager;


	const atSelectSkin = ({ SkinHash, SkinModel }) => skinManager.applyURL(`./api/skin/image?hash=${SkinHash}`, SkinModel == 1, 3);
	const atQuery = async () => {
		const result = await conn('skin/list');

		result.forEach(skin => skin.fromNow = Moment(skin.timeInsert).fromNow());

		skinsLite.value = result;

		if(result[0]) { atSelectSkin(result[0]); }
	};


	const onResizeWindow = () => {
		skinManager.resize(
			180,
			~~window.getComputedStyle(moduleApp.value).height.replace('px', '') - 64
		);
	};
	const atStore = async () => {
		await post('skin/store', forms.value.store);

		atQuery();
	};

	onMounted(async () => {
		skinManager = new SkinManager(canvasSkin.value);

		await atQuery();

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

	.line-8 {
		@apply h-8 leading-8;
	}
</style>