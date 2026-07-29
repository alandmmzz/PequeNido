import Link from "next/link"
import { Clock } from "lucide-react"

export default function CheckoutPendingPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Clock className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl font-semibold text-foreground">Pago pendiente</h1>
      <p className="text-sm text-muted-foreground">
        Tu pago está siendo procesado (por ejemplo, si elegiste pagar en efectivo). Te avisamos por email en cuanto
        se confirme.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
