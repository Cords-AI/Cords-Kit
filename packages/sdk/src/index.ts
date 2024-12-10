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
	referer,
	baseUrl,
}: {
	apiKey: string;
	version?: "production" | "dev";
	referer?: string;
	baseUrl?: string;
}) => {
	// Set the base URL for the Cords API
	baseUrl =
		baseUrl ??
		(version === "production"
			? "https://api.cords.ai"
			: "https://api.cords.dev");

	baseUrl = baseUrl.replace(/\/$/, "");

	// Helper for making requests to the Cords API that applies the api key, referrer, and handles errors
	const request = async (input: RequestInfo, init?: RequestInit) => {
		const res = await fetch(input, {
			...init,
			headers: {
				"x-api-key": apiKey,
				...(referer ? { referer } : {}),
				...init?.headers,
			},
		});
		if (!res.ok) {
			if (res.status === 403)
				throw new Error(
					"Bad API key. Ensure you have a valid API key.",
				);
			const data: CordsError = await res.json();
			if (data.detail) throw new Error(data.detail);
			else throw new Error("An error occurred");
		}
		return res;
	};

	// Search for resources
	const search = async (
		q: string,
		{
			calculateCityFromSearchString = true,
			calculateProvinceFromSearchString = true,
			...options
		}: SearchOptions,
	) => {
		const url = new URL(`${baseUrl}/search`);
		const params = new URLSearchParams({
			q,
		});

		params.append("lat", options.lat.toString());
		params.append("lng", options.lng.toString());

		// Add top-level parameters
		if (options.page) params.append("page", options.page.toString());
		if (options.pageSize)
			params.append("pageSize", options.pageSize.toString());
		if (options.distance)
			params.append("distance", options.distance.toString());

		// Add boolean parameters
		params.append(
			"calculateProvinceFromSearchString",
			calculateProvinceFromSearchString ? "true" : "false",
		);
		params.append(
			"calculateCityFromSearchString",
			calculateCityFromSearchString ? "true" : "false",
		);

		// Add partner parameters
		if (options.partner) {
			for (const [key, value] of Object.entries(options.partner)) {
				params.append(`filter[${key}]`, value ? "true" : "false");
			}
		}

		// Add delivery parameters
		if (options.delivery) {
			for (const [key, value] of Object.entries(options.delivery)) {
				params.append(
					`filter[delivery][${key}]`,
					value ? "true" : "false",
				);
			}
		}

		const res = await request(`${url.toString()}?${params}`);
		const data = await res.json();
		return data as {
			data: SearchResourceType[];
			meta: { total: number; lat: number; lng: number };
		};
	};

	// Get related to a resource
	const related = async (id: string) => {
		const url = new URL(`${baseUrl}/resource/${id}/related`);

		const res = await request(url.toString());
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	// Get a single resource by id
	const resource = async (id: string) => {
		const url = new URL(`${baseUrl}/resource/${id}`);

		const res = await request(url.toString());
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
		return data as ResourceType;
	};

	// Get a list of resources by id
	const resourceList = async (
		ids: string[],
	): Promise<{ data: ResourceType[] }> => {
		if (ids.length === 0)
			return {
				data: [],
			};
		const params = new URLSearchParams();
		ids.forEach((id, index) => params.append(`ids[${index}]`, id));

		const url = new URL(`${baseUrl}/search?${params.toString()}`);

		const res = await request(url.toString());
		const data = await res.json();
		return data as { data: ResourceType[] };
	};

	// Get the nearest neighbour to a resource
	const nearestNeighbour = async (
		id: string,
		options: {
			lat: number;
			lng: number;
		},
	) => {
		const url = new URL(`${baseUrl}/resource/${id}/nearest-neighbor`);

		const params = new URLSearchParams({
			lat: options.lat.toString(),
			lng: options.lng.toString(),
		});

		const res = await request(
			url.toString() + "?delivery=local&" + params.toString(),
		);
		if (!res.ok) {
			const data: CordsError = await res.json();
			throw new Error(data.detail);
		}
		const data = await res.json();
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

// Helper function to format a service address
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
