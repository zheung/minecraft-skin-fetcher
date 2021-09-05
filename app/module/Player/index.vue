<template>
	<module ref="moduleApp" class="_heightFull">
		<div class="flex gap-2 w-full h-8 px-2 leading-8 bg-gray-700">
			<Texter v-model="forms.store.nick" class="w-1/3" label="玩家名" />
			<Texter v-model="forms.store.name" class="w-1/3" label="用户名" />
			<Click class="w-16" text="入库" @click="atStore" />
			<Click ref="upload" class="w-16" text="上传" @click="atStore" />
		</div>

		<canvas ref="canvasSkin" class="Skin3D w-45 lg:w-90 inblock" width="180" height="320" />

		<div class="List inblock">
			<div v-for="skinLite of skinsLite" :key="`list-${skinLite.nick}-${skinLite.timeInsert}`" class="item" @click="atSelectSkin(skinLite)">
				<div class="inblock w-6 select-none">●</div>
				<div class="inblock elli w-32" :title="skinLite.nick">{{skinLite.nick}}</div>
				<div class="inblock elli w-32" :title="skinLite.ProfileName">{{skinLite.ProfileName}}</div>
				<div class="hidden lg:inblock elli w-32 text-center select-none" :title="skinLite.timeInsert">{{skinLite.fromNow}}</div>
				<img class="hidden lg:inblock select-none" :src="`./api/skin/image?hash=${skinLite.SkinHash}`" alt="原文件" />
			</div>
		</div>
	</module>
</template>

<script setup>
	import { onMounted, ref } from 'vue';

	import { conn, post } from '../../lib/Aegis.js';
	import Moment from '../../lib/Moment.js';

	import Texter from '../../lib/comp/Texter.vue';
	import Click from '../../lib/comp/Click.vue';

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
		const style = window.getComputedStyle(canvasSkin.value);

		skinManager.resize(
			(Number.parseFloat(style.width) - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)),
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
		@apply relative w-full bg-gray-800 text-gray-200;
	}

	.Skin3D {
		height: calc(100% - theme("spacing.8"));
	}

	.List {
		@apply relative p-2 overflow-x-hidden overflow-y-auto;

		width: calc(100% - theme("width.45"));
		height: calc(100% - theme("spacing.8"));
	}
	@media (min-width: 1024px) {
		.List {
			width: calc(100% - theme("width.90"));
		}
	}

	.List > .item {
		@apply cursor-pointer hover:bg-green-700 h-16 leading-16 px-4;
	}
</style>