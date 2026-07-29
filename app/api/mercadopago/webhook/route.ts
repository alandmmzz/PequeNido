import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { mpPayment } from "@/lib/mercadopago"

/**
 * Mercado Pago llama a esta URL cuando cambia el estado de un pago
 * (configurada como `notification_url` al crear la preferencia).
 * Puede mandar los datos como query params (?type=payment&data.id=123)
 * o, en integraciones viejas, como body con {type, data:{id}}.
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const body = await request.json().catch(() => null)

    const type = url.searchParams.get("type") ?? body?.type ?? body?.topic
    const paymentId = url.searchParams.get("data.id") ?? body?.data?.id ?? (type === "payment" ? body?.id : null)

    if (type !== "payment" || !paymentId) {
      // Ignoramos otro tipo de notificaciones (merchant_order, etc.)
      return NextResponse.json({ received: true })
    }

    const payment = await mpPayment.get({ id: paymentId })
    const orderId = payment.external_reference

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    await db
      .update(orders)
      .set({
        status: mapMpStatus(payment.status),
        mpPaymentId: String(payment.id),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Error procesando webhook de Mercado Pago:", err)
    // Devolvemos 200 igual: si respondemos error, Mercado Pago reintenta
    // indefinidamente y no queremos eso por un fallo nuestro puntual.
    return NextResponse.json({ received: true })
  }
}

// Mercado Pago a veces valida el endpoint con un GET.
export async function GET() {
  return NextResponse.json({ ok: true })
}

function mapMpStatus(mpStatus?: string): "pending" | "paid" | "rejected" | "cancelled" {
  switch (mpStatus) {
    case "approved":
      return "paid"
    case "rejected":
      return "rejected"
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "cancelled"
    default:
      return "pending"
  }
}
