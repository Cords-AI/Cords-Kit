type LocalizedField = {
	en: string;
	fr: string;
};

export type ResourceAddress = {
	street1: string;
	street2: string;
	city: string;
	postalCode: string;
	province: string;
	country: string;
	lat: number | null;
	lng: number | null;
};

export type Resource = {
	id: string;
	name: LocalizedField;
	description: LocalizedField;
	website: LocalizedField;
	email: LocalizedField;
	address: ResourceAddress;
	addresses: ResourceAddress[];
	phoneNumbers: {
		phone: string;
		name: string;
		type: string;
	}[];
	partner: string;
	delivery: "national" | "provincial" | "local" | "regional" | null;
};
