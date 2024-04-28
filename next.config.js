/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,

  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
};
module.exports = nextConfig;
