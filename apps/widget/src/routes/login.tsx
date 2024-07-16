import type { APIEvent } from "@solidjs/start/server";
import { v4 as uuidv4 } from "uuid";
import { getCookie, sendRedirect, setCookie } from "vinxi/http";
import { getDB } from "~/server/db";
import { sessions } from "~/server/schema";

export const GET = async (e: APIEvent) => {
	const url = new URL(e.request.url);
	const searchParams = new URLSearchParams(url.search);

	if (!searchParams.get("redirect")) {
		return { status: 400, body: "Missing redirect parameter" };
	}

	let cordsId = getCookie(e.nativeEvent, "cords-id");
	if (!cordsId) {
		cordsId = uuidv4();
		const db = getDB();
		await db.insert(sessions).values({
			id: cordsId,
			lat: 43.6532,
			lng: -79.3832,
			address: "Toronto, ON, Canada (Default)",
		});
		setCookie(e.nativeEvent, "cords-id", cordsId);
	}
	sendRedirect(e.nativeEvent, searchParams.get("redirect") + "?cordsId=" + cordsId);
};
