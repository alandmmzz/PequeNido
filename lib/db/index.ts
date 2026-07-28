import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

config({ path: ".env.local" })

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL en las variables de entorno (revisá .env.local)")
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })
