import { pgTable, text, integer, doublePrecision, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Una sola tabla para juguetes y libros, distinguidos por "kind".
 * Las columnas que no aplican a un tipo (ej. "pages" en un juguete)
 * quedan en null. Esto mantiene el admin simple: un solo formulario
 * con campos que se muestran/ocultan según el "kind" elegido.
 */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(), // reemplaza el "id" legible que usabas en lib/products.ts (ej. "sonajero-madera")
  kind: text("kind", { enum: ["toy", "book"] }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),

  // Campos específicos de juguete
  age: text("age"), // "0-12m" | "12-24m" | "2-4a" | "4a+"
  material: text("material"),

  // Campos específicos de libro
  format: text("format"),
  pages: integer("pages"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type ProductRow = typeof products.$inferSelect
export type NewProductRow = typeof products.$inferInsert
