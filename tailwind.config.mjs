import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
			  },
			keyframes: {
				slidein: {
					from: {
						opacity: "0",
						transform: "translateY(-10px)",
					},
					to: {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
			},
			animation: {
				slidein: "slidein 1s ease var(--slidein-delay, 0) forwards",
			},
		},
	},
	plugins: [],
}
