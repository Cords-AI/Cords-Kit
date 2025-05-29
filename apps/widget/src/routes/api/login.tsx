import { v4 as uuidv4 } from "uuid";
import { db } from "@/server/db";
import { sessions } from "@/server/schema";
import { createAPIFileRoute } from "@tanstack/solid-start/api";
import { getCookie, setCookie } from "@tanstack/solid-start/server";

export const APIRoute = createAPIFileRoute("/api/login")({
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const searchParams = new URLSearchParams(url.search);

		if (!searchParams.get("redirect")) {
			return new Response(
				JSON.stringify({
					status: 400,
					body: "Missing redirect parameter",
				}),
				{ status: 400 },
			);
		}

		let cordsId = getCookie("cords-id");
		if (!cordsId) {
			cordsId = uuidv4();
			await db.insert(sessions).values({
				id: cordsId,
				lat: 43.6532,
				lng: -79.3832,
				address: "Toronto, ON, Canada (Default)",
			});
			setCookie("cords-id", cordsId, {
				secure: true,
				sameSite: "lax",
				httpOnly: true,
			});
		}

		return Response.redirect(
			searchParams.get("redirect") + "?cordsId=" + cordsId,
		);
	},
});
