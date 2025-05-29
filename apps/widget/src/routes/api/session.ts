import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { sessions } from "@/server/schema";

import { createAPIFileRoute } from "@tanstack/solid-start/api";

export const APIRoute = createAPIFileRoute("/api/session")({
	GET: async ({ request }) => {
		const cordsId = request.headers.get("cords-id");

		if (!cordsId) {
			return new Response("Missing cords-id header", { status: 400 });
		}

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.id, cordsId),
			with: {
				clipboardServices: true,
			},
		});

		return new Response(JSON.stringify(session), {
			headers: { "Content-Type": "application/json" },
		});
	},
	PUT: async ({ request }) => {
		const cordsId = request.headers.get("cords-id");
		if (!cordsId) {
			return new Response("Missing cords-id header", { status: 400 });
		}

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.id, cordsId),
		});

		if (!session) {
			return new Response("Session not found", { status: 404 });
		}

		const data = await request.json();
		const newSession = z
			.object({
				lat: z.number(),
				lng: z.number(),
				address: z.string().min(1),
			})
			.parse(data);

		await db
			.update(sessions)
			.set(newSession)
			.where(eq(sessions.id, cordsId));

		return new Response(
			JSON.stringify({
				id: cordsId,
				...newSession,
			}),
			{ status: 200 },
		);
	},
});
