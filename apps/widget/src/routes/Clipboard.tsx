import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import { z } from "zod";
import ServiceItem from "../components/ServiceItem";
import { clipboardIDs } from "../lib/clipboard";
import { ServiceSchema } from "../lib/service";

export const fetchClipboard = async (clipboardIDs: string[]) => {
	if (clipboardIDs.length === 0) return [];
	let ids = "";
	clipboardIDs.forEach(
		(id, index) =>
			(ids += `ids${encodeURIComponent(`[${index}]`)}=${id}${
				index !== clipboardIDs.length - 1 ? "&" : ""
			}`)
	);
	const res = await fetch(`https://api.cords.ai/search?${ids}`);
	const data = await res.json();
	return z.object({ data: ServiceSchema.array() }).parse(data).data;
};

const Clipboard = () => {
	const clipboardServices = createAsync(() => fetchClipboard(clipboardIDs()));

	return (
		<Show
			when={clipboardServices()?.length}
			fallback={
				<div class="h-full flex justify-center items-center">
					<p>Clipboard Empty</p>
				</div>
			}
		>
			<div class="py-2 text-black flex flex-col gap-2">
				<h3 class="px-4 pt-4 text-lg">Clipboard</h3>
				<For each={clipboardServices()}>
					{(service) => <ServiceItem service={service} />}
				</For>
			</div>
		</Show>
	);
};

export default Clipboard;
