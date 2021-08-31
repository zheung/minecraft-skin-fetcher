module.exports = {
	purge: ['./app/index.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			lineHeight: {
				14: '3.5rem',
				16: '4rem',
			}
		},
	},
	variants: {
		extend: {
			contrast: ['hover'],
			fontWeight: ['hover'],
			fontBold: ['hover'],
			backgroundColor: ['checked'],
			borderColor: ['checked'],
			lineHeight: ['responsive'],
		},
	},
	plugins: [],
};
