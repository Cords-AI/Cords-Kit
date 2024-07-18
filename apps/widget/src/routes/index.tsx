import { createInfiniteQuery, createQuery } from "@tanstack/solid-query";
import { Component, For, Match, Show, Switch } from "solid-js";
import Pending from "~/components/Pending";
import ServiceItem from "~/components/ServiceItem";
import { useCords } from "~/lib/cords";
import { useSearchParams } from "~/lib/params";
import { getSession } from "~/lib/session";
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
	const session = getSession(searchParams.cordsId);

	const similar = createInfiniteQuery(() => ({
		queryKey: ["similar", searchParams.q, session.data?.lat, session.data?.lng],
		queryFn: async ({ pageParam }) => {
			const data = await cords.search(searchParams.q ?? "", {
				lat: session.data?.lat!,
				lng: session.data?.lng!,
				distance: 10,
				page: pageParam,
			});
			return {
				...data,
				meta: {
					...data.meta,
					nextPage: data.data.length === 10 ? pageParam + 1 : undefined,
				},
			};
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.meta.nextPage,
		gcTime: 0,
		staleTime: 0,
		retry: 1,
		throwOnError: true,
		enabled: !!session.data,
	}));
	const resources = () => similar.data?.pages.flatMap((page) => page.data);

	return (
		<Switch>
			<Match when={similar.isPending}>
				<Pending />
			</Match>
			<Match when={similar.isSuccess}>
				<div class="text-black flex flex-col">
					<Show when={resources() && resources()!.length > 0}>
						<div class="p-8 bg-elevation1">
							<h4>{t().home.similar.title}</h4>
							<p class="text-xs text-steel">{t().home.similar.description}</p>
						</div>
						<For each={resources()}>
							{(service) => {
								return <ServiceItem service={service} />;
							}}
						</For>
						<Show when={similar.hasNextPage}>
							<button
								onClick={() => {
									similar.fetchNextPage();
								}}
								class="px-8 h-12 flex justify-center items-center bg-elevation1 border-t"
							>
								<Show
									when={!similar.isFetchingNextPage}
									fallback={<Pending width={20} height={20} />}
								>
									<p class="text-xs text-steel font-medium">
										{t().home["view-more"]}
									</p>
								</Show>
							</button>
						</Show>
					</Show>
					<Show when={resources() && resources()!.length > 0 && resources()![0]?.id}>
						{(id) => <RelatedSection id={id()} />}
					</Show>
				</div>
			</Match>
		</Switch>
	);
};

export default Home;
