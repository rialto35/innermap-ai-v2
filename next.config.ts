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
};

export default nextConfig;
