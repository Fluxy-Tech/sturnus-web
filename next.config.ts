import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build enxuto pro Docker: .next/standalone já traz um server.js com só as
  // dependências que o app realmente usa.
  output: "standalone",
  serverExternalPackages: ["pg"],
  // 90 é usado nas fotos grandes recortadas em círculo da home.
  images: { qualities: [75, 90] },
  async redirects() {
    return [{ source: "/contact", destination: "/contato", permanent: true }];
  },
};

export default nextConfig;
