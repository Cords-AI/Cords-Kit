import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { z } from "zod";
import { ServiceSchema } from "./service";

export const [clipboardIDs, setClipboardIDs] = makePersisted(createSignal<string[]>([]), {
	storage: localStorage,
});

export const fetchClipboard = async (clipboardIDs: string[]) => {
	if (clipboardIDs.length === 0) return [];
	let ids = "";
	clipboardIDs.forEach(
		(id, index) =>
			(ids += `ids${encodeURIComponent(`[${index}]`)}=${id}${
				index !== clipboardIDs.length - 1 ? "&" : ""
			}`)
	);
	const response = await fetch(`https://api.cords.ai/search?${ids}`);
	const data = await response.json();
	return z.object({ data: ServiceSchema.array() }).parse(data).data;
};
