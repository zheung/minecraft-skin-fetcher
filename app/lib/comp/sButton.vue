<template>
	<comp-button class="trans">
		{{text}}
	</comp-button>
</template>

<script setup>
	/* global defineProps */

	defineProps({
		// 文本
		text: { type: String, default: '' },
	});
</script>

<style lang="postcss" scoped>
	comp-button {
		@apply px-2 bg-green-700 text-gray-200 rounded-sm cursor-pointer text-center select-none;

		border: 1px solid transparent;
	}
	comp-button:hover {
		box-shadow: 1px 1px 4px -1px rgb(52, 211, 153);

		border: 1px solid rgb(52, 211, 153);
	}
</style>