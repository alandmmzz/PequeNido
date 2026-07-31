import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { getOrder } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/products"
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount"
import { BANK_NAME, BANK_ACCOUNT_HOLDER, BANK_ACCOUNT_NUMBER } from "@/lib/bank-info"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string; payment_id?: string }>
}) {
  const { external_reference } = await searchParams
  const data = external_reference ? await getOrder(external_reference) : null

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        {data?.order.paymentMethod === "transferencia" ? "¡Pedido registrado!" : "¡Pago aprobado!"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {data?.order.paymentMethod === "transferencia" ? (
          <>
            Gracias {data.order.customerName} por tu compra. Tu pedido quedó pendiente hasta que
            recibamos la transferencia; te confirmamos por email apenas nos llegue.
          </>
        ) : (
          <>Gracias{data ? ` ${data.order.customerName}` : ""} por tu compra. Te enviamos la confirmación por email.</>
        )}
      </p>

      {data?.order.paymentMethod === "transferencia" && (
        <div className="w-full rounded-2xl border border-border/70 bg-secondary/30 p-5 text-left text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Datos para transferir</p>
          <p className="mt-1">Banco: {BANK_NAME}</p>
          <p>Titular: {BANK_ACCOUNT_HOLDER}</p>
          <p>Cuenta: {BANK_ACCOUNT_NUMBER}</p>
        </div>
      )}

      {data && (
        <div className="mt-4 w-full rounded-2xl border border-border/70 bg-card p-5 text-left">
          <p className="text-xs text-muted-foreground">Pedido</p>
          <p className="font-mono text-sm text-foreground">{data.order.id}</p>
          <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
            <span className="text-sm text-muted-foreground">Total pagado</span>
            <span className="font-serif text-lg font-semibold text-foreground">{formatPrice(data.order.total)}</span>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
