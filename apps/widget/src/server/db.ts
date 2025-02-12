import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Returns database ORM client
export const getDB = () => {
	if (!process.env.TURSO_URL || !process.env.TURSO_TOKEN) {
		throw new Error("TURSO_URL and TURSO_TOKEN must be set");
	}

	const client = createClient({
		url: process.env.TURSO_URL,
		authToken: process.env.TURSO_TOKEN,
	});

	return drizzle(client, {
		schema,
	});
};
