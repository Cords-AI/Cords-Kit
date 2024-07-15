import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/server/schema.ts",
	out: "./src/server/migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_TOKEN!,
	},
});
