import { SearchOptions } from "@cords/sdk";
import { createEffect, createSignal } from "solid-js";

export const [search, setSearch] = createSignal<{
	q: string;
	options: Required<Omit<SearchOptions, "lat" | "lng">>;
}>({
	q: "",
	options: {
		calculateProvinceFromSearchString: true,
		calculateCityFromSearchString: true,
		page: 1,
		pageSize: 10,
		distance: 10,
		meta: {
			taxonomy: [],
		},
		partner: {
			"211": true,
			mentor: true,
			prosper: true,
			magnet: true,
			volunteer: true,
		},
		delivery: {
			local: true,
			regional: true,
			provincial: true,
			national: true,
		},
	},
});

export const [mapOpen, setMapOpen] = createSignal(false);

export const [map, setMap] = createSignal<google.maps.Map | null>(null);

createEffect(() => {
	if (search()) {
		setMap(null);
	}
});
