import type { CouponRow } from "@/lib/db/schema"

export type DiscountableItem = { price: number; quantity: number }

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calculateDiscountedTotals<T extends DiscountableItem>(items: T[], discountPercent: number) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const discountedItems = items.map((item) => ({
    ...item,
    discountedPrice: roundMoney((item.price * (100 - discountPercent)) / 100),
  }))
  const discountedSubtotal = roundMoney(
    discountedItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0),
  )

  return {
    items: discountedItems,
    subtotal,
    discountedSubtotal,
    discountAmount: roundMoney(Math.max(0, subtotal - discountedSubtotal)),
  }
}

export function isCouponValidAt(coupon: Pick<CouponRow, "isActive" | "startsAt" | "expiresAt">, now = new Date()) {
  return (
    coupon.isActive &&
    (!coupon.startsAt || coupon.startsAt.getTime() <= now.getTime()) &&
    (!coupon.expiresAt || coupon.expiresAt.getTime() > now.getTime())
  )
}
