import { createSignal } from "solid-js";

export const [search, setSearch] = createSignal({
	query: "",
	page: 0,
});
