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
			animation: {
				'message-in': 'messageIn 0.3s ease-out',
			},
			keyframes: {
				messageIn: {
					'0%': { opacity: 0, transform: 'translateY(20px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				}
			}
		},
	},
	plugins: [],
}