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
  // Precio promocional opcional. Si está cargado, se muestra como el precio
  // real del producto (tachando el precio común) y dispara el badge "Promo".
  promoPrice: doublePrecision("promo_price"),
  image: text("image").notNull(), // imagen principal: la que se usa en thumbnails/tarjetas
  additionalImages: text("additional_images").array(), // imágenes extra para la galería de la ficha
  video: text("video"), // video opcional del producto; si existe, se muestra primero en la ficha

  // Campos específicos de juguete
  ages: text("ages").array(), // varias franjas posibles, ej. ["0-12m", "12-24m"]
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
 * Un pedido generado desde la carrito al iniciar el pago.
 * Se crea con status "pending" antes de redirigir a Mercado Pago,
 * y el webhook lo actualiza cuando llega la notificación de pago.
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  // Obligatorio: así el negocio se puede comunicar con quien compra.
  customerPhone: text("customer_phone").notNull(),
  // Nulos cuando es retiro en el pick up center (no hace falta dirección).
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  // "retiro" (pick up center en Goes, sin costo), "montevideo" (envío
  // coordinado, costo fijo) o "interior" (DAC, el cadete cobra al entregar).
  shippingZone: text("shipping_zone", { enum: ["retiro", "montevideo", "interior"] })
    .notNull()
    .default("retiro"),
  // Costo fijo del envío que cobra Peque Nido (0 para retiro e interior;
  // UYU $200 para Montevideo/área metropolitana). No incluye lo que el
  // cadete cobra aparte al entregar en el caso del interior.
  shippingCost: doublePrecision("shipping_cost").notNull().default(0),
  notes: text("notes"),

  // Mercado Pago (con link de pago) o transferencia bancaria (el cliente
  // transfiere a mano y confirmamos el pedido después).
  paymentMethod: text("payment_method", { enum: ["mercadopago", "transferencia"] })
    .notNull()
    .default("mercadopago"),

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
  productId: text("product_id"),

  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"),
})

export type OrderRow = typeof orders.$inferSelect
export type NewOrderRow = typeof orders.$inferInsert
export type OrderItemRow = typeof orderItems.$inferSelect
export type NewOrderItemRow = typeof orderItems.$inferInsert
