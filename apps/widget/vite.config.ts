import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [solid()],
	server: {
		port: 3000,
		strictPort: true,
		proxy: {
			"/place": {
				target: "https://maps.googleapis.com/maps/api/place",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/place/, ""),
			},
		},
	},
});
