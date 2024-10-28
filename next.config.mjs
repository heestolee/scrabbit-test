/** @type {import("next").NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  output: "standalone",
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
