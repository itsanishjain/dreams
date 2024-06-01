import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  primaryKey,
  timestamp,
  varchar,
  pgEnum,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
// import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from "drizzle-orm";

export const invoiceTable = pgTable("invoice_table", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  customerId: text("customer_id"),
  name: text("name"),
  email: text("email"),
  imageUrl: text("image_url"),
  date: text("date"),
  amount: numeric("amount"),
  status: text("status"),
});

export const statusEnum = pgEnum("status", ["waiting", "serving", "served"]);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }),
  phone: varchar("phone", { length: 20 }),
  estimateTime: varchar("estimate_time", { length: 256 }),
  actualTime: varchar("actual_time", { length: 256 }),
  totalInvoices: integer("total_invoices"),
  totalPending: integer("total_pending"),
  totalPaid: integer("total_paid"),
  status: statusEnum("status").default("waiting"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // Stripe
  stripeCustomerId: text("stripe_customer_id"),
  billingAddress: jsonb("billing_address"),
  paymentMethod: jsonb("payment_method"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Create a one to many relationship between users and customers
// user are the business owners
// customers are the customers of the business

export const userRelations = relations(users, ({ many }) => ({
  customers: many(customers),
}));

export const customerRelations = relations(customers, ({ one }) => ({
  users: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

// Stripe

/**
 * PRODUCTS
 * Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
 */

export const products = pgTable("product", {
  id: text("id").primaryKey(),
  active: boolean("active").default(false).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  metadata: jsonb("metadata"),
});

/**
 * PRICES
 * Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
 */

export const priceTypes = pgEnum("price_type", ["recurring", "one_time"]);

export const priceIntervals = pgEnum("price_interval", [
  "day",
  "week",
  "month",
  "year",
]);

export const prices = pgTable("price", {
  id: text("id").primaryKey(),
  prodcuctId: text("product_id").references(() => products.id),
  description: text("description"),
  active: boolean("active").default(false).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  unitAmount: integer("unit_amount"),
  metadata: jsonb("metadata"),
  type: priceTypes("type").default("recurring"),
  interval: priceIntervals("interval").default("month"),
  intervalCount: integer("interval_count").default(1),
  trialPeriodDays: integer("trial_period_days"),
});

/**
 * SUBSCRIPTIONS
 * Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
 */

export const subscriptionStatuses = pgEnum("subscription_status", [
  "trialing",
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "unpaid",
  "paused",
]);

export const subscriptions = pgTable("subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: subscriptionStatuses("status").default("trialing"),
  metadata: jsonb("metadata"),
  priceId: text("price_id").references(() => prices.id),
  quantity: integer("quantity").default(1),
  // If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  // Time at which the subscription was created.
  created: timestamp("created", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  // Start of the current period that the subscription has been invoiced for.
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),

  // If the subscription has ended, the timestamp of the date the subscription ended.
  endAt: timestamp("end_at", { mode: "date", withTimezone: true }).defaultNow(),
  // A date in the future at which the subscription will automatically get canceled.
  cancelAt: timestamp("cancel_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  // If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceledAt: timestamp("canceled_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  //If the subscription has a trial, the beginning of that trial.
  trialStart: timestamp("trial_start", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  // If the subscription has a trial, the end of that trial.
  trialEnd: timestamp("trial_end", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),

  // SMS Credits
  credits: numeric("credits").default("0"),
});

// In stripe Prouducts can have many price
// $10 monttly while $100 annually
export const priceRelations = relations(prices, ({ many, one }) => ({
  subscriptions: many(subscriptions),
  products: one(products, {
    fields: [prices.prodcuctId],
    references: [products.id],
  }),
}));

export const productRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  prices: one(prices, {
    fields: [subscriptions.priceId],
    references: [prices.id],
  }),
}));

// Schema for templates

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  metadata: jsonb("metadata"),
  metadataText: text("metadata_text"),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export type Price = typeof prices.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Subscription = typeof subscriptions.$inferInsert;
