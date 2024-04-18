import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Component, For, Show } from "solid-js";
import ServiceItem from "../components/ServiceItem";
import { useCords } from "../lib/cords";
import { location } from "../lib/location";

const Home: Component = () => {
	const cords = useCords();
	const [searchParams] = useSearchParams<{
		q?: string;
	}>();

	const similar = createQuery(() => ({
		queryKey: ["similar", searchParams.q, location().lat, location().lng],
		queryFn: () => {
			try {
				if (!location().lat || !location().lng)
					return cords.search(searchParams.q, {
						lat: 45,
						lng: -75,
					});
				return cords.search(searchParams.q, { lat: location().lat, lng: location().lng });
			} catch (e) {
				console.log("Error fetching similar services", e);
				return { data: [] };
			}
		},
		retry: 1,
		throwOnError: true,
		suspense: true,
	}));

	const related = createQuery(() => ({
		queryKey: ["related", similar.data],
		queryFn: () => cords.related(similar.data.data[0].id),
		enabled: similar.data?.data.length > 0,
		throwOnError: true,
	}));

	return (
		<>
			<div class="text-black flex flex-col">
				<Show when={similar.data?.data.length > 0}>
					<div class="p-8 bg-elevation1">
						<h4>Similar</h4>
						<p class="text-xs text-steel">View similar services to the current page</p>
					</div>
					<For each={similar.data.data}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
				<Show when={related.data?.data.length > 0}>
					<div class="p-8 mt-2 bg-elevation1">
						<h4>Related</h4>
						<p class="text-xs text-steel">Other services you may be interested in</p>
					</div>
					<For each={related.data.data}>
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
