"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, CreditCard, Landmark, MapPin, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/products"
import { createOrderAndPreference } from "@/lib/actions/orders"
import { BANK_NAME, BANK_ACCOUNT_HOLDER, BANK_ACCOUNT_NUMBER } from "@/lib/bank-info"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "transferencia">("mercadopago")

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)

    const result = await createOrderAndPreference(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string,
        shippingZone: formData.get("shippingZone") as "montevideo" | "interior",
        paymentMethod: formData.get("paymentMethod") as "mercadopago" | "transferencia",
        notes: (formData.get("notes") as string) || undefined,
      },
    )

    if ("url" in result) {
      window.location.href = result.url
      return
    }

    setLoading(false)
    setError(result.error)
    if (result.orderId) {
      // El pedido quedó guardado como "pending" aunque no se haya podido
      // generar el link de pago (ej. faltan credenciales de Mercado Pago).
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBag className="size-7" aria-hidden="true" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Tu cesta está vacía</h1>
        <p className="text-sm text-muted-foreground">Añadí algún producto antes de pasar por caja.</p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Volver a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-16">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">Finalizar compra</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Completá tus datos de envío.{" "}
          {paymentMethod === "mercadopago"
            ? "En el siguiente paso vas a pagar de forma segura con Mercado Pago."
            : "Confirmá el pedido y te mostramos los datos para hacer la transferencia."}
        </p>

        <form action={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre y apellido</label>
              <input
                name="name"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Teléfono (opcional)</label>
            <input name="phone" className="w-full rounded-md border border-input bg-background px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Dirección de envío</label>
            <input
              name="address"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Ciudad</label>
              <input
                name="city"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Código postal</label>
              <input
                name="postalCode"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Notas para la entrega (opcional)</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Conocé nuestra{" "}
            <Link href="/envios-y-devoluciones" target="_blank" className="font-medium text-foreground hover:underline">
              política de envíos y devoluciones
            </Link>
            .
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Zona de envío</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "montevideo", label: "Montevideo y área metropolitana", hint: "Cadetería privada", Icon: Building2 },
                { value: "interior", label: "Interior del país", hint: "DAC – Agencia Central, sin costo", Icon: MapPin },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-2.5 rounded-md border border-input bg-background px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-accent/20"
                >
                  <input
                    type="radio"
                    name="shippingZone"
                    value={option.value}
                    defaultChecked={option.value === "montevideo"}
                    className="mt-0.5 accent-primary"
                  />
                  <option.Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Método de pago</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "mercadopago", label: "Mercado Pago", hint: "Tarjeta, dinero en cuenta, etc.", Icon: CreditCard },
                { value: "transferencia", label: "Transferencia bancaria", hint: "Confirmamos el pedido al recibirla", Icon: Landmark },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-2.5 rounded-md border border-input bg-background px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-accent/20"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value as "mercadopago" | "transferencia")}
                    className="mt-0.5 accent-primary"
                  />
                  <option.Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === "transferencia" && (
              <div className="mt-3 rounded-md border border-border/70 bg-secondary/30 p-3.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Datos para transferir</p>
                <p className="mt-1">Banco: {BANK_NAME}</p>
                <p>Titular: {BANK_ACCOUNT_HOLDER}</p>
                <p>Cuenta: {BANK_ACCOUNT_NUMBER}</p>
                <p className="mt-2">
                  Al confirmar tu pedido queda como pendiente. Una vez que hagas la transferencia y nos
                  llegue, te confirmamos por email.
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Confirmando pedido…"
              : paymentMethod === "mercadopago"
                ? "Pagar con Mercado Pago"
                : "Confirmar pedido"}
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-2xl border border-border/70 bg-card p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">Tu pedido</h2>
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/50">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-sm font-medium leading-snug text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
              </div>
              <span className="shrink-0 self-center text-sm font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-serif text-lg font-semibold text-foreground">{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  )
}
