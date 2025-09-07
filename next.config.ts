import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Не блокировать прод-сборку из-за предупреждений/ошибок ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Типы не игнорируем — bot/ уже исключён в tsconfig.json
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
