<template>
	<module class="_heightFull">
		<canvas id="Canvas" ref="canvas3d" class="inline" width="180" height="320" />
		<div class="inline List">
			<div v-for="skin of list" :key="`list-${skin.nick}-${skin.timeInsert}`" class="item" @click="atSelectSkin(skin)">
				- <div class="inline w-32">{{skin.nick}}</div> <div class="inline w-32" :title="skin.timeInsert">{{skin.fromNow}}</div>
				<img :src="urlsObject[skin.SkinHash]" alt="原文件" />
			</div>
		</div>
	</module>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import renderSkin from './three/renderSkin.js';
	import C from './three/tool.js';
	import { conn } from '../lib/aegis.js';
	import Moment from '../lib/Moment.js';

	const canvas3d = ref(null);

	const option = {
		slim: true,
		flip: false,
		animate: false,
		theta: 34,
		phi: 24,
		time: 90,
	};

	const urlsObject = ref({});


	const atSelectSkin = async skin => {
		const hash = skin.SkinHash;

		if(!urlsObject.value[hash]) {
			const data = await conn('skin/data', { hash: skin.SkinHash });

			urlsObject.value[hash] = URL.createObjectURL(new Blob([new Uint8Array(data)]));
		}

		option.slim = skin.SkinModel == '1';

		renderSkin(option, urlsObject.value[hash]);
	};

	const list = ref([]);


	onMounted(async () => {
		const list_ = await conn('skin/list');

		list_.forEach(skin => skin.fromNow = Moment(skin.timeInsert).fromNow());

		list.value = list_;

		atSelectSkin(list_[0]);

		C.canvas3d = canvas3d.value;
		C.canvas3d.addEventListener('dragenter', function(e) {
			e.stopPropagation();
			e.preventDefault();
		}, false);
		C.canvas3d.addEventListener('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
		}, false);
		C.canvas3d.addEventListener('drop', function(e) {
			e.stopPropagation();
			e.preventDefault();

			const file = e.dataTransfer.files[0];

			renderSkin(option, URL.createObjectURL(file));
		}, false);
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
		width: calc(100% - 180px);
		height: 320px;
	}

	.List > .item {
		@apply cursor-pointer hover:bg-green-700;
	}
</style>