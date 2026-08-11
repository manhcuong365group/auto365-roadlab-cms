import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the canonical slashless App Router path. The preview proxy normalizes
  // directory-style URLs; forcing a trailing slash creates /studio ↔ /studio/
  // loops in that environment.
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "auto365.vn",
        pathname: "/uploads/images/**",
      },
    ],
  },
};

export default nextConfig;
