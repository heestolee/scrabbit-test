/** @type {import("next").NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "chrome-aws-lambda"];
    }
    return config;
  },
};

export default nextConfig;
