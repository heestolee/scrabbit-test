/** @type {import("next").NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  output: "standalone",
  experimental: {
    esmExternals: false,
    appDir: true,
  },
};

export default nextConfig;
