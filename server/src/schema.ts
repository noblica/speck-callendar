import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const eventsTable = pgTable('events_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export type InsertEvent = typeof eventsTable.$inferInsert;
export type SelectEvent = typeof eventsTable.$inferSelect;
