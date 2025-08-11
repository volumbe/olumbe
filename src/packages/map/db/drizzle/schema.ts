import { pgTable, uuid, timestamp, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const locations = pgTable("locations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	latitude: doublePrecision().notNull(),
	longitude: doublePrecision().notNull(),
	accuracy: doublePrecision().notNull(),
});
