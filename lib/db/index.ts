import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Use Neon's pooled connection through node-postgres. The serverless HTTP
// driver can fail in the preview runtime when its fetch transport is blocked.
const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NEON_POSTGRES_URL ??
  process.env.NEON_DATABASE_URL ??
  // Keep module evaluation safe during static route collection. Runtime
  // requests in the preview/deployment receive the connected Neon variables.
  "postgresql://build:build@localhost:5432/build"

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 20_000,
  connectionTimeoutMillis: 10_000,
  ssl: { rejectUnauthorized: false },
})

export const db = drizzle(pool, { schema })
