<template>
	<div ref="moduleApp" class="_heightFull">
		<div class="w-full">
			<Texter v-model="forms.store.nick" class="inblock line-8 w-1/3 ml-2" label="玩家名" />
			<Texter v-model="forms.store.name" class="inblock line-8 w-1/3 ml-2" label="用户名" />
			<sButton class="inblock line-8 w-16 ml-2" text="入库" @click="atStore" />
			<sButton ref="upload" class="inblock line-8 w-16 ml-2" text="上传" @click="atStore" />
		</div>

		<canvas id="Canvas" ref="canvasSkin" class="inblock bg-black w-45" width="180" height="320" />

		<div class="inblock List w-2/3">
			<div v-for="skinLite of skinsLite" :key="`list-${skinLite.nick}-${skinLite.timeInsert}`" class="item" @click="atSelectSkin(skinLite)">
				<div class="inblock w-6 select-none">●</div>
				<div class="inblock elli w-32" :title="skinLite.nick">{{skinLite.nick}}</div>
				<div class="inblock elli w-32" :title="skinLite.ProfileName">{{skinLite.ProfileName}}</div>
				<div class="hidden lg:inblock elli w-32 text-center select-none" :title="skinLite.timeInsert">{{skinLite.fromNow}}</div>
				<img class="hidden lg:inblock select-none" :src="`./api/skin/image?hash=${skinLite.SkinHash}`" alt="原文件" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';

	import { conn, post } from '../lib/Aegis.js';
	import Moment from '../lib/Moment.js';

	import Texter from '../lib/comp/Texter.vue';
	import sButton from '../lib/comp/sButton.vue';

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
		// const style = window.getComputedStyle(moduleApp.value);
		const style = window.getComputedStyle(canvasSkin.value);
		console.log(Number.parseFloat(style2.width));
		skinManager.resize(
			(Number.parseFloat(style.width) - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)) * 0.3,
			Number.parseFloat(style.height) - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)
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
		height: 100%;
	}
	.List > .item {
		@apply cursor-pointer hover:bg-green-700 h-16 leading-16;
	}

	.line-8 {
		@apply h-8 leading-8;
	}
</style>