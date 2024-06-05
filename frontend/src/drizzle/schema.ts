import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const feedback = pgTable("feedback", {
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  link: text("link").notNull(),
  songIdBySuno: text("song_id_by_suno"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Create a one to many relationship between users and songs
// users are the songs creator

export const usersRelations = relations(users, ({ many }) => ({
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one }) => ({
  user: one(users, {
    fields: [songs.userId],
    references: [users.id],
  }),
}));
