import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pests table - stores all invasive species information
 */
export const pests = mysqlTable("pests", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  latin: varchar("latin", { length: 255 }),
  alsoKnownAs: text("alsoKnownAs"),
  keywords: text("keywords"),
  pestGroups: text("pestGroups"), // Comma-separated values
  pestTypes: text("pestTypes"), // Comma-separated values
  managementApproaches: text("managementApproaches"), // Comma-separated values
  alert: boolean("alert").default(false).notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  visible: boolean("visible").default(true).notNull(),
  featuredImage: varchar("featuredImage", { length: 500 }),
  link: text("link"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pest = typeof pests.$inferSelect;
export type InsertPest = typeof pests.$inferInsert;

/**
 * Mauri Impact Submissions table - stores community observations
 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  pestId: int("pestId").notNull(), // Foreign key to pests table
  pestTitle: varchar("pestTitle", { length: 255 }).notNull(), // Denormalized for easier display
  
  // Submission details
  location: varchar("location", { length: 500 }).notNull(),
  observationDate: timestamp("observationDate").notNull(),
  notes: text("notes"),
  
  // Mauri impact assessments
  impactWhenua: mysqlEnum("impactWhenua", ["none", "low", "medium", "high", "severe"]),
  impactWai: mysqlEnum("impactWai", ["none", "low", "medium", "high", "severe"]),
  impactTangata: mysqlEnum("impactTangata", ["none", "low", "medium", "high", "severe"]),
  
  // Photo storage (S3 URLs, comma-separated if multiple)
  photoUrls: text("photoUrls"),
  photoKeys: text("photoKeys"), // S3 keys for management
  
  // Submitter info (optional - can be anonymous)
  submitterName: varchar("submitterName", { length: 255 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  
  // Metadata
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;
