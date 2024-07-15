import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Returns database ORM client
export const getDB = () => {
	const client = createClient({
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_TOKEN!,
	});
	return drizzle(client, {
		schema,
	});
};
