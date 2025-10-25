import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel 최적화 설정
  output: 'standalone',
  // 테스트 파일 제외
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // 스크립트 파일 제외
    config.module.rules.push({
      test: /scripts\/.*\.ts$/,
      use: 'ignore-loader'
    });
    
    return config;
  },
  // 이미지 최적화 전역 비활성화 (임시: undefined 경로 400 차단)
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      { source: '/heroes/default.png', destination: '/heroes/default.svg' },
      { source: '/heroes/hero-undefined.png', destination: '/heroes/default.svg' },
      { source: '/_next/image', destination: '/heroes/default.svg' },
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/manifest/assets.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }
        ]
      }
    ];
  },
};

export default nextConfig;
