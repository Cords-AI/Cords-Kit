import type { APIEvent } from "@solidjs/start/server";
import { eq } from "drizzle-orm";
import { getDB } from "~/server/db";
import { sessions } from "~/server/schema";

export const GET = async (e: APIEvent) => {
	const cordsId = e.request.headers.get("cords-id");
	console.log(cordsId);

	if (!cordsId) {
		return new Response("Missing cords-id header", { status: 400 });
	}

	const db = getDB();

	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, cordsId),
		with: {
			clipboardServices: true,
		},
	});

	return new Response(JSON.stringify(session), {
		headers: { "Content-Type": "application/json" },
	});
};
