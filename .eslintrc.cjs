const rcBrowser = {
	files: ['./app/**/*.{js,vue}'],
	excludedFiles: ['./app/**/*.{api,lib,map}.js', './app/**/*.lib/**/*.js'],
	env: { node: false, browser: true },
	extends: ['plugin:vue/vue3-recommended'],
	rules: {
		indent: [0],

		'vue/html-indent': [2, 'tab'],
		'vue/script-indent': [2, 'tab', { baseIndent: 1 }],
		'vue/max-attributes-per-line': [0],
		'vue/mustache-interpolation-spacing': [0],
		'vue/singleline-html-element-content-newline': [0],
		'vue/no-v-html': [0],
		'vue/require-v-for-key': [0],
		'vue/html-self-closing': [1, { html: { void: 'always' }, }],
	},
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefaults: 'readonly'
	},
};

const rcNode = {
	root: true,
	env: { es2021: true, node: true },
	extends: ['eslint:recommended'],
	parserOptions: { sourceType: 'module', ecmaVersion: 13 },
	rules: {
		indent: [2, 'tab', { ignoreComments: true, SwitchCase: 1 }],
		linebreakStyle: [2],
		quotes: [2, 'single', { allowTemplateLiterals: true }],
		semi: [2],
		noUnusedVars: [2, { vars: 'all', args: 'none' }],
		noVar: [2],
		noConsole: [2],
		requireAtomicUpdates: [1],
	},
	overrides: [rcBrowser]
};


const parseKey = (raw, target) => { const key = raw.split(/(?=[A-Z])/).join('-').toLowerCase(); if(key != raw) { target[key] = target[raw]; delete target[raw]; } };
Object.keys(rcNode.rules).forEach(key => parseKey(key, rcNode.rules));
Object.keys(rcBrowser.rules).forEach(key => parseKey(key, rcBrowser.rules));


module.exports = rcNode;