import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import { z } from "zod";
import ServiceItem from "../components/ServiceItem";
import { clipboardIDs } from "../lib/clipboard";
import { ServiceSchema } from "../lib/service";
import empty from "/assets/empty.svg";

export const fetchClipboard = async (clipboardIDs: string[], api_key?: string) => {
	const headers = api_key ? { "x-api-key": api_key } : {};
	if (clipboardIDs.length === 0) return [];
	let ids = "";
	clipboardIDs.forEach(
		(id, index) =>
			(ids += `ids${encodeURIComponent(`[${index}]`)}=${id}${
				index !== clipboardIDs.length - 1 ? "&" : ""
			}`)
	);
	const res = await fetch(`https://api.cords.ai/search?${ids}`, {
		headers,
	});
	if (res.status === 403) {
		throw new Error("Invalid API key");
	}
	const data = await res.json();
	return z.object({ data: ServiceSchema.array() }).parse(data).data;
};

const Clipboard = () => {
	const [searchParams] = useSearchParams<{
		api_key?: string;
	}>();

	const clipboard = createQuery(() => ({
		queryKey: ["clipboard", clipboardIDs(), searchParams.api_key],
		queryFn: () => fetchClipboard(clipboardIDs(), searchParams.api_key),
		throwOnError: true,
	}));

	return (
		<Show
			when={clipboard.data?.length}
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
				<For each={clipboard.data}>{(service) => <ServiceItem service={service} />}</For>
			</div>
		</Show>
	);
};

export default Clipboard;
