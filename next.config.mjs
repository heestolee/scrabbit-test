/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    esmExternals: false,
    appDir: true,
  },
};

export default nextConfig;
