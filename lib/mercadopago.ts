import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  // No tiramos error para no romper el build/dev sin credenciales todavía,
  // pero avisamos claramente en consola.
  console.warn(
    "[mercadopago] Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno. " +
      "Los pagos no van a funcionar hasta que la configures en .env.local (ver .env.example).",
  )
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
})

export const mpPreference = new Preference(mpClient)
export const mpPayment = new Payment(mpClient)
