type LocalizedFieldType = {
	en: string;
	fr: string;
};

export type ResourceAddressType = {
	street1: string;
	street2: string;
	city: string;
	postalCode: string;
	province: string;
	country: string;
	lat: number | null;
	lng: number | null;
};

export type ResourceType = {
	id: string;
	name: LocalizedFieldType;
	description: LocalizedFieldType;
	website: LocalizedFieldType;
	email: LocalizedFieldType;
	address: ResourceAddressType;
	addresses: ResourceAddressType[];
	phoneNumbers: {
		phone: string;
		name: string;
		type: string;
	}[];
	partner: string;
	delivery: "national" | "provincial" | "local" | "regional" | null;
};

export type SearchOptions = {
	page?: number;
	lat?: number;
	lng?: number;
	distance?: number;
	pageSize?: number;
	filter?: {
		"211"?: boolean;
		mentor?: boolean;
		prosper?: boolean;
		magnet?: boolean;
	};
};

export type CordsError = {
	detail: string;
	status: number;
	title: string;
	type: string;
};
