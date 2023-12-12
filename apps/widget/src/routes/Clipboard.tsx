import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import { z } from "zod";
import ServiceItem from "../components/ServiceItem";
import { clipboardIDs } from "../lib/clipboard";
import { ServiceSchema } from "../lib/service";
import empty from "/assets/empty.svg";

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
				<div class="h-full flex justify-center items-center flex-col">
					<img
						src={empty}
						width={120}
						height={120}
						alt="Person searching a large clipboard with a magnifying glass"
					/>
					<div class="flex justify-center items-center px-8 flex-col">
						<h3 class="mt-10 mb-4">Your clipboard is empty.</h3>
						<p class="text-center">
							Save search results to your clipboard for easy access anytime.
						</p>
					</div>
				</div>
			}
		>
			<div class="flex flex-col bg-elevation1 h-full">
				<div class="p-8 bg-elevation1">
					<h4>Clipboard</h4>
					<p class="text-xs text-steel">View your clipboarded services</p>
				</div>
				<For each={clipboardServices()}>
					{(service) => <ServiceItem service={service} />}
				</For>
			</div>
		</Show>
	);
};

export default Clipboard;
