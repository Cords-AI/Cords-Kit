/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: ["Helvetica", "sans-serif"],
			serif: ["Times", "serif"],
		},
		extend: {
			fontFamily: {
				lato: ["Lato", "Helvetica", "sans-serif"],
			},
			colors: {
				primary: "#0072CE",
			},
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
