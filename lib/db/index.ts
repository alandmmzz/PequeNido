import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Next.js loads DATABASE_URL from the connected Neon integration at runtime.
// The build worker may collect route data without project env vars, so avoid
// throwing during module evaluation; Neon will use the real URL at runtime.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build"
const sql = neon(databaseUrl)

export const db = drizzle(sql, { schema })
