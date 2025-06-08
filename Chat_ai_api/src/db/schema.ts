import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: text("id").primaryKey(), 
  userId: text("user_id").notNull().primaryKey(), 
  message: text("message").notNull(),
  reply: text("reply").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const user = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().defaultNow(),
    });

// types inferrence for dizzle
export type ChatInsert = typeof chats.$inferSelect;
export type ChatSelect = typeof user.$inferSelect;
export type UserInsert = typeof chats.$inferSelect;
export type UserSelect = typeof user.$inferSelect;
