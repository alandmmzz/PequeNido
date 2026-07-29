import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <XCircle className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl font-semibold text-foreground">No pudimos procesar el pago</h1>
      <p className="text-sm text-muted-foreground">
        El pago fue rechazado o cancelado. Tu cesta sigue guardada, podés intentarlo de nuevo o probar con otro
        medio de pago.
      </p>
      <Link
        href="/checkout"
        className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Volver a intentar
      </Link>
    </div>
  )
}
