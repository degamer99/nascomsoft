import type { NextConfig } from "next";

// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // don’t enable in dev
})

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"], // ✅ Add allowed domains here
  },
  /* config options here */
};

// export default nextConfig;
// module.exports = withPWA(nextConfig)
// wrap and export
export default withPWA(nextConfig)
