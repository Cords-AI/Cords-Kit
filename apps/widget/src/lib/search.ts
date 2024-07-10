import { SearchOptions } from "@cords/sdk";
import { createSignal } from "solid-js";

export const [search, setSearch] = createSignal<{
	q: string;
	options: Required<Omit<SearchOptions, "lat" | "lng" | "distance">>;
}>({
	q: "",
	options: {
		page: 0,
		pageSize: 10,
		filter: {
			"211": true,
			mentor: true,
			prosper: true,
			magnet: true,
		},
		delivery: {
			local: true,
			regional: true,
			provincial: true,
			national: true,
		},
	},
});
