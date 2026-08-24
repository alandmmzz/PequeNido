"use server"

import { and, desc, eq, inArray, sql, type SQL } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { orderItems, orders, products, type OrderRow } from "@/lib/db/schema"
import { mpPreference } from "@/lib/mercadopago"
import { sendNewOrderNotificationToOwner, sendOrderConfirmationEmail } from "@/lib/order-email"
import { getEffectivePrice } from "@/lib/products"
import { SHIPPING_COST, type ShippingZone } from "@/lib/shipping"

export type CheckoutItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export type CheckoutCustomer = {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  postalCode?: string
  shippingZone: ShippingZone
  paymentMethod: "mercadopago" | "transferencia"
  notes?: string
}

type CreateOrderResult = { url: string; orderId: string } | { error: string; orderId?: string }

/**
 * 1. Guarda el pedido y sus ítems en la base (status "pending").
 * 2. Crea la preferencia de Checkout Pro en Mercado Pago.
 * 3. Devuelve la URL (init_point) a la que hay que redirigir al comprador.
 */
export async function createOrderAndPreference(
  items: CheckoutItem[],
  customer: CheckoutCustomer,
): Promise<CreateOrderResult> {
  if (!items.length) {
    return { error: "Tu carrito está vacía." }
  }

  if (!customer.phone?.trim()) {
    return { error: "El teléfono es obligatorio." }
  }

  if (customer.shippingZone !== "retiro" && (!customer.address?.trim() || !customer.city?.trim())) {
    return { error: "Faltan los datos de envío." }
  }

  // Nunca confiamos en el precio, el nombre ni la imagen que manda el
  // navegador: alguien podría editar esos valores en el carrito antes de
  // pagar. Volvemos a buscar cada producto en la base y reconstruimos el
  // carrito con los datos reales — así lo que se guarda y lo que se le
  // cobra a Mercado Pago siempre sale del catálogo, no del cliente.
  const dbProducts = await db
    .selectDistinct()
    .from(products)
    .where(
      inArray(
        products.id,
        items.map((item) => item.id),
      ),
    )
  const productById = new Map(dbProducts.map((p) => [p.id, p]))

  const verifiedItems: CheckoutItem[] = []
  for (const item of items) {
    const product = productById.get(item.id)
    if (!product) {
      return { error: "Uno de los productos de tu carrito ya no está disponible. Actualizá la página e intentá de nuevo." }
    }
    // Límite sano de cantidad por ítem, para evitar valores absurdos.
    const quantity = Math.min(Math.max(1, Math.floor(item.quantity) || 1), 50)
    verifiedItems.push({
      id: product.id,
      name: product.name,
      price: getEffectivePrice(product),
      image: product.image,
      quantity,
    })
  }

  const itemsTotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = SHIPPING_COST[customer.shippingZone]
  const total = itemsTotal + shippingCost

  let order: typeof orders.$inferSelect

  try {
    ;[order] = await db
      .insert(orders)
      .values({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        address: customer.shippingZone === "retiro" ? null : customer.address || null,
        city: customer.shippingZone === "retiro" ? null : customer.city || null,
        postalCode: customer.shippingZone === "retiro" ? null : customer.postalCode || null,
        shippingZone: customer.shippingZone,
        shippingCost,
        paymentMethod: customer.paymentMethod,
        notes: customer.notes || null,
        total,
        status: "pending",
      })
      .returning()

    await db.insert(orderItems).values(
      verifiedItems.map((item) => ({
        orderId: order.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    )
  } catch (err) {
    console.error("Error guardando el pedido en la base:", err)
    return { error: "No se pudo guardar tu pedido. Probá de nuevo en unos segundos." }
  }

  try {
    await sendNewOrderNotificationToOwner(order, verifiedItems)
  } catch (err) {
    console.error("Error avisándole al dueño de la tienda:", err)
  }

  // Transferencia bancaria: no hay pasarela de pago, el pedido queda
  // "pending" y mandamos directo a la pantalla de confirmación, donde se
  // muestran los datos de la cuenta para transferir.
  if (customer.paymentMethod === "transferencia") {
    try {
      await sendOrderConfirmationEmail(order, verifiedItems)
    } catch (err) {
      // No rompemos el checkout si falla el mail: el pedido ya quedó guardado.
      console.error("Error mandando el mail de confirmación:", err)
    }

    const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "")
    return { url: `${baseUrl}/checkout/success?external_reference=${order.id}`, orderId: order.id }
  }

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return {
      error:
        "El pedido quedó guardado como pendiente, pero todavía falta configurar MERCADOPAGO_ACCESS_TOKEN en .env.local para poder generar el link de pago.",
      orderId: order.id,
    }
  }

  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "")
  // Todos los precios del catálogo están en pesos uruguayos (UYU).
  const currencyId = process.env.MERCADOPAGO_CURRENCY ?? "UYU"

  try {
    const preference = await mpPreference.create({
      body: {
        items: [
          ...verifiedItems.map((item) => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: currencyId,
            picture_url: item.image?.startsWith("http") ? item.image : undefined,
          })),
          ...(shippingCost > 0
            ? [
                {
                  id: "envio",
                  title: "Envío",
                  quantity: 1,
                  unit_price: shippingCost,
                  currency_id: currencyId,
                },
              ]
            : []),
        ],
        payer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone ? { number: customer.phone } : undefined,
          address: {
            street_name: customer.address,
            zip_code: customer.postalCode,
          },
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
      },
    })

    await db
      .update(orders)
      .set({ mpPreferenceId: preference.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id))

    // Mercado Pago usa "APP_USR-..." tanto para credenciales de prueba como
    // reales ahora (antes las de prueba empezaban con "TEST-", pero ya no es
    // así), así que no se puede distinguir mirando el token. Por eso lo
    // controlamos con MERCADOPAGO_SANDBOX: "true" mientras estás probando con
    // credenciales de prueba, y sacala (o ponela en "false") cuando pases a
    // cobrar de verdad con las credenciales de producción.
    const isSandbox = (process.env.MERCADOPAGO_SANDBOX ?? "false").toLowerCase() === "true"
    const url = (isSandbox ? preference.sandbox_init_point : preference.init_point) ?? preference.init_point

    if (!url) {
      return { error: "Mercado Pago no devolvió un link de pago. Revisá el access token.", orderId: order.id }
    }

    return { url, orderId: order.id }
  } catch (err) {
    console.error("Error creando preferencia de Mercado Pago:", err)
    return {
      error: "No se pudo generar el link de pago con Mercado Pago. Probá de nuevo en unos segundos.",
      orderId: order.id,
    }
  }
}

