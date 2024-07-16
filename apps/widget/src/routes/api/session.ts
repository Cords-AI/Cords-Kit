import type { APIEvent } from "@solidjs/start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDB } from "~/server/db";
import { sessions } from "~/server/schema";

export const GET = async (e: APIEvent) => {
	const cordsId = e.request.headers.get("cords-id");

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

export const PUT = async (e: APIEvent) => {
	const cordsId = e.request.headers.get("cords-id");
	if (!cordsId) {
		return new Response("Missing cords-id header", { status: 400 });
	}

	const db = getDB();

	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, cordsId),
	});

	if (!session) {
		return new Response("Session not found", { status: 404 });
	}

	const data = await e.request.json();
	const newSession = z
		.object({
			lat: z.number(),
			lng: z.number(),
			address: z.string().min(1),
		})
		.parse(data);

	await db.update(sessions).set(newSession).where(eq(sessions.id, cordsId));

	return new Response(
		JSON.stringify({
			id: cordsId,
			...newSession,
		}),
		{ status: 200 }
	);
};
