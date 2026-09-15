import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /*
   * The dev server only answers cross-origin requests for its own dev assets
   * from origins listed here. Without the ngrok hosts, a tunnelled session
   * loads the HTML but every /_next/* request is refused — the page arrives
   * unstyled and hot reload never connects.
   *
   * Development only: this has no effect on a production build.
   */
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
