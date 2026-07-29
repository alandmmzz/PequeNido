"use server"

import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { orderItems, orders, type OrderRow } from "@/lib/db/schema"
import { mpPreference } from "@/lib/mercadopago"

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
  phone?: string
  address: string
  city: string
  postalCode: string
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
    return { error: "Tu cesta está vacía." }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  let order: typeof orders.$inferSelect

  try {
    ;[order] = await db
      .insert(orders)
      .values({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || null,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        notes: customer.notes || null,
        total,
        status: "pending",
      })
      .returning()

    await db.insert(orderItems).values(
      items.map((item) => ({
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
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: currencyId,
          picture_url: item.image?.startsWith("http") ? item.image : undefined,
        })),
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

    // En producción usá preference.init_point. Con credenciales de prueba
    // (TEST-...) Mercado Pago recomienda usar sandbox_init_point.
    const isTestCredential = (process.env.MERCADOPAGO_ACCESS_TOKEN ?? "").startsWith("TEST-")
    const url = (isTestCredential ? preference.sandbox_init_point : preference.init_point) ?? preference.init_point

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
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id))
  revalidatePath("/admin/pedidos")
}