const spacing = 0.25;
const unit = 'rem';
const space = time => `${time * spacing}${unit}`;

module.exports = {
	purge: ['./app/index.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			lineHeight: {
				14: space(14),
				16: space(16),
			},
			width: {
				45: space(45),
				90: space(90),
				135: space(135),
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
