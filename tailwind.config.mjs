/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {


			colors: {
				// やさしい緑系のカラーパレット
				primary: {
				  light: '#e0f2e9',
				  DEFAULT: '#98d4b9',
				  dark: '#5c9f8f',
				},
				secondary: {
				  light: '#f0f7f4',
				  DEFAULT: '#b7d9cb',
				  dark: '#7ab5a0',
				},
			}
			



		},
	},
	plugins: [],
}
