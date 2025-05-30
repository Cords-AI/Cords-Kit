import { debounce } from "@solid-primitives/scheduled";
import { For, Show } from "solid-js";
import { loader } from "@/lib/google";
import { useTranslation } from "@/translations";
import { createFileRoute, useRouter } from "@tanstack/solid-router";
import { updateSessionFn } from "@/lib/session";
import { z } from "zod";
import { createServerFn } from "@tanstack/solid-start";

const getPlaceFn = createServerFn()
	.validator(z.string())
	.handler(async ({ data: placeId }) => {
		console.log("HERE", placeId);
		const res = await fetch(
			`https://places.googleapis.com/v1/places/${placeId}`,
			{
				headers: {
					"X-Goog-Api-Key":
						import.meta.env.VITE_GOOGLE_MAPS_KEY ??
						process.env.VITE_GOOGLE_MAPS_KEY,
					"X-Goog-FieldMask": "formatted_address,location",
				},
				method: "GET",
			},
		);
		const data = await res.json();
		return data;
	});

const autocompleteFn = createServerFn()
	.validator(z.string())
	.handler(async ({ data: input }) => {
		const res = await fetch(
			`https://places.googleapis.com/v1/places:autocomplete`,
			{
				method: "POST",
				body: JSON.stringify({
					input,
					includedRegionCodes: ["ca"],
				}),
				headers: {
					"X-Goog-Api-Key":
						import.meta.env.VITE_GOOGLE_MAPS_KEY ??
						process.env.VITE_GOOGLE_MAPS_KEY,
				},
			},
		);
		const data = await res.json();
		return data;
	});

export const Route = createFileRoute("/location")({
	component: RouteComponent,
	validateSearch: z.object({
		search: z.string().optional(),
	}),
	ssr: false,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		return deps.search
			? autocompleteFn({ data: deps.search })
			: { suggestions: [] };
	},
});

function RouteComponent() {
	const searchParams = Route.useSearch();
	const context = Route.useRouteContext();
	const { session } = context();
	const { t } = useTranslation();
	const navigate = Route.useNavigate();
	const data = Route.useLoaderData();
	const router = useRouter();

	const updateSearch = debounce(
		(query: string) =>
			navigate({
				to: ".",
				search: (s) => ({
					...s,
					search: query,
				}),
			}),
		500,
	);

	return (
		<div class="p-4 flex flex-col gap-4">
			<div>
				<p class="font-medium">{session.address}</p>
				<p class="text-xs text-steel">{session.address}</p>
			</div>
			<hr />
			<button
				class="w-full bg-primary text-white h-12 text-sm flex items-center gap-2 justify-center rounded-sm"
				onClick={(e) => {
					e.preventDefault();
					navigator.geolocation.getCurrentPosition(
						async (position) => {
							await updateSessionFn({
								data: {
									lat: position.coords.latitude,
									lng: position.coords.longitude,
									address: "Your Location, Set by device",
								},
								headers: {
									"cords-id": searchParams().cordsId,
								},
							});
							router.invalidate();
						},
						async () => {
							const res = await fetch(
								"https://api.cords.dev/info",
							);
							const data = await res.json();
							await updateSessionFn({
								data: {
									lat: data.lat,
									lng: data.lng,
									address: "Your Location, Set by device",
								},
								headers: {
									"cords-id": searchParams().cordsId,
								},
							});
							router.invalidate();
						},
						{
							enableHighAccuracy: true,
							timeout: 10000,
							maximumAge: 0,
						},
					);
				}}
			>
				<span class="material-symbols-outlined text-lg">gps_fixed</span>
				{t().location["use-current"]}
			</button>
			<form
				class="w-full border rounded-sm h-12 flex items-center"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<input
					type="text"
					autocomplete="off"
					class="outline-hidden px-4 h-full w-full text-sm rounded-sm placeholder:text-sm"
					placeholder={t().location.search}
					name="query"
					value={searchParams().search ?? ""}
					onInput={(e) => {
						updateSearch(e.currentTarget.value);
					}}
				/>

				<button type="submit" class="hidden"></button>
			</form>
			<Show when={data().suggestions && searchParams().search}>
				<For each={data().suggestions}>
					{(prediction) => (
						<div
							class="bg-white text-white p-4 -mt-2 rounded-lg cursor-pointer border"
							onClick={async () => {
								const place = await getPlaceFn({
									data: prediction.placePrediction.placeId,
								});
								await updateSessionFn({
									data: {
										lat: place.location.latitude,
										lng: place.location.longitude,
										address: place.formattedAddress,
									},
									headers: {
										"cords-id": searchParams().cordsId,
									},
								});
								navigate({
									to: ".",
									search: (s) => ({
										...s,
										search: undefined,
									}),
								});
							}}
						>
							<p>{prediction.placePrediction.text.text}</p>
						</div>
					)}
				</For>
			</Show>
		</div>
	);
}
