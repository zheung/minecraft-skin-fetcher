<template>
	<comp-combo>
		<!-- 禁用 -->
		<sub-disabling v-if="disabling_" class="inline" :class="{ '_checked': !disable_ }" @click="disable_ = ! disable_" />

		<!-- 标签 -->
		<sub-label v-if="label_" class="inline elli" :style="styleLabel" @click="disabling_ && (disable_ = ! disable_)">{{ label_ }}</sub-label>

		<!-- 输入框 -->
		<sub-value ref="domValue" class="inline" @click="!disable_ && !readonly_ && atClickDrop()">
			<input
				ref="domValue"
				:value="textNow"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="true"
				:disabled="disable_"
			/>
		</sub-value>

		<!-- 下拉列表 -->
		<sub-drop ref="domDrop" tabindex="0" :style="{ width: widthDrop}">
			<div v-for="option of options"
				class="Option"
				:class="{ _selected: option.selected }"
				:title="option.data?.value"
				@click="atClickSelect(option)"
			>
				{{option.data?.text ?? ''}}
			</div>
		</sub-drop>
	</comp-combo>
</template>

<script setup>
	/* global defineProps, defineEmits */

	import { computed, onMounted, ref, watch } from 'vue';
	import Tippy from 'tippy.js';

	import { props as propsLabel, setup as setupLabel } from './common/label.js';
	import { parseBoolAttr } from './common/public.js';


	const props = defineProps({
		// update主值
		modelValue: { type: [String, Number, Boolean], default: '' },
		// update是否禁用
		disable: { type: Boolean, default: false },
		// update综合主值
		text: { type: String, default: '' },
		// disabling启用下的默认值
		default: { type: [String, Number, Boolean], default: '' },


		...propsLabel,


		// boolean是否显示禁用框
		disabling: { type: [String, Boolean], default: false },
		// boolean是否制度
		readonly: { type: [String, Boolean], default: false },


		// 留空提示
		place: { type: [Number, String], default: '' },
		// 焦点顺序
		tab: { type: [Number, String], default: 0 },
		// 文本对齐方式
		align: { type: String, default: null },

		// 下拉列表
		list: { type: Array, default: () => ([]) },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const disabling_ = computed(() => parseBoolAttr(props.disabling));
	const readonly_ = computed(() => parseBoolAttr(props.readonly));

	const { label_, labelWidth_, labelAlign_ } = setupLabel(props, disabling_);

	const styleLabel = computed(() => ({ width: labelWidth_.value, textAlign: labelAlign_.value }));

	const value_ = ref(disabling_.value ? (props.modelValue === false ? props.default : props.modelValue) : props.modelValue);
	const disable_ = ref(disabling_.value ? (props.modelValue === false ? true : false) : props.disable);


	watch(() => props.disable, disable => {
		if(!disabling_.value) {
			disable_.value = disable;
		}
	});
	watch(() => props.modelValue, modelValue => {
		if(disabling_.value) {
			if(modelValue === false) {
				disable_.value = true;
			}
			else {
				disable_.value = false;
				value_.value = modelValue;
			}
		}
		else {
			value_.value = modelValue;
		}
	});
	watch([value_, disable_], ([value, disable], [valuePrev, disablePrev]) => {
		if(disabling_.value) {
			if(value != valuePrev) {
				emit('update:value', value);
			}
			if(disable != disablePrev) {
				emit('update:disable', disable);
			}

			emit('update:modelValue', disable === true ? false : value);
		}
		else {
			emit('update:modelValue', value);
		}
	});

	// 计算是否被选中
	const isSelect = option => value_.value === option.value;



	// 主列表, 决定本地列表或远程列表
	const listRaw = computed(() => props.list);

	// 主列表封装
	const options = computed(() => {
		return listRaw.value.map(data => ({ selected: isSelect(data), data }));
		// .sort((a, b) => ~~b.selected - ~~a.selected);
	});

	const textNow = computed(() => listRaw.value.find(data => data.value == value_.value)?.text ?? '');


	const domValue = ref(null);
	const domDrop = ref(null);

	const tippyDrop = ref(null);
	const widthDrop = ref('');

	const atShowDrop = () => { };
	const atHideDrop = () => { };

	const atClickDrop = () => {
		if(tippyDrop.value.state.isShown) {
			tippyDrop.value.hide();
		}
		else {
			widthDrop.value = window.getComputedStyle(domValue.value).width;

			tippyDrop.value.show();
		}
	};

	const atClickSelect = option => {
		option.selected = true;
		value_.value = option.data?.value;
	};

	onMounted(() => {
		tippyDrop.value = Tippy(domValue.value, {
			placement: 'bottom-start',
			content: domDrop.value,
			allowHTML: true,
			interactive: true,
			multiple: true,
			animateFill: false,
			animation: '',
			duration: [0, 0],
			offset: [0, -2],
			trigger: 'manual',
			maxWidth: 'unset',
			onHidden: atHideDrop,
			onShown: atShowDrop,
		});
	});
</script>

<style lang="postcss" scoped>
	sub-disabling {
		@apply relative float-left top-2 w-4 h-4 mx-1 border-2 border-solid select-none cursor-pointer appearance-none;
		border-color: #e64440;
	}
	sub-disabling._checked {
		border-color: #40e669;
		background-color: #40e669;
	}
	sub-disabling._checked::after {
		content: "";
		@apply absolute border-2 border-solid border-t-0 border-r-0;
		top: 2px;
		left: 0px;
		width: 0.75rem;
		height: 0.4rem;
		border-color: #1f2937;
		transform: rotate(-45deg) scale(0.77, 0.77);
	}

	sub-label {
		@apply block relative float-left w-auto h-full overflow-hidden cursor-pointer select-none;
	}

	sub-value {
		@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid border-gray-500;

		padding: 0 0.25rem;
		z-index: 1;
	}

	sub-value > input {
		@apply relative w-full h-full overflow-hidden;

		outline: none;

		background: transparent;

		font-size: inherit;
	}
	sub-value > input:disabled {
		@apply text-gray-500;
	}

	sub-drop {
		@apply block bg-gray-700 py-2 border-2 border-gray-500 rounded-b-sm;

		max-height: 20rem;
		overflow-x: hidden;
		overflow-y: auto;
	}

	sub-drop > .Option {
		@apply px-2 cursor-pointer hover:bg-gray-500;
	}
	sub-drop > .Option._selected {
		@apply font-bold text-white;
	}
</style>