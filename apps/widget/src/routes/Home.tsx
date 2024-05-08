import { ResourceType } from "@cords/sdk";
import { createQuery } from "@tanstack/solid-query";
import { Component, For, Show } from "solid-js";
import ServiceItem from "../components/ServiceItem";
import { useCords } from "../lib/cords";
import { location } from "../lib/location";
import { useSearchParams } from "../lib/params";
import { useTranslation } from "../translations";

const Home: Component = () => {
	const cords = useCords();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();

	const similar = createQuery(() => ({
		queryKey: ["similar", searchParams.q, location().lat, location().lng],
		queryFn: () => {
			try {
				if (!location().lat || !location().lng)
					return cords.search(searchParams.q ?? "", {
						lat: 45,
						lng: -75,
					});
				return cords.search(searchParams.q ?? "", {
					lat: location().lat,
					lng: location().lng,
				});
			} catch (e) {
				console.log("Error fetching similar services", e);
				return {
					data: [],
					meta: {
						total: 0,
						lat: 0,
						lng: 0,
					},
				} as {
					data: ResourceType[];
					meta: {
						total: number;
						lat: number;
						lng: number;
					};
				};
			}
		},
		retry: 1,
		throwOnError: true,
		suspense: true,
	}));

	const related = createQuery(() => ({
		queryKey: ["related", similar.data],
		queryFn: () => cords.related(similar.data?.data[0].id!),
		enabled: similar.data && similar.data.data.length > 0,
		throwOnError: true,
	}));

	return (
		<>
			<div class="text-black flex flex-col">
				<Show when={similar.data && similar.data.data.length > 0}>
					<div class="p-8 bg-elevation1">
						<h4>{t().home.similar.title}</h4>
						<p class="text-xs text-steel">{t().home.similar.description}</p>
					</div>
					<For each={similar.data?.data}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				</Show>
				<Show when={related.data && related.data.data.length > 0}>
					<div class="p-8 mt-2 bg-elevation1">
						<h4>{t().home.related.title}</h4>
						<p class="text-xs text-steel">{t().home.related.description}</p>
					</div>
					<For each={related.data?.data}>
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
