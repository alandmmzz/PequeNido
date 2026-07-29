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

/**
 * Un pedido generado desde la cesta al iniciar el pago.
 * Se crea con status "pending" antes de redirigir a Mercado Pago,
 * y el webhook lo actualiza cuando llega la notificación de pago.
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  notes: text("notes"),

  total: doublePrecision("total").notNull(),
  status: text("status", { enum: ["pending", "paid", "rejected", "cancelled"] })
    .notNull()
    .default("pending"),

  // Referencias a Mercado Pago para poder rastrear el pago
  mpPreferenceId: text("mp_preference_id"),
  mpPaymentId: text("mp_payment_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/**
 * Ítems de un pedido. Guardamos nombre/precio/imagen "congelados" en el
 * momento de la compra (no solo el productId) para que el pedido no cambie
 * si más adelante se edita o borra el producto en el catálogo.
 */
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),

  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"),
})

export type OrderRow = typeof orders.$inferSelect
export type NewOrderRow = typeof orders.$inferInsert
export type OrderItemRow = typeof orderItems.$inferSelect
export type NewOrderItemRow = typeof orderItems.$inferInsert
