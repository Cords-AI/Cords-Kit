import type { Resource } from "./types";

export type SearchOptions = {
	page?: number;
	lat?: number;
	lng?: number;
	distance?: number;
	filter?: {
		"211"?: boolean;
		mentor?: boolean;
		prosper?: boolean;
		magnet?: boolean;
	};
};

export const ResourceOptions = {};

export const CordsAPI = ({ apiKey }: { apiKey: string }) => {
	const search = (query: string, options?: SearchOptions) => {
		console.log("WIP");
	};

	const resource = async (id: string) => {
		const url = new URL(`https://api.cords.ai/resource/${id}`);
		url.searchParams.set("api_key", apiKey);

		const res = await fetch(url);
		const data = await res.json();
		return data as Resource;
	};

	return {
		search,
		resource,
	};
};
