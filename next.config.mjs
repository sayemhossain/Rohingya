/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Allow admin-uploaded SVG icons to be served via next/image.
    // Safe here because uploads are restricted to authenticated admins.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    // Old "/sectors" URLs now live at "/programmes" — keep old links working.
    return [
      { source: "/sectors", destination: "/programmes", permanent: true },
      { source: "/sectors/:slug", destination: "/programmes/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
