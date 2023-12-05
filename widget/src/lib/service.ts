import { z } from "zod";

const ServiceBodySchema = z.object({
	fees: z.string(),
	hours: z.string(),
	topics: z.string(),
	twitter: z.string().nullable(),
	youtube: z.string().nullable(),
	facebook: z.string().nullable(),
	linkedin: z.string().nullable(),
	instagram: z.string().nullable(),
	languages: z.string(),
	eligibility: z.string(),
	recordOwner: z.string(),
	accessibility: z.string(),
	documentsRequired: z.string(),
	applicationProcess: z.string(),
});

const ServiceAddressSchema = z.object({
	street1: z.string(),
	street2: z.string(),
	city: z.string(),
	postalCode: z.string(),
	province: z.string(),
	country: z.string(),
	lat: z.number().nullable(),
	lng: z.number().nullable(),
});

const BaseServiceSchema = z.object({
	id: z.string(),
	name: z.object({
		en: z.string(),
		fr: z.string(),
	}),
	description: z.object({
		en: z.string(),
		fr: z.string(),
	}),
	website: z.object({
		en: z.string(),
		fr: z.string(),
	}),
	email: z.object({
		en: z
			.string()
			.nullable()
			.transform((val) => val ?? ""),
		fr: z
			.string()
			.nullable()
			.transform((val) => val ?? ""),
	}),
	address: ServiceAddressSchema.optional(),
	addresses: ServiceAddressSchema.array(),
	phoneNumbers: z
		.object({
			phone: z.string(),
			name: z.string(),
			type: z.string(),
		})
		.array(),
	partner: z.string(),
	delivery: z.enum(["national", "provincial", "local", "regional"]).nullable(),
	body: z.object({
		en: ServiceBodySchema,
		fr: ServiceBodySchema.nullable(),
	}),
});

export const ServiceSchema = z.object({
	...BaseServiceSchema.shape,
	hydratedSimilarResources: BaseServiceSchema.array().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;
