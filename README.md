# Peque Nido

Tienda online de juguetes y libros para bebés y primera infancia, con catálogo, checkout con **Mercado Pago** o transferencia bancaria, y un panel de administración propio para gestionar productos y pedidos.

🔗 Sitio en producción: [pequenido.com.uy](https://www.pequenido.com.uy)

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + [shadcn/ui](https://ui.shadcn.com)
- **Drizzle ORM** sobre **Postgres (Neon)**
- **Mercado Pago** (Checkout Pro) para pagos con tarjeta/billetera
- **Resend** para el envío de emails transaccionales (confirmación de pedido, magic link de login, avisos internos)
- **Vercel Blob** para las imágenes y videos de producto
- Deploy en **Vercel**

## Funcionalidades

- Catálogo de juguetes y libros, filtrable por edad recomendada y categoría
- Fichas de producto con galería de imágenes, video y productos relacionados
- Precios promocionales: si un producto tiene precio de promo cargado, se muestra tachado el precio común y un badge de "Promo" en toda la tienda
- Carrito persistente y checkout con dos métodos de pago: Mercado Pago o transferencia bancaria
- Tres zonas de envío (retiro en local, Montevideo/área metropolitana, interior por DAC) con costos configurables
- Panel de administración protegido por login sin contraseña (magic link por email):
  - Alta, edición y baja de productos
  - Gestión de pedidos y sus estados
  - Notificaciones automáticas por email al dueño de la tienda y al cliente cuando se confirma un pago

## Levantarlo en local

Necesitás Node 20+ y una base de Postgres (se usa [Neon](https://neon.tech) en producción, pero cualquier Postgres sirve para desarrollo).

```bash
npm install
cp .env.example .env.local   # completar con tus propias credenciales
npm run db:push              # sincroniza el schema con la base
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Están todas documentadas en [`.env.example`](.env.example) — incluye base de datos, credenciales de Mercado Pago (con la bandera `MERCADOPAGO_SANDBOX` para probar sin cobrar de verdad), Resend para los emails, y el email admitido para entrar al panel de admin.

### Scripts útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:push` | Aplica el schema de Drizzle a la base |
| `npm run db:studio` | Abre Drizzle Studio para explorar la base |
| `npm run db:seed` | Carga datos de ejemplo |
