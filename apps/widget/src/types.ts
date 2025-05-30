import { z } from "zod";

export const SessionSchema = z.object({
	id: z.string(),
	lat: z.number(),
	lng: z.number(),
	address: z.string().min(1),
});
export type Session = z.infer<typeof SessionSchema>;

export const SearchSchema = z.object({
	q: z.string({ message: "Search query is required" }),
	cordsId: z.string({ message: "Cords ID is required" }),
	api_key: z.string({ message: "API Key is required" }),
	lang: z.enum(["en", "fr"]).optional(),
});
export type Search = z.infer<typeof SearchSchema>;
