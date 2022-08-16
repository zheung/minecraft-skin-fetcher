<template>
	<module>
		<p-topbar>
			<Texter v-model="forms.store.nick" class="w-72" label="玩家名" />
			<Texter v-model="forms.store.name" class="w-72" label="用户名" />
			<Click class="w-16" text="入库" @click="atStore" />
			<Click ref="upload" class="w-16" text="上传" />
		</p-topbar>

		<canvas ref="canvasSkin" skin3d width="180" height="320" />

		<p-list>
			<p-item v-for="skinLite of skinsLite" :key="`list-${skinLite.nick}-${skinLite.timeInsert}`" @click="atSelectSkin(skinLite)">
				<div class="inblock w-6 select-none">●</div>
				<div class="inblock elli w-48" :title="skinLite.nick">{{skinLite.nick}}</div>
				<div class="inblock elli w-48" :title="skinLite.ProfileName">{{skinLite.ProfileName}}</div>
				<div class="hidden lg:inblock elli w-32 text-center select-none" :title="skinLite.timeInsert">{{skinLite.fromNow}}</div>
				<img class="hidden lg:inblock select-none" :src="`./api/minecraft/skin/image?hash=${skinLite.SkinHash}`" alt="原文件" />
			</p-item>
		</p-list>
	</module>
</template>

<script setup>
	import { onMounted, ref } from 'vue';

	import { $get, $post } from '../../lib/plugin/Aegis.js';
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


	const atSelectSkin = ({ SkinHash, SkinModel }) => skinManager.applyURL(`./api/minecraft/skin/image?hash=${SkinHash}`, SkinModel == 1, 3);
	const atQuery = async () => {
		const result = await $get('minecraft/skin/list');

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
		await $post('minecraft/skin/store', forms.value.store);

		atQuery();
	};

	onMounted(async () => {
		skinManager = new SkinManager(canvasSkin.value);

		await atQuery();

		window.addEventListener('resize', onResizeWindow);
		onResizeWindow();
	});
</script>

<style lang="sass" scoped>
p-topbar
	@apply block flex gap-2 w-full p-4

[skin3d]
	@apply mx-2 w-45 lg:w-90 inblock shadow-mdd rounded-md

p-list
	@apply relative inblock overflow-x-hidden overflow-y-auto

	max-width: calc(100vw - theme("spacing.1") * (45 + 8))
	height: calc(100vh - theme("spacing.1") * (8 + 8))

	p-item
		@apply block cursor-pointer hover:bg-sky-400 h-16 leading-16 px-4 rounded-md

@media (min-width: 1024px)
	p-list
		@apply w-auto
		max-width: calc(100vw - theme("spacing.1") * (90 + 8))
</style>
