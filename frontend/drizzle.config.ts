import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL || "postgres://localhost:5432/drizzle",
  },
  verbose: true,
  strict: true,
} satisfies Config;
