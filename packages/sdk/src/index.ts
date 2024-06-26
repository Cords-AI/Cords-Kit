import type {
	CordsError,
	ResourceAddressType,
	ResourceType,
	SearchOptions,
	SearchResourceType,
} from "./types";
export * from "./types";

export const ResourceOptions = {};

export const CordsAPI = ({
	apiKey,
	version = "production",
}: {
	apiKey: string;
	version?: "production" | "dev";
}) => {
	const baseUrl = version === "production" ? "https://api.cords.ai" : "https://api.cords.dev";

	const request = async (input: RequestInfo, init?: RequestInit) => {
		const res = await fetch(input, {
			...init,
			headers: {
				"x-api-key": apiKey,
				...init?.headers,
			},
		});
		if (!res.ok) {
			if (res.status === 403)
				throw new Error("Bad API key. Ensure you have a valid API key.");
			const data: CordsError = await res.json();
			if (data.detail) throw new Error(data.detail);
			else throw new Error("An error occurred");
		}
		return res;
	};

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

		const res = await request(`${url.toString()}?${params}`);
		const data = await res.json();
		return data as {
			data: SearchResourceType[];
			meta: { total: number; lat: number; lng: number };
		};
	};

	const related = async (id: string) => {
		const url = new URL(`/resource/${id}/related`, baseUrl);

		const res = await request(url.toString());
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	const resource = async (id: string) => {
		const url = new URL(`/resource/${id}`, baseUrl);

		const res = await request(url.toString());
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
		return data as ResourceType;
	};

	const resourceList = async (ids: string[]): Promise<{ data: ResourceType[] }> => {
		if (ids.length === 0)
			return {
				data: [],
			};
		const params = new URLSearchParams();
		ids.forEach((id, index) => params.append(`ids[${index}]`, id));

		const url = new URL(`/search?${params.toString()}`, baseUrl);

		const res = await request(url.toString());
		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	const nearestNeighbour = async (
		id: string,
		options: {
			lat: number;
			lng: number;
		}
	) => {
		const url = new URL(`/resource/${id}/nearest-neighbor`, baseUrl);

		const params = new URLSearchParams({
			lat: options.lat.toString(),
			lng: options.lng.toString(),
		});

		const res = await request(url.toString() + "?delivery=local&" + params.toString());
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
		console.log(data);
		return data as { data: ResourceType[] };
	};

	return {
		search,
		related,
		resource,
		resourceList,
		nearestNeighbour,
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
