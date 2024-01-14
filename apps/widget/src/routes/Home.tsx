import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Component, For, Show } from "solid-js";
import { z } from "zod";
import ServiceItem from "../components/ServiceItem";
import { ServiceSchema } from "../lib/service";

const fetchSimilar = async (q: string, api_key?: string) => {
	const headers = api_key ? { "x-api-key": api_key } : {};
	const res = await fetch(`https://api.cords.ai/search?q=${q}&lat=43.6532&lng=-79.3832`, {
		headers,
	});
	if (res.status === 403) {
		throw new Error("Invalid API key");
	}
	const body = await res.json();
	return z
		.object({
			data: ServiceSchema.array(),
		})
		.parse(body).data;
};

const fetchRelated = async (id: string, api_key?: string) => {
	const headers = api_key ? { "x-api-key": api_key } : {};
	const res = await fetch(`https://api.cords.ai/resource/${id}/related`, {
		headers,
	});
	if (res.status === 403) {
		throw new Error("Invalid API key");
	}
	const body = await res.json();
	return z
		.object({
			data: ServiceSchema.array(),
		})
		.parse(body).data;
};

const Home: Component = () => {
	const [searchParams] = useSearchParams<{
		q?: string;
		api_key?: string;
	}>();

	const similar = createQuery(() => ({
		queryKey: ["similar", searchParams.q, searchParams.api_key],
		queryFn: () => fetchSimilar(searchParams.q, searchParams.api_key),
		retry: 1,
		throwOnError: true,
	}));

	const related = createQuery(() => ({
		queryKey: ["related", similar.data, searchParams.api_key],
		queryFn: () => fetchRelated(similar.data[0].id, searchParams.api_key),
		enabled: similar.data?.length > 0,
		throwOnError: true,
	}));

	return (
		<>
			<div class="text-black flex flex-col">
				<Show when={similar.data?.length > 0}>
					<div class="p-8 bg-elevation1">
						<h4>Similar</h4>
						<p class="text-xs text-steel">View similar services to the current page</p>
					</div>
					<For each={similar.data}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
				<Show when={related.data?.length > 0}>
					<div class="p-8 mt-2 bg-elevation1">
						<h4>Related</h4>
						<p class="text-xs text-steel">Other services you may be interested in</p>
					</div>
					<For each={related.data}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
			</div>
		</>
	);
};

export default Home;
