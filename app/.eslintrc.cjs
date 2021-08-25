const rc = {
	overrides: [
		{
			files: ['*.vue', '*.js'],
			excludedFiles: ['*.api.js', '*.lib.js'],
			env: {
				es2020: true,
				browser: true,
			},
			extends: [
				'eslint:recommended',
				'plugin:vue/vue3-recommended'
			],
			parser: 'vue-eslint-parser',
			parserOptions: {
				parser: '@babel/eslint-parser',
				sourceType: 'module',
				requireConfigFile: false,
				babelOptions: {
					plugins: [
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-optional-chaining'
					]
				}
			},
			rules: {
				indent: [0],
				linebreakStyle: [2, 'unix'],
				quotes: [2, 'single', { allowTemplateLiterals: true }],
				semi: [2, 'always'],
				noUnusedVars: [2, { vars: 'all', args: 'after-used' }],
				noConsole: [2],
				noVar: [2],
				quoteProps: [2, 'as-needed'],
				requireAtomicUpdates: [0],
				arrowParens: [2, 'as-needed'],

				'vue/html-indent': [2, 'tab'],
				'vue/script-indent': [2, 'tab', { baseIndent: 1 }],
				'vue/max-attributes-per-line': [0],
				'vue/mustache-interpolation-spacing': [0],
				'vue/singleline-html-element-content-newline': [0],
				'vue/no-v-html': [0],
				'vue/require-v-for-key': [0],
				'vue/html-self-closing': [1, {
					html: {
						void: 'always'
					}
				}],
			},
			// globals: {
			// 	app: true
			// }
		}
	],
};

const rules = rc.overrides[0].rules;
for(const key in rules) {
	const keyCamel = key.split(/(?=[A-Z])/).join('-').toLowerCase();
	if(keyCamel != key) {
		rules[keyCamel] = rules[key];

		delete rules[key];
	}
}

// eslint-disable-next-line no-undef
module.exports = rc;