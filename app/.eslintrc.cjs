const rc = {
	files: ['./**/*.js', './**/*.vue'],
	excludedFiles: ['./**/*.api.js', './**/*.lib.js', './**/*.lib/**/*.js'],
	env: {
		node: false,
		browser: true,
	},
	extends: [
		'plugin:vue/vue3-recommended'
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@babel/eslint-parser',
	},
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
};

for(const key in rc.rules) {
	const keyCamel = key.split(/(?=[A-Z])/).join('-').toLowerCase();
	if(keyCamel != key) {
		rc.rules[keyCamel] = rc.rules[key];
		delete rc.rules[key];
	}
}

module.exports = { overrides: [rc] };