import { index, pgTable, text, timestamp, boolean, serial, integer, uniqueIndex } from "drizzle-orm/pg-core"

// ---------- Better Auth tables ----------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("displayUsername"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("session_user_id_idx").on(table.userId),
  }),
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    issuer: text("issuer").notNull(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => ({
    issuerAccountUnique: uniqueIndex("account_issuer_account_id_unique").on(table.issuer, table.accountId),
    userIdIndex: index("account_user_id_idx").on(table.userId),
  }),
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => ({
    identifierIndex: index("verification_identifier_idx").on(table.identifier),
  }),
)

// ---------- App tables ----------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  categoryId: integer("category_id").notNull(),
  year: integer("year"),
  rating: text("rating"),
  duration: text("duration"),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  isSeries: boolean("is_series").notNull().default(false),
  tmdbId: text("tmdb_id"),
})

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
  seasonNumber: integer("season_number").notNull(),
  title: text("title"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url").notNull(),
  duration: text("duration"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const analyticsEvents = pgTable(
  "analytics_event",
  {
    id: serial("id").primaryKey(),
    eventId: text("event_id").notNull().unique(),
    visitorHash: text("visitor_hash").notNull(),
    eventType: text("event_type").notNull(),
    path: text("path").notNull(),
    mediaId: text("media_id"),
    mediaType: text("media_type"),
    mediaTitle: text("media_title"),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    typeTimeIndex: index("analytics_event_type_time_idx").on(table.eventType, table.occurredAt),
    visitorTimeIndex: index("analytics_event_visitor_time_idx").on(table.visitorHash, table.occurredAt),
    mediaTimeIndex: index("analytics_event_media_time_idx").on(table.mediaId, table.occurredAt),
  }),
)

export type Movie = typeof movies.$inferSelect
export type Category = typeof categories.$inferSelect
export type Season = typeof seasons.$inferSelect
export type Episode = typeof episodes.$inferSelect
