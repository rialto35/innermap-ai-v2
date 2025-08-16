import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG 아이콘 생성 (개선된 버전)
function createSVGIcon() {
  const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <!-- 배경 원 -->
  <circle cx="512" cy="512" r="480" fill="url(#grad1)" opacity="0.95" filter="url(#shadow)"/>
  
  <!-- 뇌 모양 (더 정교한) -->
  <path d="M 280 380 Q 240 420 280 460 Q 320 500 360 460 Q 400 420 360 380 Q 320 340 280 380 Z" 
        fill="white" opacity="0.95" filter="url(#glow)"/>
  <path d="M 640 380 Q 600 420 640 460 Q 680 500 720 460 Q 760 420 720 380 Q 680 340 640 380 Z" 
        fill="white" opacity="0.95" filter="url(#glow)"/>
  
  <!-- 신경망 연결선 -->
  <line x1="360" y1="420" x2="640" y2="420" stroke="white" stroke-width="4" opacity="0.8"/>
  <line x1="400" y1="380" x2="600" y2="460" stroke="white" stroke-width="3" opacity="0.6"/>
  <line x1="400" y1="460" x2="600" y2="380" stroke="white" stroke-width="3" opacity="0.6"/>
  
  <!-- 지도 요소들 (격자) -->
  <line x1="200" y1="200" x2="824" y2="200" stroke="white" stroke-width="2" opacity="0.3"/>
  <line x1="200" y1="824" x2="824" y2="824" stroke="white" stroke-width="2" opacity="0.3"/>
  <line x1="200" y1="200" x2="200" y2="824" stroke="white" stroke-width="2" opacity="0.3"/>
  <line x1="824" y1="200" x2="824" y2="824" stroke="white" stroke-width="2" opacity="0.3"/>
  
  <!-- 지도 포인트들 -->
  <circle cx="300" cy="300" r="10" fill="white" opacity="0.9"/>
  <circle cx="700" cy="300" r="10" fill="white" opacity="0.9"/>
  <circle cx="300" cy="700" r="10" fill="white" opacity="0.9"/>
  <circle cx="700" cy="700" r="10" fill="white" opacity="0.9"/>
  
  <!-- 중앙 포인트 -->
  <circle cx="512" cy="512" r="20" fill="white" opacity="0.95"/>
  <circle cx="512" cy="512" r="8" fill="#8b5cf6" opacity="0.9"/>
  
  <!-- 텍스트 -->
  <text x="512" y="800" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="56" font-weight="bold" opacity="0.95">
    InnerMap AI
  </text>
</svg>`;

  return svgContent;
}

// 아이콘 파일들 생성
function createIconFiles() {
  const publicDir = path.join(__dirname, '../../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // SVG 아이콘 생성
  const svgContent = createSVGIcon();
  const svgPath = path.join(publicDir, 'icon.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('✅ SVG 아이콘 생성:', svgPath);

  // 모든 크기의 아이콘 생성
  const iconSizes = [
    { name: 'icon-16.png', size: 16 },
    { name: 'icon-32.png', size: 32 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-128.png', size: 128 },
    { name: 'icon-144.png', size: 144 },
    { name: 'icon-152.png', size: 152 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-384.png', size: 384 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.ico', size: 32 }
  ];

  iconSizes.forEach(({ name, size }) => {
    const iconPath = path.join(publicDir, name);
    // 실제로는 SVG를 PNG로 변환하는 라이브러리가 필요하지만, 여기서는 복사
    fs.copyFileSync(svgPath, iconPath);
    console.log(`✅ 아이콘 생성 (${size}x${size}):`, iconPath);
  });

  // 스크린샷 파일들도 생성 (임시)
  const screenshotContent = `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <text x="640" y="360" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
    InnerMap AI - 나를 찾는 지도
  </text>
  <text x="640" y="420" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" opacity="0.7">
    AI 성격분석과 심리 운세 통합 플랫폼
  </text>
</svg>`;

  const screenshotWidePath = path.join(publicDir, 'screenshot-wide.png');
  fs.writeFileSync(screenshotWidePath, screenshotContent);
  console.log('✅ 스크린샷 생성 (wide):', screenshotWidePath);

  const screenshotNarrowContent = `
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="750" height="1334" fill="url(#bg)"/>
  <text x="375" y="667" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
    InnerMap AI
  </text>
  <text x="375" y="720" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" opacity="0.7">
    나를 찾는 지도
  </text>
</svg>`;

  const screenshotNarrowPath = path.join(publicDir, 'screenshot-narrow.png');
  fs.writeFileSync(screenshotNarrowPath, screenshotNarrowContent);
  console.log('✅ 스크린샷 생성 (narrow):', screenshotNarrowPath);

  // OG 이미지 생성
  const ogImageContent = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="250" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="72" font-weight="bold">
    InnerMap AI
  </text>
  <text x="600" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" opacity="0.8">
    나를 찾는 지도
  </text>
  <text x="600" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" opacity="0.6">
    AI 성격분석과 심리 운세 통합 플랫폼
  </text>
</svg>`;

  const ogImagePath = path.join(publicDir, 'og-image.png');
  fs.writeFileSync(ogImagePath, ogImageContent);
  console.log('✅ OG 이미지 생성:', ogImagePath);

  console.log('🎉 모든 아이콘 및 이미지 생성 완료!');
  console.log('💡 실제 사용을 위해서는 DALL-E로 생성한 아이콘으로 교체하세요.');
  console.log('📝 DALL-E 프롬프트: "App icon for InnerMap AI, minimalist design, brain-map concept, holographic gradient colors (purple, cyan, blue), modern tech style, clean geometric shapes, app icon format, 1024x1024, suitable for mobile home screen"');
}

createIconFiles();
