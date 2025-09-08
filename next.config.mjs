/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/webapp/:path*.html",
        headers: [
          { key: "Content-Type", value: "text/html; charset=utf-8" },
        ],
      },
    ];
  },
};
export default nextConfig;
