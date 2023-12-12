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
			<div class="text-black flex flex-col">
				<Show when={data() && data().related}>
					<div class="p-10 bg-elevation1">
						<h4>Similar</h4>
						<p class="text-xs text-steel">View similar services to the current page</p>
					</div>
					<For each={data().similar}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
				<Show when={data() && data().related}>
					<div class="p-10 bg-elevation1">
						<h4>Related</h4>
						<p class="text-xs text-steel">Other services you may be interested in</p>
					</div>
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
