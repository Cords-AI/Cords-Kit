import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import Pending from "~/components/Pending";
import ServiceItem from "~/components/ServiceItem";
import { useCords } from "~/lib/cords";
import { search, setSearch } from "~/lib/search";
import { getSession } from "~/lib/session";
import { useTranslation } from "~/translations";

const Search = () => {
	const cords = useCords();
	const [searchTime, setSearchTime] = createSignal(0);
	const [maxPage, setMaxPage] = createSignal(0);
	const { t } = useTranslation();
	const [query] = useSearchParams();

	const session = getSession(query.cordsId);

	const data = createQuery(() => ({
		queryKey: ["search", search()],
		queryFn: async () => {
			const start = performance.now();
			const res = await cords.search(search().q, {
				lat: session.data?.lat!,
				lng: session.data?.lng!,
				...search().options,
			});
			setSearchTime((performance.now() - start) / 1000);
			setMaxPage(Math.ceil(res.meta.total / 10));
			return res;
		},
		gcTime: 0,
		enabled: !!search().q && !!session.data,
		throwOnError: true,
	}));

	const start = () => Math.max(0, search().options.page - 3);
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
									<h4>{search().q}</h4>
									<p class="text-xs text-steel">
										{t().search.meta.page} {search().options.page}{" "}
										{t().search.meta.of} {data().meta.total}{" "}
										{t().search.meta.results} ({searchTime().toFixed(2)}{" "}
										{t().search.meta.seconds})
									</p>
									<div class="pt-4 flex gap-4 flex-wrap">
										{Object.entries(search().options.delivery).map(
											([key, value]) => (
												<label class="inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={value}
														onChange={(e) =>
															setSearch((search) => ({
																...search,
																options: {
																	...search.options,
																	delivery: {
																		...search.options.delivery,
																		[key]: e.target.checked,
																	},
																},
															}))
														}
														class="sr-only peer"
													/>
													<div class="relative w-8 h-[18px] bg-slate bg-opacity-50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue"></div>
													<span class="ms-2 text-xs text-steel">
														{/* @ts-ignore */}
														{t().search.filters.delivery[key]}
													</span>
												</label>
											)
										)}
									</div>
								</div>
								<div>
									<For each={data().data}>
										{(service) => <ServiceItem service={service} />}
									</For>
								</div>
								<div class="flex justify-center items-center gap-2 h-12 bg-elevation1 w-full border-t">
									<button
										disabled={search().options.page === 1}
										onClick={() =>
											setSearch((search) => ({
												...search,
												options: {
													...search.options,
													page: search.options.page - 1,
												},
											}))
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
													setSearch((search) => ({
														...search,
														options: { ...search.options, page: i + 1 },
													}))
												}
												class={`w-7 h-8 rounded text-sm ${
													i + 1 === search().options.page
														? "bg-primary text-white"
														: "text-primary"
												}`}
											>
												{i + 1}
											</button>
										)}
									</For>
									<button
										disabled={search().options.page === maxPage()}
										onClick={() =>
											setSearch((search) => ({
												...search,
												options: {
													...search.options,
													page: search.options.page + 1,
												},
											}))
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
