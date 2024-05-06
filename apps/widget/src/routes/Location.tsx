import { debounce } from "@solid-primitives/scheduled";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show, Suspense, createSignal } from "solid-js";
import { location, setLocation, setUserLocation } from "../lib/location";

const geocode = async (query: string) => {
	const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
	url.searchParams.append("address", query);
	url.searchParams.append("components", "country:ca");
	url.searchParams.append("key", "AIzaSyBd8fQknyAuGoA6lsCj0OEFkd7LxIU45Tc");
	const res = await fetch(url);
	const data = await res.json();
	return data;
};

const getPlace = async (placeId: string) => {
	const url = new URL("http://localhost:3000/place/details/json");
	url.searchParams.append("place_id", placeId);
	url.searchParams.append("fields", "formatted_address,geometry");
	url.searchParams.append("key", "AIzaSyBd8fQknyAuGoA6lsCj0OEFkd7LxIU45Tc");
	const res = await fetch(url);
	const data = await res.json();
	return data;
};

const autocomplete = async (query: string) => {
	const url = new URL(`http://localhost:3000/place/autocomplete/json`);
	url.searchParams.append("input", query);
	url.searchParams.append("types", "geocode");
	url.searchParams.append("components", "country:ca");
	url.searchParams.append("key", "AIzaSyBd8fQknyAuGoA6lsCj0OEFkd7LxIU45Tc");
	const res = await fetch(url);
	const data = await res.json();
	return data;
};

const LocationSearch = (props: { search: string }) => {
	const navigate = useNavigate();
	const [query] = useSearchParams();

	const data = createQuery(() => ({
		queryKey: ["location", props.search],
		queryFn: async () => {
			const res = await autocomplete(props.search);
			console.log(res);
			return res;
		},
		enabled: props.search !== "",
		throwOnError: true,
		suspense: true,
	}));

	return (
		<Show when={data.data}>
			<For each={data.data.predictions}>
				{(prediction) => (
					<div
						class="bg-white text-white p-4 -mt-2 rounded-lg cursor-pointer border"
						onClick={async () => {
							const place = await getPlace(prediction.place_id);
							setLocation({
								lat: place.result.geometry.location.lat,
								lng: place.result.geometry.location.lng,
								name: place.result.formatted_address,
							});
							navigate(`/?${new URLSearchParams(query).toString()}`);
						}}
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

	const updateSearch = debounce((query: string) => setSearch(query), 500);

	return (
		<div class="p-4 flex flex-col gap-4">
			<div>
				<p class="font-medium">{location().name.split(",")[0]}</p>
				<p class="text-xs text-steel">{location().name.split(",").slice(1).join(",")}</p>
			</div>
			<hr />
			<button
				class="w-full bg-primary text-white h-12 text-sm flex items-center gap-2 justify-center rounded"
				onClick={() => {
					setUserLocation(() => navigate(`/?${new URLSearchParams(query).toString()}`));
				}}
			>
				<span class="material-symbols-outlined text-lg">gps_fixed</span>
				Use current location
			</button>
			<form
				class="w-full border rounded h-12 flex items-center"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<input
					autocomplete="off"
					class="outline-none px-4 h-full w-full text-sm rounded"
					placeholder="Search for a location..."
					name="query"
					value={search()}
					onInput={(e) => {
						updateSearch(e.currentTarget.value);
					}}
				/>

				<button type="submit" class="hidden"></button>
			</form>
			<Suspense>
				<LocationSearch search={search()} />
			</Suspense>
		</div>
	);
};

export default Location;
