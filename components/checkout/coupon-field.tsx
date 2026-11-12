"use client"

import { useEffect, useState, type FormEvent } from "react"
import { validateCoupon } from "@/lib/actions/coupons"

export type CouponPreview = {
  code: string
  discountPercent: number
  subtotal: number
  discountedSubtotal: number
  discountAmount: number
}

type CouponItem = { id: string; quantity: number }

export function CouponField({
  items,
  itemsKey,
  onCouponChange,
}: {
  items: CouponItem[]
  itemsKey: string
  onCouponChange: (coupon: CouponPreview | null) => void
}) {
  const [code, setCode] = useState("")
  const [coupon, setCoupon] = useState<CouponPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setCode("")
    setCoupon(null)
    setError(null)
    onCouponChange(null)
  }, [itemsKey, onCouponChange])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nativeEvent = event.nativeEvent as SubmitEvent & { isComposing?: boolean; keyCode?: number }
    if (nativeEvent.isComposing || nativeEvent.keyCode === 229) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    if (pending) return

    setPending(true)
    setError(null)
    const result = await validateCoupon(code, items)
    setPending(false)

    if (!result.success) {
      setCoupon(null)
      onCouponChange(null)
      setError(result.error)
      return
    }

    const preview = {
      code: result.code,
      discountPercent: result.discountPercent,
      subtotal: result.subtotal,
      discountedSubtotal: result.discountedSubtotal,
      discountAmount: result.discountAmount,
    }
    setCoupon(preview)
    onCouponChange(preview)
  }

  function clearCoupon() {
    setCode("")
    setCoupon(null)
    setError(null)
    onCouponChange(null)
  }

  return (
    <div className="mt-5 border-t border-border/70 pt-4">
      <label htmlFor="coupon-code-input" className="text-sm font-medium text-foreground">
        ¿Tenés un cupón de descuento?
      </label>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          id="coupon-code-input"
          name="couponCode"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase())
            if (coupon) {
              setCoupon(null)
              onCouponChange(null)
            }
            setError(null)
          }}
          placeholder="Ingresá tu cupón"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby="coupon-feedback"
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-destructive"
        />
        {coupon ? (
          <button
            type="button"
            onClick={clearCoupon}
            className="shrink-0 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50"
          >
            Quitar
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending || !code.trim()}
            className="shrink-0 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Validando…" : "Aplicar"}
          </button>
        )}
      </form>
      <p id="coupon-feedback" role="status" aria-live="polite" className={`mt-1.5 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
        {error ?? (coupon ? `${coupon.code} aplicado: ${coupon.discountPercent}% de descuento.` : "")}
      </p>
    </div>
  )
}
