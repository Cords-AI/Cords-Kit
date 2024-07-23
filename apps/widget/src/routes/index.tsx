import { createForm } from "@tanstack/solid-form";
import { createQuery } from "@tanstack/solid-query";
import { Component, createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import { Transition } from "solid-transition-group";
import Pending from "~/components/Pending";
import ServiceItem from "~/components/ServiceItem";
import { useCords } from "~/lib/cords";
import { loader } from "~/lib/google";
import { useSearchParams } from "~/lib/params";
import { mapOpen, search, setMapOpen, setSearch } from "~/lib/search";
import { getSession } from "~/lib/session";
import { cn } from "~/lib/utils";
import { useTranslation } from "~/translations";

const icons = {
	"211": "chrome_reader_mode",
	magnet: "business_center",
	mentor: "supervisor_account",
	prosper: "assistant",
	volunteer: "volunteer_activism",
};

const Filters = () => {
	const [open, setOpen] = createSignal(false);
	const { t } = useTranslation();
	const form = createForm(() => ({
		defaultValues: {
			distance: 10,
			too: search().options.partner["211"],
			magnet: search().options.partner.magnet,
			mentor: search().options.partner.mentor,
			prosper: search().options.partner.prosper,
			volunteer: search().options.partner.volunteer,
		},
		onSubmit: async ({ value }) => {
			setSearch((search) => ({
				...search,
				options: {
					...search.options,
					page: 1,
					distance: value.distance,
					partner: {
						"211": value.too,
						magnet: value.magnet,
						mentor: value.mentor,
						prosper: value.prosper,
						volunteer: value.volunteer,
					},
				},
			}));
		},
	}));

	const isPristine = form.useStore((state) => state.isPristine);
	const values = form.useStore((state) => state.values);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<span
				onClick={() => setOpen(!open())}
				class={cn(
					"select-none material-symbols-outlined rounded-full flex items-center justify-center h-10 text-[20px] text-primary w-10 -mr-3 cursor-pointer",
					open() ? "bg-primary bg-opacity-10" : "bg-elevation1"
				)}
			>
				tune
			</span>
			<Transition
				onEnter={(el, done) => {
					const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: 100,
					});
					a.finished.then(done);
				}}
				onExit={(el, done) => {
					const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 100,
					});
					a.finished.then(done);
				}}
			>
				<Show when={open()}>
					<div class="absolute rounded-xl top-14 z-50 right-0 gap-2 flex flex-col bg-elevation1 border border-b-hairline p-4 rounded-b w-full">
						<p>{t().search.filters.typeTitle}</p>
						<div class="flex gap-2 flex-wrap">
							{Object.entries(t().search.filters.type).map(([key, value]) => (
								<form.Field
									// @ts-ignore
									name={key === "211" ? "too" : key}
									children={(field) => (
										<label
											class={cn(
												"inline-flex gap-2 items-center cursor-pointer px-3 h-10 rounded border",
												field().state.value
													? "border-primary bg-primary bg-opacity-10"
													: "border-hairline"
											)}
										>
											<input
												type="checkbox"
												name={field().name}
												// @ts-ignore
												checked={field().state.value}
												onBlur={field().handleBlur}
												onChange={(e) => {
													const unCheckedCount = Object.values(
														values()
													).filter(
														(x) => typeof x === "boolean" && !x
													).length;
													if (unCheckedCount === 4 && !e.target.checked) {
														return;
													}
													field().handleChange(e.target.checked);
												}}
												class="sr-only"
											/>
											<span
												onClick={() => setOpen(!open())}
												class="material-symbols-outlined text-[20px]"
											>
												{/* @ts-ignore */}
												{icons[key]}
											</span>
											<p class="text-sm">{value}</p>
										</label>
									)}
								/>
							))}
						</div>
						<p class="mt-2">{t().search.filters.distanceTitle}</p>
						<form.Field
							name="distance"
							children={(field) => (
								<div class="border rounded w-full px-4 pt-2">
									<p class="text-xs">kilometers</p>
									<input
										type="number"
										name={field().name}
										value={field().state.value}
										onBlur={field().handleBlur}
										onInput={(e) =>
											field().handleChange(Number(e.target.value))
										}
										min="1"
										class="outline-none h-8 w-full"
									/>
								</div>
							)}
						/>
						<div class="flex justify-between mt-4">
							<Show when={!isPristine()}>
								<button
									class={"neutral-btn"}
									onClick={() => {
										form.reset();
										form.validateAllFields("change");
									}}
								>
									{t().search.reset}
								</button>
							</Show>
							<div class="flex flex-1 justify-end">
								<input
									type="submit"
									value={t().search.filters.apply}
									class="btn disabled:opacity-50"
									disabled={isPristine()}
								/>
							</div>
						</div>
					</div>
				</Show>
			</Transition>
		</form>
	);
};

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
	let mapContainer: any;

	onMount(async () => {
		try {
			const { Map } = (await loader.importLibrary("maps")) as google.maps.MapsLibrary;
			if (mapContainer) {
				new Map(mapContainer, {
					center: { lat, lng },
					zoom: 8,
					disableDefaultUI: true,
				});
			}
		} catch (error) {
			console.error("Failed to load Google Maps:", error);
			// Handle the error, e.g., show an error message to the user
		}
	});

	return (
		<div class="h-full w-full relative">
			<button
				onClick={() => setMapOpen(false)}
				class={cn("absolute top-4 left-4 neutral-btn z-50")}
				style={{
					"background-color": "white",
				}}
			>
				<span class="material-symbols-outlined text-[22px] text-primary">arrow_back</span>
			</button>
			<div ref={mapContainer} class="h-full w-full"></div>
		</div>
	);
};

