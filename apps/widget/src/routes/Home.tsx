import { createAsync, useSearchParams } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { z } from "zod";
import ServiceItem from "../components/ServiceItem";
import { ServiceSchema } from "../lib/service";

const fetchSimilar = async (q: string) => {
	const res = await fetch(`https://api.cords.ai/search?q=${q}&lat=43.6532&lng=-79.3832`);
	const body = await res.json();
	return z
		.object({
			data: ServiceSchema.array(),
		})
		.parse(body).data;
};

const fetchRelated = async (id: string) => {
	const res = await fetch(`https://api.cords.ai/resource/${id}/related`);
	const body = await res.json();
	return z
		.object({
			data: ServiceSchema.array(),
		})
		.parse(body).data;
};

const Home: Component = () => {
	const [searchParams] = useSearchParams();

	const data = createAsync(async () => {
		const similar = await fetchSimilar(searchParams.q || "Food bank");
		if (!similar && !similar[0]) return undefined;
		const related = await fetchRelated(similar[0].id);
		return { similar, related };
	});

	return (
		<>
			<div class="py-2 text-black flex flex-col gap-2">
				<Show when={data() && data().related}>
					<h3 class="px-4 pt-4 text-lg">Similar</h3>
					<For each={data().similar}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
				<Show when={data() && data().related}>
					<h3 class="px-4 pt-4 text-lg">Related</h3>
					<For each={data().related}>
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
