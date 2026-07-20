/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Handle trailing-slash + www redirects in middleware as a single 308 hop.
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Serve the static Mots Mêlés PWA (public/app) at /app/
      { source: '/app', destination: '/app/index.html' },
      { source: '/app/', destination: '/app/index.html' },
    ]
  },
}

export default nextConfig
