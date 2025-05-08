/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				dark: '#000',       // Основной фон
				'dark-light': '#1e293b', // Для элементов
				'primary-blue': '#2563eb',
				'primary-red': '#dc2626',
			},
		},
	},
	plugins: [],
}