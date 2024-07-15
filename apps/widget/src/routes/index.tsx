import { SearchResourceType } from "@cords/sdk";
import { createQuery } from "@tanstack/solid-query";
import { Component, For, Match, Show, Switch } from "solid-js";
import Pending from "~/components/Pending";
import ServiceItem from "~/components/ServiceItem";
import { useCords } from "~/lib/cords";
import { location } from "~/lib/location";
import { useSearchParams } from "~/lib/params";
import { useTranslation } from "~/translations";

const RelatedSection = (props: { id: string }) => {
	const { t } = useTranslation();
	const cords = useCords();
	const related = createQuery(() => ({
		queryKey: ["related", props.id],
		queryFn: () => cords.related(props.id),
		throwOnError: true,
		gcTime: 0,
		staleTime: 0,
	}));

	return (
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
	);
};

const Home: Component = () => {
	const cords = useCords();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();

	const similar = createQuery(() => ({
		queryKey: ["similar", searchParams.q, location().lat, location().lng],
		queryFn: () => {
			try {
				return cords.search(searchParams.q ?? "", {
					lat: location().lat,
					lng: location().lng,
					distance: 10,
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
					data: SearchResourceType[];
					meta: {
						total: number;
						lat: number;
						lng: number;
					};
				};
			}
		},
		gcTime: 0,
		staleTime: 0,
		retry: 1,
		throwOnError: true,
	}));

	return (
		<Switch>
			<Match when={similar.isPending}>
				<Pending />
			</Match>
			<Match when={similar.isSuccess}>
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
					<Show when={similar.data && similar.data?.data[0]?.id}>
						<RelatedSection id={similar.data?.data[0].id!} />
					</Show>
				</div>
			</Match>
		</Switch>
	);
};

export default Home;
