<template>
	<!--
		前端系统的Vue应用入口，所有东西从这个Vue文件延伸出去
	-->
	<div class="AppTopbar">皮肤预览</div>
	<Viewer class="AppModule" />
</template>

<script setup>
	import Viewer from './viewer/index.vue';
</script>

<style lang="postcss">
	:root {
		--heightTopbar: 2rem;
	}

	html {
		@apply bg-gray-800;
	}

	.AppTopbar {
		@apply fixed top-0 left-0 w-full px-2 bg-gray-900 text-gray-200;
		height: var(--heightTopbar);
		line-height: var(--heightTopbar);
	}

	module {
		@apply block relative w-full;
		margin-top: var(--heightTopbar);
	}
	module._heightFull {
		height: calc(100vh - var(--heightTopbar));
	}
</style>