<template>
	<!--
		前端系统的Vue应用入口，所有东西从这个Vue文件延伸出去
	-->
	<sub-topbar class="AppTopbar">
		<div v-for="modl of modules" class="Tab inblock" :class="{ _now: moduleNow == modl.slot }" @click="modulePre = modl.slot">{{modl.name}}</div>
	</sub-topbar>
	<component :is="moduleNow" />
</template>

<script setup>
	import { ref, watch, onBeforeMount, } from 'vue';
	import B from './lib/bus.js';
	import { $alert } from './lib/plugin/alert/index.js';


	const loadComp = async slot => {
		if(B.app.component(slot)) { return; }

		try {
			try {
				B.app.component(slot, (await import(`./module/${slot.replace(/-/g, '/')}.vue`)).default);
			}
			catch(error) {
				B.app.component(slot, (await import(`./module/${slot.replace(/-/g, '/')}/index.vue`)).default);
			}
		}
		catch(error) {
			$alert(`加载[${slot}]模块 失败 `, error.message || error);

			throw error;
		}
	};


	const modules = [
		{ slot: 'Player', name: '玩家皮肤' },
		{ slot: 'Tag', name: '皮肤标签' },
	];

	const moduleNow = ref(null);
	const modulePre = ref('');

	onBeforeMount(async () => modulePre.value = modules[0].slot);

	watch(modulePre, now => loadComp(now).then(() => moduleNow.value = now));
</script>

<style lang="postcss">
	:root {
		--heightTopbar: 2rem;
	}

	html {
		@apply bg-gray-800;
	}

	sub-topbar {
		@apply fixed top-0 left-0 w-full px-2 bg-gray-900 text-gray-200;
		height: var(--heightTopbar);
		line-height: var(--heightTopbar);
	}
	sub-topbar .Tab {
		@apply px-2 cursor-pointer;
	}
	sub-topbar .Tab._now {
		border-color: snow;
		@apply border-b-2;
	}

	module {
		@apply block relative w-full;
		margin-top: var(--heightTopbar);
	}
	module._heightFull {
		height: calc(100vh - var(--heightTopbar));
	}
</style>