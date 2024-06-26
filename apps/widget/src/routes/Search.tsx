import { createQuery } from "@tanstack/solid-query";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import Pending from "../components/Pending";
import ServiceItem from "../components/ServiceItem";
import { useCords } from "../lib/cords";
import { location } from "../lib/location";
import { search, setSearch } from "../lib/search";
import { useTranslation } from "../translations";

const Search = () => {
	const cords = useCords();
	const [searchTime, setSearchTime] = createSignal(0);
	const [maxPage, setMaxPage] = createSignal(0);
	const { t } = useTranslation();

	const data = createQuery(() => ({
		queryKey: ["search", search()],
		queryFn: async () => {
			const start = performance.now();
			const res = await cords.search(search().query, {
				lat: location().lat,
				lng: location().lng,
				pageSize: 10,
				page: search().page,
			});
			setSearchTime((performance.now() - start) / 1000);
			setMaxPage(Math.ceil(res.meta.total / 10));
			return res;
		},
		gcTime: 0,
		enabled: !!search().query,
		throwOnError: true,
	}));

	const start = () => Math.max(0, search().page - 3);
	const end = () => start() + 5;

	return (
		<Switch>
			<Match when={data.isPending}>
				<Pending />
			</Match>
			<Match when={data.isSuccess}>
				<div class="relative">
					<Show when={data.data}>
						{(data) => (
							<>
								<div class="p-8 bg-elevation1">
									<h4>{search().query}</h4>
									<p class="text-xs text-steel">
										{t().search.meta.page} {search().page} {t().search.meta.of}{" "}
										{data().meta.total} {t().search.meta.results} (
										{searchTime().toFixed(2)} {t().search.meta.seconds})
									</p>
								</div>
								<div>
									<For each={data().data}>
										{(service) => <ServiceItem service={service} />}
									</For>
								</div>
								<div class="flex justify-center items-center gap-2 h-12 bg-elevation1 w-full border-t">
									<button
										disabled={search().page === 1}
										onClick={() =>
											setSearch({ ...search(), page: search().page - 1 })
										}
										class="text-primary p-2 rounded-lg"
									>
										<span class="material-symbols-outlined flex items-center">
											chevron_left
										</span>
									</button>
									<For each={[...Array(maxPage()).keys()].slice(start(), end())}>
										{(i) => (
											<button
												onClick={() =>
													setSearch({ ...search(), page: i + 1 })
												}
												class={`w-7 h-8 rounded text-sm ${
													i + 1 === search().page
														? "bg-primary text-white"
														: "text-primary"
												}`}
											>
												{i + 1}
											</button>
										)}
									</For>
									<button
										disabled={search().page === maxPage()}
										onClick={() =>
											setSearch({ ...search(), page: search().page + 1 })
										}
										class="text-primary p-2 rounded-lg"
									>
										<span class="material-symbols-outlined flex items-center">
											chevron_right
										</span>
									</button>
								</div>
							</>
						)}
					</Show>
				</div>
			</Match>
		</Switch>
	);
};

export default Search;
