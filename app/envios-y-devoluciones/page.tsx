import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/contact-info"

export const metadata: Metadata = {
  title: "Envíos y devoluciones | Peque Nido",
  description: "Política de envíos, cambios y devoluciones de Peque Nido.",
}

export default function EnviosYDevolucionesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/70 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">Ayuda</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance">
              Política de envíos, cambios y devoluciones
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Envíos</h2>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
                <li>
                  Una vez que hayamos recibido el pago de tu pedido, te lo enviaremos o lo dejaremos listo para
                  retiro en un plazo de entre 24 y 72&nbsp;hs.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Retiro sin costo:</strong> podés retirar tu
                  pedido en nuestro pick up center, en la zona de Goes, coordinando previamente el horario.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Envío a Montevideo y área metropolitana:</strong>{" "}
                  costo fijo de UYU&nbsp;$200 por cadetería privada, para los siguientes barrios:
                </li>
                <li>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border border-border/70 bg-secondary/30 p-4 text-sm sm:grid-cols-3">
                    {[
                      "Ciudad Vieja",
                      "Centro",
                      "Cordón",
                      "Tres Cruces",
                      "Parque Rodó",
                      "Punta Carretas",
                      "Pocitos",
                      "Buceo",
                      "Malvín",
                      "La Blanqueada",
                      "Parque Batlle",
                      "Unión",
                      "Villa Dolores",
                      "Jacinto Vera",
                      "Brazo Oriental",
                      "Prado",
                      "Reducto",
                      "Aguada",
                      "La Comercial",
                      "Goes",
                      "Paso Molino",
                      "Belvedere",
                      "Sayago",
                    ].map((barrio) => (
                      <span key={barrio}>{barrio}</span>
                    ))}
                  </div>
                </li>
                <li>
                  <strong className="font-medium text-foreground">Envío al interior del país:</strong> lo
                  despachamos por DAC – Agencia Central. El envío en sí (lo que cobra la agencia al
                  retirar el paquete) corre por cuenta de quien recibe.
                </li>
                <li>Los tiempos de entrega de los envíos coordinados son responsabilidad de la agencia o cadetería.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Política de cambio y devolución</h2>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
                <li>
                  Si deseás realizar un cambio, éste debe solicitarse dentro de los 10 días posteriores a la
                  recepción del producto.
                </li>
                <li>No realizamos devoluciones de dinero: solo se aceptan cambios por otro producto.</li>
                <li>El producto debe estar en perfecto estado y con su empaque original.</li>
                <li>
                  Para comenzar este proceso, comunicate por teléfono al{" "}
                  <a href={`tel:${CONTACT_PHONE}`} className="font-medium text-foreground hover:underline">
                    {CONTACT_PHONE}
                  </a>{" "}
                  o por email a{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                  . Vas a recibir, dentro de las siguientes 72 horas hábiles, el detalle de los pasos a seguir
                  para completar el cambio.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5 text-sm text-muted-foreground">
              ¿Tenés dudas sobre tu pedido? Escribinos a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              o llamanos al{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="font-medium text-foreground hover:underline">
                {CONTACT_PHONE}
              </a>
              .
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
