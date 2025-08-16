import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel 최적화 설정
  output: 'standalone',
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
