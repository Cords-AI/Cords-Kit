import { defineConfig } from "@solidjs/start/config";
import { config } from "vinxi/plugins/config";

export default defineConfig({
	server: {
		preset: "cloudflare-pages",
	},
	vite(options) {
		if (options.router === "server") {
			return {
				plugins: [
					config("custom", {
						define: {
							"process.env.TURSO_URL": JSON.stringify(process.env.TURSO_URL),
							"process.env.TURSO_TOKEN": JSON.stringify(process.env.TURSO_TOKEN),
						},
					}),
				],
			};
		}
		return { plugins: [] };
	},
});
