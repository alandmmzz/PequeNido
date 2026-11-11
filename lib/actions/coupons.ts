"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { coupons, products, type CouponRow } from "@/lib/db/schema"
import { getEffectivePrice } from "@/lib/products"
import { calculateDiscountedTotals, isCouponValidAt } from "@/lib/coupon-calculations"
import { isAdminEmail, SESSION_COOKIE, verifyToken } from "@/lib/auth"

const codePattern = /^[A-Z0-9][A-Z0-9_-]{2,31}$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function requireAdmin() {
  const cookieStore = await cookies()
  const email = await verifyToken(cookieStore.get(SESSION_COOKIE)?.value)
  if (!email || !isAdminEmail(email)) throw new Error("No autorizado")
}

export async function getCoupons(): Promise<CouponRow[]> {
  await requireAdmin()
  return db.select().from(coupons).orderBy(desc(coupons.createdAt))
}

export async function createCoupon(input: {
  code: string
  discountPercent: number
  startsAt: string | null
  expiresAt: string | null
}): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin()

  const code = typeof input?.code === "string" ? input.code.trim().toUpperCase() : ""
  if (!codePattern.test(code)) {
    return { success: false, error: "Usá entre 3 y 32 caracteres: letras, números, guion o guion bajo." }
  }

  const discountPercent = Number(input?.discountPercent)
  if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 99) {
    return { success: false, error: "El descuento debe ser un porcentaje entero entre 1 y 99." }
  }

  const startsAtValue = typeof input?.startsAt === "string" ? input.startsAt : null
  const expiresAtValue = typeof input?.expiresAt === "string" ? input.expiresAt : null
  const startsAt = startsAtValue ? new Date(startsAtValue) : null
  const expiresAt = expiresAtValue ? new Date(expiresAtValue) : null
  if ((startsAt && Number.isNaN(startsAt.getTime())) || (expiresAt && Number.isNaN(expiresAt.getTime()))) {
    return { success: false, error: "Revisá las fechas de vigencia." }
  }
  if (expiresAt && expiresAt.getTime() <= Date.now()) {
    return { success: false, error: "La fecha de vencimiento debe ser futura." }
  }
  if (startsAt && expiresAt && expiresAt.getTime() <= startsAt.getTime()) {
    return { success: false, error: "El vencimiento debe ser posterior al inicio de vigencia." }
  }

  try {
    await db.insert(coupons).values({ code, discountPercent, startsAt, expiresAt })
    revalidatePath("/admin/cupones")
    return { success: true }
  } catch (error) {
    if ((error as { code?: string })?.code === "23505") {
      return { success: false, error: "Ya existe un cupón con ese código." }
    }
    console.error("Error creando cupón:", error)
    return { success: false, error: "No se pudo guardar el cupón. Intentá de nuevo." }
  }
}

export async function setCouponActive(id: string, isActive: boolean) {
  await requireAdmin()
  if (!uuidPattern.test(id) || typeof isActive !== "boolean") {
    return { success: false as const, error: "Cupón inválido." }
  }

  const [updated] = await db
    .update(coupons)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(coupons.id, id))
    .returning({ id: coupons.id })

  if (!updated) return { success: false as const, error: "No encontramos ese cupón." }
  revalidatePath("/admin/cupones")
  return { success: true as const }
}

export async function validateCoupon(
  rawCode: string,
  rawItems: Array<{ id: string; quantity: number }>,
): Promise<
  | { success: true; code: string; discountPercent: number; subtotal: number; discountedSubtotal: number; discountAmount: number }
  | { success: false; error: string }
> {
  const code = typeof rawCode === "string" ? rawCode.trim().toUpperCase() : ""
  if (!codePattern.test(code) || !Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100) {
    return { success: false, error: "El código no es válido o ya no está vigente." }
  }

  const items = rawItems.map((item) => ({
    id: typeof item?.id === "string" ? item.id : "",
    quantity: Math.min(Math.max(1, Math.floor(Number(item?.quantity)) || 1), 50),
  }))
  if (items.some((item) => !uuidPattern.test(item.id))) {
    return { success: false, error: "No pudimos validar los productos del carrito." }
  }

  try {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1)
    if (!coupon || !isCouponValidAt(coupon)) {
      return { success: false, error: "El código no es válido o ya no está vigente." }
    }

    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, [...new Set(items.map((item) => item.id))]))
    const productById = new Map(dbProducts.map((product) => [product.id, product]))
    if (items.some((item) => !productById.has(item.id))) {
      return { success: false, error: "No pudimos validar los productos del carrito." }
    }

    const pricedItems = items.map((item) => ({
      price: getEffectivePrice(productById.get(item.id)!),
      quantity: item.quantity,
    }))
    const quote = calculateDiscountedTotals(pricedItems, coupon.discountPercent)

    return {
      success: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      subtotal: quote.subtotal,
      discountedSubtotal: quote.discountedSubtotal,
      discountAmount: quote.discountAmount,
    }
  } catch (error) {
    console.error("Error validando cupón:", error)
    return { success: false, error: "No se pudo validar el cupón. Intentá de nuevo." }
  }
}
