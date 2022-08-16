<template>
	<comp-click :white="brop(white)">{{text}}</comp-click>
</template>

<script setup>
	defineProps({
		// 文本
		text: { type: String, default: '' },
		white: { type: [Boolean, String], default: false },
	});
</script>

<style lang="sass" scoped>
comp-click
	@apply px-2 rounded-sm cursor-pointer text-center select-none
	background-color: var(--colorMain)
	color: var(--colorTextMain)

	&:focus, &:hover
		@apply shadow-md filter brightness-110

	&[white]
		@apply border
		border-color: var(--colorMain)
		color: var(--colorMain)
		background-color: var(--colorTextMain)
</style>