export async function getOrder(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id))
  if (!order) return null
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
  return { order, items }
}

/**
 * Pedidos paginados para la lista principal del admin, con búsqueda
 * server-side (cliente, email, teléfono o ID) y filtro opcional por mes
 * ("YYYY-MM"). Trae solo la tanda pedida, no todo el historial.
 */
export async function getOrdersPage({
  offset,
  limit,
  query,
  month,
}: {
  offset: number
  limit: number
  query?: string
  month?: string
}) {
  const conditions: SQL[] = []
  if (query) {
    conditions.push(
      sql`(${orders.customerName} ILIKE ${"%" + query + "%"} OR ${orders.customerEmail} ILIKE ${"%" + query + "%"} OR ${orders.customerPhone} ILIKE ${"%" + query + "%"} OR ${orders.id}::text ILIKE ${"%" + query + "%"})`,
    )
  }
  if (month) {
    conditions.push(sql`to_char(${orders.createdAt}, 'YYYY-MM') = ${month}`)
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [orderRows, [{ count }]] = await Promise.all([
    db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(where),
  ])

  const ids = orderRows.map((o) => o.id)
  const items = ids.length > 0 ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids)) : []
  const itemsByOrder = new Map<string, typeof items>()
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }

  return {
    items: orderRows.map((order) => ({ order, items: itemsByOrder.get(order.id) ?? [] })),
    total: count,
  }
}

/** Meses (YYYY-MM) que tienen al menos un pedido, para el desplegable de filtro. No depende de la paginación. */
export async function getOrderMonths() {
  const monthCol = sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`
  const rows = await db.select({ month: monthCol }).from(orders).groupBy(monthCol).orderBy(desc(monthCol))
  return rows.map((r) => r.month)
}

/** Todos los pedidos de un mes puntual, para el CSV de resumen de ventas. Acotado por mes, no trae todo el historial. */
export async function getOrdersForMonth(month: string) {
  const orderRows = await db
    .select()
    .from(orders)
    .where(sql`to_char(${orders.createdAt}, 'YYYY-MM') = ${month}`)
    .orderBy(desc(orders.createdAt))

  const ids = orderRows.map((o) => o.id)
  const items = ids.length > 0 ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids)) : []
  const itemsByOrder = new Map<string, typeof items>()
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }

  return orderRows.map((order) => ({ order, items: itemsByOrder.get(order.id) ?? [] }))
}

/** Todos los pedidos con sus ítems, del más reciente al más viejo. Para el panel de admin. */
export async function getOrders() {
  const [allOrders, allItems] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
  ])

  const itemsByOrder = new Map<string, typeof allItems>()
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }

  return allOrders.map((order) => ({ order, items: itemsByOrder.get(order.id) ?? [] }))
}

/** Cambia el estado de un pedido a mano desde el panel de admin. */
export async function updateOrderStatus(id: string, status: OrderRow["status"]) {
  const [existing] = await db.select().from(orders).where(eq(orders.id, id))

  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id))

  // Si recién ahora pasa a "pagado" (típicamente al confirmar una
  // transferencia a mano), le avisamos al cliente por mail.
  if (existing && existing.status !== "paid" && status === "paid") {
    try {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
      await sendOrderConfirmationEmail({ ...existing, status }, items)
    } catch (err) {
      console.error("Error mandando el mail de pago confirmado:", err)
    }
  }

  revalidatePath("/admin/pedidos")
}