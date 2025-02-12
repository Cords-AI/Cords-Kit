import type { APIEvent } from "@solidjs/start/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { clipboardServices, sessions } from "~/server/schema";

export const PUT = async (e: APIEvent) => {
	const cordsId = e.request.headers.get("cords-id");
	if (!cordsId) {
		return new Response("Missing cords-id header", { status: 400 });
	}

	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, cordsId),
	});
	if (!session) {
		return new Response("Session not found", { status: 404 });
	}

	const id = e.params.id;

	const clipboardedService = await db.query.clipboardServices.findFirst({
		where: eq(clipboardServices.serviceId, id),
	});

	if (!clipboardedService) {
		await db.insert(clipboardServices).values({
			serviceId: id,
			sessionId: cordsId,
		});
	} else {
		await db
			.delete(clipboardServices)
			.where(eq(clipboardServices.serviceId, id));
	}

	return new Response("Success", { status: 200 });
};
