import { createForm } from "@tanstack/solid-form";
import { createSignal, For, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import ServiceItem from "@/components/ServiceItem";
import { cn, getDistanceBetweenTwoPoints } from "@/lib/utils";
import { useTranslation } from "@/translations";
import { createFileRoute } from "@tanstack/solid-router";
import { CordsAPI } from "@cords/sdk";
import { z } from "zod";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	validateSearch: z.object({
		search: z.string().optional(),
		page: z.number().default(1),
		"211": z.boolean().default(true),
		magnet: z.boolean().default(true),
		mentor: z.boolean().default(true),
		prosper: z.boolean().default(true),
		volunteer: z.boolean().default(true),
		distance: z.number().default(10),
		local: z.boolean().default(true),
		regional: z.boolean().default(true),
		provincial: z.boolean().default(true),
		national: z.boolean().default(true),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps, context }) => {
		const cords = CordsAPI({
			apiKey: deps.api_key ?? "",
			version: "production",
		});
		const start = performance.now();
		const res = await cords.search({
			q: deps.search ?? deps.q ?? "food",
			lat: context.session.lat,
			lng: context.session.lng,
			pageSize: 10,
			page: deps.page ?? 1,
			distance: deps.distance,
			partner: {
				"211": deps["211"],
				magnet: deps.magnet,
				mentor: deps.mentor,
				prosper: deps.prosper,
				volunteer: deps.volunteer,
			},
			delivery: {
				local: deps.local,
				regional: deps.regional,
				provincial: deps.provincial,
				national: deps.national,
			},
		});
		const searchTime = (performance.now() - start) / 1000;
		const maxPage = Math.ceil(res.meta.total / 10);
		return { ...res, searchTime, maxPage };
	},
});

const icons = {
	"211": "chrome_reader_mode",
	magnet: "business_center",
	mentor: "supervisor_account",
	prosper: "assistant",
	volunteer: "volunteer_activism",
};

