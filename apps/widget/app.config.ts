import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
	server: {
		preset: "aws-lambda",
		rollupConfig: {
			external: ["node:async_hooks"],
		},
	},
});
