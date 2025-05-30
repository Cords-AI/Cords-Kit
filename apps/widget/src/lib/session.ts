import { db } from "@/server/db";
import { sessions } from "@/server/schema";
import { SessionSchema } from "@/types";
import { createServerFn } from "@tanstack/solid-start";
import { getHeader } from "@tanstack/solid-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateSessionFn = createServerFn()
	.validator(
		SessionSchema.omit({
			id: true,
		}),
	)
	.handler(async ({ data }) => {
		const cordsId = getHeader("cords-id");
		if (!cordsId) {
			throw new Error("Missing cords-id cookie");
		}

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.id, cordsId),
		});
		if (!session) {
			throw new Error("Session not found");
		}

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

		return {
			id: cordsId,
			...newSession,
		};
	});

export const getSessionFn = createServerFn().handler(async () => {
	const cordsId = getHeader("cords-id");

	if (!cordsId) {
		return null;
	}

	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, cordsId),
		with: {
			clipboardServices: true,
		},
	});

	return session;
});
