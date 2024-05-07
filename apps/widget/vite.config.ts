import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [solid()],
	server: {
		port: 3000,
		strictPort: true,
		proxy: {
			"/maps": {
				target: "https://maps.googleapis.com/maps/api",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/maps/, ""),
			},
		},
	},
});
