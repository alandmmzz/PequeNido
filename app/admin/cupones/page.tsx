import { getCoupons } from "@/lib/actions/coupons"
import { CouponManager } from "@/components/admin/coupon-manager"

export const dynamic = "force-dynamic"

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-7">
        <p className="text-sm font-medium text-primary">Ventas</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-foreground sm:text-3xl">Cupones de descuento</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Creá códigos promocionales, definí el porcentaje y el período de vigencia. Cada compra vuelve a validar el cupón en el servidor.
        </p>
      </div>
      <CouponManager coupons={coupons} now={new Date().toISOString()} />
    </main>
  )
}
