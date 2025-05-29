import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { Database } from "bun:sqlite";

const sqlite = new Database("./persist/sqlite.db");
export const db = drizzle({
	client: sqlite,
	schema,
});
