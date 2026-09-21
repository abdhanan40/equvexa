import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The inquiry forms are the only actions, and their longest field is a
      // 1,000 character message; anything near this size is not a form post.
      bodySizeLimit: "64kb",
    },
  },
};

export default nextConfig;
