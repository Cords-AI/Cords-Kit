import { ResourceAddressType } from "../dist";
import type { ResourceType } from "./types";
export * from "./types";

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

const baseUrl = "https://api.cords.ai";

export const CordsAPI = ({ apiKey }: { apiKey: string }) => {
	const search = async (q: string, options?: SearchOptions) => {
		const url = new URL("/search", baseUrl);
		const params = new URLSearchParams({
			q,
		});

		// Add top-level parameters
		if (options?.page !== undefined) params.append("page", options.page.toString());
		if (options?.lat !== undefined) params.append("lat", options.lat.toString());
		if (options?.lng !== undefined) params.append("lng", options.lng.toString());
		if (options?.distance !== undefined) params.append("distance", options.distance.toString());

		// Add filter parameters
		if (options?.filter !== undefined) {
			for (const [key, value] of Object.entries(options.filter)) {
				if (value) params.append(`filter[${key}]`, "true");
			}
		}

		const res = await fetch(`${url}?${params}`, {
			headers: {
				"x-api-key": apiKey,
			},
		});
		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	const related = async (id: string) => {
		const url = new URL(`/resource/${id}/related`, baseUrl);

		const res = await fetch(url, {
			headers: {
				"x-api-key": apiKey,
			},
		});

		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	const resource = async (id: string) => {
		const url = new URL(`/resource/${id}`, baseUrl);

		const res = await fetch(url, {
			headers: {
				"x-api-key": apiKey,
			},
		});

		const data = await res.json();
		return data as ResourceType;
	};

	const resourceList = async (ids: string[]) => {
		if (ids.length === 0)
			return {
				data: [],
			};
		let idsString = "";
		ids.forEach(
			(id, index) =>
				(idsString += `ids${encodeURIComponent(`[${index}]`)}=${id}${
					index !== ids.length - 1 ? "&" : ""
				}`)
		);

		const url = new URL(`/search?${idsString}`, baseUrl);

		const res = await fetch(url, {
			headers: {
				"x-api-key": apiKey,
			},
		});

		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	return {
		search,
		related,
		resource,
		resourceList,
	};
};

export const formatServiceAddress = (address: ResourceAddressType) => {
	const street1 = address.street1 ? address.street1 + ", " : "";
	const street2 = address.street2 ? address.street2 + ", " : "";
	const city = address.city ? address.city + ", " : "";
	const province = address.province ? address.province + ", " : "";
	const postalCode = address.postalCode ? address.postalCode : "";
	const newAddress = street1 + street2 + city + province + postalCode;
	if (newAddress.endsWith(", ")) {
		return newAddress.slice(0, -2);
	} else return newAddress;
};
