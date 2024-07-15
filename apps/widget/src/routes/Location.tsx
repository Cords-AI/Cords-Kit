import { Loader } from "@googlemaps/js-api-loader";
import { debounce } from "@solid-primitives/scheduled";
import { useNavigate } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import Pending from "~/components/Pending";
import { location, setLocation, setUserLocation } from "~/lib/location";
import { useSearchParams } from "~/lib/params";
import { useTranslation } from "~/translations";

const loader = new Loader({
	apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
	version: "weekly",
	libraries: ["places"],
});
let autocompleteService: google.maps.places.AutocompleteService | null = null;
let placesService: google.maps.places.PlacesService | null = null;

const getPlace = (placeId: string): Promise<google.maps.places.PlaceResult> => {
	return new Promise(async (resolve, reject) => {
		if (!placesService) {
			const { PlacesService } = await loader.importLibrary("places");
			placesService = new PlacesService(document.createElement("div"));
		}
		placesService.getDetails(
			{
				placeId,
				fields: ["formatted_address", "geometry"],
			},
			(place, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK && place) {
					resolve(place);
				} else {
					reject(status);
				}
			}
		);
	});
};

const autocomplete = async (
	query: string
): Promise<google.maps.places.AutocompletePrediction[]> => {
	return new Promise(async (resolve, reject) => {
		if (!autocompleteService) {
			const { AutocompleteService } = await loader.importLibrary("places");
			autocompleteService = new AutocompleteService();
		}
		autocompleteService.getPlacePredictions(
			{
				input: query,
				types: ["geocode"],
				componentRestrictions: { country: "ca" },
			},
			(predictions, status) => {
				if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
					reject(status);
				} else {
					resolve(predictions);
				}
			}
		);
	});
};

const LocationSearch = (props: { search: string; setPlace: (placeId: string) => void }) => {
	const data = createQuery(() => ({
		queryKey: ["location", props.search],
		queryFn: () => autocomplete(props.search),
		enabled: props.search !== "",
		throwOnError: true,
	}));

	return (
		<Show when={data.data}>
			<For each={data.data}>
				{(prediction) => (
					<div
						class="bg-white text-white p-4 -mt-2 rounded-lg cursor-pointer border"
						onClick={() => props.setPlace(prediction.place_id)}
					>
						<p>{prediction.description.split(",")[0]}</p>
						<p class="text-xs text-steel">
							{prediction.description.split(",").slice(1).join(",")}
						</p>
					</div>
				)}
			</For>
		</Show>
	);
};

const Location = () => {
	const navigate = useNavigate();
	const [query] = useSearchParams();
	const [search, setSearch] = createSignal("");
	const { t } = useTranslation();

	const updateSearch = debounce((query: string) => setSearch(query), 500);

	const data = createQuery(() => ({
		queryKey: ["location", search()],
		queryFn: () => autocomplete(search()),
		enabled: search() !== "",
		throwOnError: true,
	}));

	const setPlace = createMutation(() => ({
		mutationKey: ["place"],
		mutationFn: async (placeId: string) => {
			const place = await getPlace(placeId);
			setLocation({
				lat: place.geometry?.location?.lat()!,
				lng: place.geometry?.location?.lng()!,
				name: place.formatted_address!,
			});
			navigate(`/?${new URLSearchParams(query).toString()}`);
		},
		throwOnError: true,
	}));

	return (
		<Switch>
			<Match when={setPlace.isPending}>
				<Pending />
			</Match>
			<Match when={setPlace.isIdle}>
				<div class="p-4 flex flex-col gap-4">
					<div>
						<p class="font-medium">{location().name.split(",")[0]}</p>
						<p class="text-xs text-steel">
							{location().name.split(",").slice(1).join(",")}
						</p>
					</div>
					<hr />
					<button
						class="w-full bg-primary text-white h-12 text-sm flex items-center gap-2 justify-center rounded"
						onClick={() => {
							setUserLocation(() =>
								navigate(`/?${new URLSearchParams(query).toString()}`)
							);
						}}
					>
						<span class="material-symbols-outlined text-lg">gps_fixed</span>
						{t().location["use-current"]}
					</button>
					<form
						class="w-full border rounded h-12 flex items-center"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<input
							type="text"
							autocomplete="off"
							class="outline-none px-4 h-full w-full text-sm rounded placeholder:text-sm"
							placeholder={t().location.search}
							name="query"
							value={search()}
							onInput={(e) => {
								updateSearch(e.currentTarget.value);
							}}
						/>

						<button type="submit" class="hidden"></button>
					</form>
					<Show when={data.data}>
						<For each={data.data}>
							{(prediction) => (
								<div
									class="bg-white text-white p-4 -mt-2 rounded-lg cursor-pointer border"
									onClick={() => setPlace.mutate(prediction.place_id)}
								>
									<p>{prediction.description.split(",")[0]}</p>
									<p class="text-xs text-steel">
										{prediction.description.split(",").slice(1).join(",")}
									</p>
								</div>
							)}
						</For>
					</Show>
				</div>
			</Match>
		</Switch>
	);
};

export default Location;
