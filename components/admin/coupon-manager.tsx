"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { CouponRow } from "@/lib/db/schema"
import { createCoupon, setCouponActive } from "@/lib/actions/coupons"

function localDateBoundary(value: string, endOfDay: boolean) {
  if (!value) return null
  const time = endOfDay ? "23:59:59" : "00:00:00"
  return new Date(`${value}T${time}-03:00`).toISOString()
}

function couponState(coupon: CouponRow, now: number) {
  if (!coupon.isActive) return "Pausado"
  if (coupon.startsAt && coupon.startsAt.getTime() > now) return "Programado"
  if (coupon.expiresAt && coupon.expiresAt.getTime() <= now) return "Vencido"
  return "Activo"
}

function formatDate(date: Date | null) {
  if (!date) return "Sin límite"
  return new Intl.DateTimeFormat("es-UY", {
    dateStyle: "medium",
    timeZone: "America/Montevideo",
  }).format(date)
}

export function CouponManager({ coupons, now }: { coupons: CouponRow[]; now: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageIsError, setMessageIsError] = useState(false)
  const currentTime = new Date(now).getTime()

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    const nativeEvent = event.nativeEvent as SubmitEvent & { isComposing?: boolean; keyCode?: number }
    if (nativeEvent.isComposing || nativeEvent.keyCode === 229) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    setPending(true)
    setMessage(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const result = await createCoupon({
      code: String(formData.get("code") ?? ""),
      discountPercent: Number(formData.get("discountPercent")),
      startsAt: localDateBoundary(String(formData.get("startsAt") ?? ""), false),
      expiresAt: localDateBoundary(String(formData.get("expiresAt") ?? ""), true),
    })

    setPending(false)
    setMessageIsError(!result.success)
    setMessage(result.success ? "Cupón creado." : result.error)
    if (result.success) {
      form.reset()
      router.refresh()
    }
  }

  async function handleToggle(coupon: CouponRow) {
    setPending(true)
    setMessage(null)
    const result = await setCouponActive(coupon.id, !coupon.isActive)
    setPending(false)
    setMessageIsError(!result.success)
    setMessage(result.success ? `Cupón ${coupon.isActive ? "pausado" : "activado"}.` : result.error)
    if (result.success) router.refresh()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="h-fit rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">Crear cupón</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          El descuento se aplica a los productos, no al costo de envío. Las fechas se interpretan en hora de Uruguay.
        </p>

        <form onSubmit={handleCreate} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="coupon-code" className="mb-1 block text-sm font-medium text-foreground">Código</label>
            <input
              id="coupon-code"
              name="code"
              required
              minLength={3}
              maxLength={32}
              pattern="[A-Za-z0-9][A-Za-z0-9_-]{2,31}"
              placeholder="BIENVENIDA15"
              autoCapitalize="characters"
              autoComplete="off"
              className="w-full rounded-md border border-input bg-background px-3 py-2 uppercase"
            />
          </div>

          <div>
            <label htmlFor="coupon-percent" className="mb-1 block text-sm font-medium text-foreground">Descuento (%)</label>
            <input
              id="coupon-percent"
              name="discountPercent"
              type="number"
              min={1}
              max={99}
              step={1}
              required
              defaultValue={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Ingresá un número entero entre 1 y 99.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="coupon-start" className="mb-1 block text-sm font-medium text-foreground">Válido desde (opcional)</label>
              <input
                id="coupon-start"
                name="startsAt"
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="coupon-end" className="mb-1 block text-sm font-medium text-foreground">Vence el (opcional)</label>
              <input
                id="coupon-end"
                name="expiresAt"
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
          <p className="-mt-2 text-xs leading-relaxed text-muted-foreground">
            Si no indicás vencimiento, el cupón queda vigente hasta que lo pauses.
          </p>

          {message && (
            <p role="status" aria-live="polite" className={`text-sm ${messageIsError ? "text-destructive" : "text-foreground"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Crear cupón"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">Cupones creados</h2>
            <p className="mt-1 text-sm text-muted-foreground">{coupons.length} en total</p>
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Todavía no creaste cupones</p>
            <p className="mt-1 text-sm text-muted-foreground">Cuando crees uno, aparecerá aquí para que puedas pausarlo o reactivarlo.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {coupons.map((coupon) => {
              const state = couponState(coupon, currentTime)
              return (
                <li key={coupon.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-base font-semibold tracking-wide text-foreground">{coupon.code}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{coupon.discountPercent}% de descuento</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${state === "Activo" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                      {state}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {coupon.startsAt ? `Desde ${formatDate(coupon.startsAt)}` : "Sin fecha de inicio"}
                    {" · "}
                    {coupon.expiresAt ? `Hasta ${formatDate(coupon.expiresAt)}` : "Sin vencimiento"}
                  </p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleToggle(coupon)}
                    className="mt-3 rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/50 disabled:opacity-50"
                  >
                    {coupon.isActive ? "Pausar cupón" : "Reactivar cupón"}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

    </div>
  )
}
