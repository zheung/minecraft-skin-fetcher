<template>
	<div v-show="mask" class="MaskAlert" :style="{ zIndex: mask }" />
	<div
		v-show="show"
		ref="window"
		class="compAlert" tabindex="123"
		:style="{ top: top+'px', left: left+'px' }"
		@keyup.capture.esc="atClose('cancel', true)"
	>
		<div
			class="head nosel"
			:style="{ cursor: moving ? 'move' : 'default' }"
			@mousemove="onMouseMove" @mousedown="onMoveStart" @mouseup="onMoveEnd" @mouseout="onMoveEnd"
		>
			<div class="title elli">{{title || '提示'}}</div>
			<Fas v-if="cancelButton" class="cancelButton" :icon="['fas', 'times']" @click="atClose('cancel', true)" />
		</div>
		<div class="box">
			<div class="line">
				{{text || ''}}
			</div>
			<div class="line">
				<div v-if="btnText3" class="button nosel white right trans" @click="atClose(btnValue3)">{{ btnText3 }}</div>
				<div v-if="btnText2" class="button nosel white right trans" @click="atClose(btnValue2)">{{ btnText2 }}</div>
				<div class="button nosel white right trans" @click="atClose(btnValue1)">{{ btnText1 }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				moving: false,

				top: 0,
				left: 0,

				title: null,
				text: null,

				cancelButton: true,
				btnText1: null,
				btnText2: null,
				btnText3: null,
				btnValue1: null,
				btnValue2: null,
				btnValue3: null,

				show: false,

				waiter: null,

				mask: 0,
			};
		},
		watch: {
			show(now) {
				if(now) {
					this.$nextTick(() => {
						let win = this.$refs.window;

						this.top = (window.innerHeight - win.clientHeight) / 2;
						this.left = (window.innerWidth - win.clientWidth) / 2;

						this.$nextTick(() => win.focus());
					});

					this.mask = 5;
				}
				else {
					this.mask = 0;
				}
			}
		},

		created() { this.$app.$instance = this; },

		methods: {
			atClose(value, fromCancelButton = false) {
				if(fromCancelButton && !this.cancelButton) { return; }

				this.title = null;
				this.text = null;

				this.cancelButton = true;
				this.btnText1 = null;
				this.btnText2 = null;
				this.btnText3 = null;
				this.btnValue1 = null;
				this.btnValue2 = null;
				this.btnValue3 = null;

				this.show = false;
				this.mask = 0;

				if(typeof this.waiter == 'function') {
					this.waiter(value);

					this.waiter = null;
				}
			},
			onMouseMove(e) {
				if(e.buttons == 1) {
					this.top += e.movementY;
					this.left += e.movementX;
				}
			},
			onMoveStart() {
				this.moving = true;
			},
			onMoveEnd() {
				this.moving = false;
			}
		}
	};
</script>

<style scoped>
	.MaskAlert {
		position: fixed;

		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		background: rgba(192, 192, 192, 0.4);

		z-index: 3;
	}

	.compAlert {
		position: fixed;

		padding: 4px;

		border-radius: 4px;

		min-width: 100px;
		min-height: 100px;

		box-shadow: 0px 3px 7px 1px rgba(64, 64, 64, 0.7);

		background-image: linear-gradient(-173deg, rgb(55, 65, 81) 45%, rgb(75, 85, 99) 85%);

		overflow: hidden;

		outline: 0;

		color: #495051;

		z-index: 5;
	}
	.head {
		height: 25px;

		padding: 0px 5px 0px 5px;

		background: transparent;

		color: snow;
	}
	.head > * {
		display: inline-block;

		vertical-align: top;
	}
	.head > .title {
		height: 22px;

		font-size: 12px;
		font-weight: bold;
		line-height: 22px;
	}
	.head > .cancelButton {
		height: 22px;

		float: right;

		cursor: pointer;
	}

	.box {
		font-size: 12px;

		min-width: 100px;

		padding: 0px 10px 0px 10px;

		color: snow;
	}

	.line {
		display: inline-block;
		vertical-align: top;

		width: 100%;

		margin-top: 10px;
		margin-bottom: 10px;

		font-size: 14px;
	}

	.button {
		display: inline-block;
		border: 1px solid transparent;
		border-radius: 0.125rem;

		background: #1faaf1;

		color: snow;
		width: 60px;
		height: 24px;

		overflow: hidden;
		text-align: center;
		line-height: 24px;
		cursor: pointer;

		font-size: 12px;
	}
	.button.white {
		@apply bg-gray-800 text-gray-200;
	}
	.button.right {
		float: right;

		margin-left: 5px;
	}
	.button:hover {
		box-shadow: 1px 1px 4px -1px rgb(4, 120, 87);
		border: 1px solid rgb(4, 120, 87);
	}
</style>