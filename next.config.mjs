/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default nextConfig;
