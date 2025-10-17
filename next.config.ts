import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel 최적화 설정
  output: 'standalone',
  // 이미지 최적화 전역 비활성화 (임시: undefined 경로 400 차단)
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      // 레거시/오류 경로를 안전한 SVG 플레이스홀더로 리다이렉트(런타임 레벨)
      { source: '/heroes/default.png', destination: '/images/hero-constellation.svg' },
      { source: '/heroes/hero-undefined.png', destination: '/images/hero-constellation.svg' },
      { source: '/_next/image', destination: '/images/hero-constellation.svg' },
    ];
  },
};

export default nextConfig;
