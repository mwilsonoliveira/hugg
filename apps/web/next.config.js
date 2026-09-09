/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hugg/ui", "@hugg/database"],
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/adapter-libsql",
      "@libsql/client",
      "libsql",
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals.push("@prisma/adapter-libsql", "@libsql/client", "libsql");
    }
    return config;
  },
};

export default nextConfig;
