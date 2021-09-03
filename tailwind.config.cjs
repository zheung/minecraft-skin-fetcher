module.exports = {
	purge: ['./app/index.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			lineHeight: {
				14: '3.5rem',
				16: '4rem',
			},
			width: {
				45: '11.25rem',
				90: '22.5rem',
			},
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
			width: ['responsive'],
		},
	},
	plugins: [],
};
