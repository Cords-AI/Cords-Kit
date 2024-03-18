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