const Filters = () => {
	const [open, setOpen] = createSignal(false);
	const searchParams = Route.useSearch();
	const { t } = useTranslation();
	const navigate = Route.useNavigate();
	const form = createForm(() => ({
		defaultValues: {
			distance: searchParams().distance,
			too: searchParams()[211],
			magnet: searchParams().magnet,
			mentor: searchParams().mentor,
			prosper: searchParams().prosper,
			volunteer: searchParams().volunteer,
		},
		onSubmit: async ({ value }) => {
			navigate({
				to: ".",
				search: (s) => ({
					...s,
					page: 1,
					distance: value.distance,
					"211": value.too,
					magnet: value.magnet,
					mentor: value.mentor,
					prosper: value.prosper,
					volunteer: value.volunteer,
				}),
			});
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
					open() ? "bg-primary bg-opacity-10" : "bg-elevation1",
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
							{Object.entries(t().search.filters.type).map(
								([key, value]) => (
									<form.Field
										// @ts-ignore
										name={key === "211" ? "too" : key}
										children={(field) => (
											<label
												class={cn(
													"inline-flex gap-2 items-center cursor-pointer px-3 h-10 rounded border",
													field().state.value
														? "border-primary bg-primary bg-opacity-10"
														: "border-hairline",
												)}
											>
												<input
													type="checkbox"
													name={field().name}
													// @ts-ignore
													checked={
														field().state.value
													}
													onBlur={field().handleBlur}
													onChange={(e) => {
														const unCheckedCount =
															Object.values(
																values(),
															).filter(
																(x) =>
																	typeof x ===
																		"boolean" &&
																	!x,
															).length;
														if (
															unCheckedCount ===
																4 &&
															!e.target.checked
														) {
															return;
														}
														field().handleChange(
															e.target.checked,
														);
													}}
													class="sr-only"
												/>
												<span
													onClick={() =>
														setOpen(!open())
													}
													class="material-symbols-outlined text-[20px]"
												>
													{/* @ts-ignore */}
													{icons[key]}
												</span>
												<p class="text-sm">{value}</p>
											</label>
										)}
									/>
								),
							)}
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
											field().handleChange(
												Number(e.target.value),
											)
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

function RouteComponent() {
	const { t } = useTranslation();
	const context = Route.useRouteContext();
	const { session } = context();
	const data = Route.useLoaderData();
	const searchParams = Route.useSearch();
	const navigate = Route.useNavigate();

	const start = () => Math.max(0, searchParams().page - 3);
	const end = () => start() + 5;

	const markers = () =>
		data()
			.data?.filter(
				(resource) => resource.location.lat && resource.location.lng,
			)
			.filter((resource) => {
				const distance = getDistanceBetweenTwoPoints(
					{
						lat: session?.lat!,
						lng: session?.lng!,
					},
					{
						lat: resource.location.lat!,
						lng: resource.location.lng!,
					},
				);
				if (distance < searchParams().distance) {
					return true;
				}
			});

	return (
		<div class="relative">
			<Show when={data()}>
				{(data) => (
					<>
						<div class="p-6 bg-elevation1">
							<div class="flex justify-between gap-2 relative">
								<span>
									<h4>
										{searchParams().search !== ""
											? searchParams().search
											: t().home.similar.title}
									</h4>
									<p class="text-xs text-steel">
										{t().search.meta.page}{" "}
										{searchParams().page}{" "}
										{t().search.meta.of} {data().meta.total}{" "}
										{t().search.meta.results} (
										{data().searchTime.toFixed(2)}{" "}
										{t().search.meta.seconds}){" "}
										{t().search.meta.within}{" "}
										{searchParams().distance} km
									</p>
								</span>
								<Filters />
							</div>
							<div class="pt-4 flex gap-4 flex-wrap">
								{Object.entries({
									local: searchParams().local,
									regional: searchParams().regional,
									provincial: searchParams().provincial,
									national: searchParams().national,
								} as const).map(([key, value]) => (
									<label class="inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={value}
											onChange={(e) => {
												navigate({
													to: ".",
													search: (s) => ({
														...s,
														[key]: e.target.checked,
													}),
												});
											}}
											class="sr-only peer"
										/>
										<div class="relative w-8 h-[18px] bg-slate bg-opacity-50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue"></div>
										<span class="ms-2 text-xs text-steel">
											{
												// @ts-ignore
												t().search.filters.delivery[key]
											}
										</span>
									</label>
								))}
							</div>
						</div>
						<div class="relative">
							<For each={data().data}>
								{(service) => <ServiceItem service={service} />}
							</For>
						</div>
						<div
							class={cn(
								"flex justify-center items-center gap-2 h-12 bg-elevation1 w-full border-t",
								markers() && markers()!.length > 0 && "pr-14",
							)}
						>
							<button
								disabled={searchParams().page === 1}
								onClick={() =>
									navigate({
										to: ".",
										search: (s) => ({
											...s,
											page: searchParams().page - 1,
										}),
									})
								}
								class="text-primary p-2 rounded-lg flex items-center justify-center"
							>
								<span class="material-symbols-outlined">
									chevron_left
								</span>
							</button>
							<For
								each={[...Array(data().maxPage).keys()].slice(
									start(),
									end(),
								)}
							>
								{(i) => (
									<button
										onClick={() =>
											navigate({
												to: ".",
												search: (s) => ({
													...s,
													page: i + 1,
												}),
											})
										}
										class={`w-7 h-8 rounded text-sm ${
											i + 1 === searchParams().page
												? "bg-primary text-white"
												: "text-primary"
										}`}
									>
										{i + 1}
									</button>
								)}
							</For>
							<button
								disabled={
									searchParams().page === data().maxPage
								}
								onClick={() =>
									navigate({
										to: ".",
										search: (s) => ({
											...s,
											page: searchParams().page + 1,
										}),
									})
								}
								class="text-primary p-2 rounded-lg flex items-center justify-center"
							>
								<span class="material-symbols-outlined">
									chevron_right
								</span>
							</button>
						</div>
					</>
				)}
			</Show>
		</div>
	);
}
