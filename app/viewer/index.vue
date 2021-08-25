<template>
	<div>
		<div v-for="pp of list" :key="`list-${pp.nick}-${pp.hash}`" class="cursor-pointer" @click="atSelect(pp)">
			{{pp.nick}} {{pp.hash}}
		</div>

		<canvas id="Canvas" ref="canvas3d" />
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import renderSkin from './three/renderSkin.js';
	import C from './three/const.js';
	import { conn } from '../lib/aegis.js';


	const canvas3d = ref(null);

	const option = {
		slim: true,
		flip: false,
		animate: false,
		theta: 30,
		phi: 21,
		time: 90,
	};

	const atSelect = pp => {
		option.slim = pp.SkinModel == '1';

		renderSkin(option, pp.object);
	};

	const list = ref([]);

	onMounted(async () => {
		const list_ = await conn('viewer/list');

		list_.forEach(pp => {
			pp.data = pp.data.data;
			pp.object = URL.createObjectURL(new Blob([new Uint8Array(pp.data)]));
		});

		list.value = list_;

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
.AppModule {
	@apply relative w-full h-full bg-gray-800 text-gray-200 text-center;
}

#Canvas {
	@apply block bg-green-600;
}
</style>