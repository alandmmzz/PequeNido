/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Por defecto los Server Actions solo aceptan hasta 1MB de body.
    // El form de admin manda varias imágenes + un video en el mismo envío,
    // así que necesitamos más margen.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
}

export default nextConfig
