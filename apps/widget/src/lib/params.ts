import { useSearchParams as useSearchParamsHook } from "@solidjs/router";

export const useSearchParams = () =>
	useSearchParamsHook<{
		q?: string;
		api_key?: string;
		lang?: string;
		"cords-id"?: string;
	}>();
