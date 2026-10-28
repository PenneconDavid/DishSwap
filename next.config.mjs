/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["multer"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