const Home: Component = () => {
	const cords = useCords();
	const [searchTime, setSearchTime] = createSignal(0);
	const [maxPage, setMaxPage] = createSignal(0);
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();

	const session = getSession(searchParams.cordsId);

	const data = createQuery(() => ({
		queryKey: ["search", searchParams.q, search()],
		queryFn: async () => {
			const start = performance.now();
			const res = await cords.search(search().q !== "" ? search().q : searchParams.q!, {
				lat: session.data?.lat!,
				lng: session.data?.lng!,
				...search().options,
			});
			setSearchTime((performance.now() - start) / 1000);
			setMaxPage(Math.ceil(res.meta.total / 10));
			return res;
		},
		gcTime: 0,
		enabled: (!!search().q || !!searchParams.q) && !!session.data,
		throwOnError: true,
	}));

	const start = () => Math.max(0, search().options.page - 3);
	const end = () => start() + 5;

	return (
		<Switch>
			<Match when={data.isPending}>
				<Pending />
			</Match>
			<Match when={mapOpen()}>
				<Map lat={session.data?.lat!} lng={session.data?.lng!} />
			</Match>
			<Match when={data.isSuccess}>
				<div class="relative">
					<Show when={data.data}>
						{(data) => (
							<>
								<div class="p-6 bg-elevation1">
									<div class="flex justify-between gap-2 relative">
										<span>
											<h4>
												{search().q !== ""
													? search().q
													: t().home.similar.title}
											</h4>
											<p class="text-xs text-steel">
												{t().search.meta.page} {search().options.page}{" "}
												{t().search.meta.of} {data().meta.total}{" "}
												{t().search.meta.results} ({searchTime().toFixed(2)}{" "}
												{t().search.meta.seconds}) {t().search.meta.within}{" "}
												{search().options.distance} km
											</p>
										</span>
										<Filters />
									</div>
									<div class="pt-4 flex gap-4 flex-wrap">
										{Object.entries(search().options.delivery).map(
											([key, value]) => (
												<label class="inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={value}
														onChange={(e) => {
															setSearch((search) => ({
																...search,
																options: {
																	...search.options,
																	delivery: {
																		...search.options.delivery,
																		[key]: e.target.checked,
																	},
																},
															}));
														}}
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
								<div class="relative">
									<For each={data().data}>
										{(service) => <ServiceItem service={service} />}
									</For>
									<button
										onClick={() => setMapOpen(!mapOpen())}
										class="fixed bottom-[100px] right-10 btn"
									>
										<span class="material-symbols-outlined">map</span>
									</button>
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

export default Home;
