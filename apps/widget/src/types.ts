import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessions } from "./server/schema";

export const SessionSchema = createSelectSchema(sessions);
export type Session = z.infer<typeof SessionSchema>;
