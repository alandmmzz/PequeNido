export type ShippingZone = "retiro" | "montevideo" | "interior"

// Costo fijo que cobra Pequenido por el envío. En "interior" no hay costo
// fijo propio: lo que cobra el cadete al entregar corre por cuenta de quien
// recibe, así que ahí queda en 0 para Pequenido.
export const SHIPPING_COST: Record<ShippingZone, number> = {
  retiro: 0,
  montevideo: 200,
  interior: 0,
}

export const SHIPPING_ZONE_LABELS: Record<ShippingZone, string> = {
  retiro: "Retiro en el pick up center (Goes)",
  montevideo: "Envío a Montevideo y área metropolitana",
  interior: "Envío al interior del país",
}
