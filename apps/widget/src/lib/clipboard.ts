import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { clipboardServices, sessions } from "@/server/schema";
import { createServerFn } from "@tanstack/solid-start";
import { getHeader } from "@tanstack/solid-start/server";
import { z } from "zod";

export const updateClipboardFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const cordsId = getHeader("cords-id");
		if (!cordsId) {
			throw new Error("Missing cords-id header");
		}

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.id, cordsId),
		});
		if (!session) {
			throw new Error("Session not found");
		}

		const id = data.id;

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

		return null;
	});
