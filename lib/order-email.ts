import { sendEmail } from "@/lib/email"
import { formatPrice } from "@/lib/products"
import { BANK_NAME, BANK_ACCOUNT_HOLDER, BANK_ACCOUNT_NUMBER } from "@/lib/bank-info"
import { SHIPPING_ZONE_LABELS } from "@/lib/shipping"
import type { OrderRow } from "@/lib/db/schema"

type ReceiptItem = { name: string; price: number; quantity: number }

function itemsTable(items: ReceiptItem[]) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2d8;">${item.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2d8;text-align:center;">${item.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2d8;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`,
    )
    .join("")

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #5B6B3C;">Producto</th>
          <th style="text-align:center;padding:6px 8px;border-bottom:2px solid #5B6B3C;">Cant.</th>
          <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #5B6B3C;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
}

function shippingSummary(order: OrderRow) {
  const label = SHIPPING_ZONE_LABELS[order.shippingZone]

  if (order.shippingZone === "retiro") {
    return `Entrega: ${label}. Te contactamos para coordinar el horario de retiro.`
  }

  const costLine =
    order.shippingCost > 0
      ? `Costo de envío: ${formatPrice(order.shippingCost)}`
      : "El cadete cobra el envío al entregar el paquete."

  return `Envío: ${label}.<br/>${costLine}<br/>Dirección: ${order.address}, ${order.city}`
}

/**
 * Le avisa al dueño de la tienda (NOTIFICATION_EMAIL, o ADMIN_EMAIL si no
 * está seteada esa) que entró un pedido nuevo. Se manda apenas se registra
 * el pedido, sin esperar a que se confirme el pago — así se entera al toque
 * y puede hacer seguimiento (sobre todo con transferencia bancaria).
 * "Best effort": si falla, no debe romper el checkout.
 */
export async function sendNewOrderNotificationToOwner(order: OrderRow, items: ReceiptItem[]) {
  const recipients = (process.env.NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  if (recipients.length === 0) return

  const paymentLabel = order.paymentMethod === "transferencia" ? "Transferencia bancaria" : "Mercado Pago"
  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "")

  const html = `
    <div style="font-family:sans-serif;color:#2A2A22;max-width:520px;margin:0 auto;">
      <h2 style="color:#5B6B3C;">¡Nuevo pedido!</h2>
      <p>
        <strong>${order.customerName}</strong> (${order.customerEmail}${order.customerPhone ? `, ${order.customerPhone}` : ""})
        acaba de hacer un pedido por <strong>${paymentLabel}</strong>.
      </p>
      ${itemsTable(items)}
      <p style="text-align:right;font-size:16px;margin-top:8px;"><strong>Total: ${formatPrice(order.total)}</strong></p>
      <p style="margin-top:16px;font-size:14px;">
        ${shippingSummary(order)}
      </p>
      <p style="margin-top:20px;">
        <a href="${baseUrl}/admin/pedidos" style="color:#5B6B3C;">Ver el pedido en el panel de administración</a>
      </p>
    </div>`

  await sendEmail({
    to: recipients,
    subject: `Nuevo pedido de ${order.customerName} — ${formatPrice(order.total)}`,
    html,
  })
}

/**
 * Manda el mail de confirmación al cliente. Se llama en dos momentos:
 * - Transferencia bancaria: apenas se registra el pedido (queda pendiente).
 * - Mercado Pago: cuando el webhook confirma que el pago fue aprobado.
 * Es "best effort": si falla el envío, no debe romper el flujo de compra
 * (el pedido ya está guardado igual), así que quien la llama debe envolver
 * esto en un try/catch y solo loguear el error.
 */
export async function sendOrderConfirmationEmail(order: OrderRow, items: ReceiptItem[]) {
  const isTransferPending = order.paymentMethod === "transferencia" && order.status === "pending"

  const subject = isTransferPending
    ? `Pequenido — Recibimos tu pedido #${order.id.slice(0, 8)}`
    : `Pequenido — ¡Pago aprobado! Pedido #${order.id.slice(0, 8)}`

  const intro = isTransferPending
    ? `Gracias ${order.customerName} por tu compra. Tu pedido quedó <strong>pendiente</strong> hasta que recibamos la transferencia — apenas nos llegue, te confirmamos.`
    : `Gracias ${order.customerName} por tu compra. ¡Tu pago fue aprobado! Este es el recibo de tu pedido.`

  const bankBlock = isTransferPending
    ? `
      <div style="margin-top:16px;padding:12px 14px;background:#F2F0E6;border-left:4px solid #5B6B3C;font-size:14px;">
        <p style="margin:0 0 4px;"><strong>Datos para transferir</strong></p>
        <p style="margin:0;">Banco: ${BANK_NAME}</p>
        <p style="margin:0;">Titular: ${BANK_ACCOUNT_HOLDER}</p>
        <p style="margin:0;">Cuenta: ${BANK_ACCOUNT_NUMBER}</p>
      </div>`
    : ""

  const html = `
    <div style="font-family:sans-serif;color:#2A2A22;max-width:520px;margin:0 auto;">
      <h2 style="color:#5B6B3C;">Pequenido</h2>
      <p>${intro}</p>
      ${itemsTable(items)}
      <p style="text-align:right;font-size:16px;margin-top:8px;"><strong>Total: ${formatPrice(order.total)}</strong></p>
      ${bankBlock}
      <p style="margin-top:16px;font-size:14px;">
        ${shippingSummary(order)}
      </p>
      <p style="margin-top:20px;font-size:13px;color:#6B6B5F;">Pedido #${order.id}</p>
    </div>`

  await sendEmail({ to: order.customerEmail, subject, html })
}
