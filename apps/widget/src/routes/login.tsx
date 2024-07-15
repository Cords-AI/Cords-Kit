import type { APIEvent } from "@solidjs/start/server";
import { getCookie, sendRedirect, setCookie } from "vinxi/http";

export const GET = (e: APIEvent) => {
	const url = new URL(e.request.url);
	const searchParams = new URLSearchParams(url.search);

	if (!searchParams.get("redirect")) {
		return { status: 400, body: "Missing redirect parameter" };
	}

	let cordsId = getCookie("cords-id");
	if (!cordsId) {
		cordsId = Math.random().toString(36).substring(7);
		setCookie("cords-id", cordsId);
	}
	sendRedirect(searchParams.get("redirect") + "?cords-id=" + cordsId);
};
