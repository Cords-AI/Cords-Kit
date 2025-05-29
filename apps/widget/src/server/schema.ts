import { relations } from "drizzle-orm";
import { sqliteTable, text, real, primaryKey } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
	id: text("id").notNull().primaryKey(),
	lat: real("lat").notNull(),
	lng: real("lng").notNull(),
	address: text("address").notNull(),
});

export const sessionRelations = relations(sessions, ({ many }) => ({
	clipboardServices: many(clipboardServices),
}));

export const clipboardServices = sqliteTable(
	"clipboard_services",
	{
		sessionId: text("session_id").notNull(),
		serviceId: text("service_id").notNull(),
	},
	(t) => [
		primaryKey({
			columns: [t.sessionId, t.serviceId],
		}),
	],
);

export const clipboardServicesRelationships = relations(
	clipboardServices,
	({ one }) => ({
		session: one(sessions, {
			fields: [clipboardServices.sessionId],
			references: [sessions.id],
		}),
	}),
);
