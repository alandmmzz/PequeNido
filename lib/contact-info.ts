// Teléfono y email de contacto de Peque Nido (los usa la página de envíos y
// devoluciones, y el botón de WhatsApp).
export const CONTACT_PHONE = "099472613"
export const CONTACT_EMAIL = "pequenido.uy@gmail.com"

// Mismo teléfono de contacto, en formato internacional para el link de
// WhatsApp (598 + el número sin el 0 inicial). Si en algún momento
// querés un WhatsApp distinto al teléfono de contacto, cambiá solo esta línea.
export const WHATSAPP_NUMBER = "598" + CONTACT_PHONE.replace(/^0/, "")

export const WHATSAPP_DEFAULT_MESSAGE = "¡Hola! Tengo una consulta sobre un producto de Peque Nido."
