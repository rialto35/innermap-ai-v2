import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG 아이콘 생성 (임시)
function createSVGIcon() {
  const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 배경 원 -->
  <circle cx="512" cy="512" r="480" fill="url(#grad1)" opacity="0.9"/>
  
  <!-- 뇌 모양 (단순화된) -->
  <path d="M 300 400 Q 250 450 300 500 Q 350 550 400 500 Q 450 450 400 400 Q 350 350 300 400 Z" 
        fill="white" opacity="0.9" filter="url(#glow)"/>
  <path d="M 600 400 Q 550 450 600 500 Q 650 550 700 500 Q 750 450 700 400 Q 650 350 600 400 Z" 
        fill="white" opacity="0.9" filter="url(#glow)"/>
  
  <!-- 신경망 연결선 -->
  <line x1="400" y1="450" x2="600" y2="450" stroke="white" stroke-width="3" opacity="0.7"/>
  <line x1="450" y1="400" x2="550" y2="500" stroke="white" stroke-width="2" opacity="0.5"/>
  <line x1="450" y1="500" x2="550" y2="400" stroke="white" stroke-width="2" opacity="0.5"/>
  
  <!-- 지도 요소들 -->
  <circle cx="350" cy="350" r="8" fill="white" opacity="0.8"/>
  <circle cx="650" cy="350" r="8" fill="white" opacity="0.8"/>
  <circle cx="350" cy="650" r="8" fill="white" opacity="0.8"/>
  <circle cx="650" cy="650" r="8" fill="white" opacity="0.8"/>
  
  <!-- 중앙 포인트 -->
  <circle cx="512" cy="512" r="15" fill="white" opacity="0.9"/>
  
  <!-- 텍스트 -->
  <text x="512" y="750" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold" opacity="0.9">
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

  // 간단한 ICO 파일 (SVG를 기반으로)
  const icoPath = path.join(publicDir, 'favicon.ico');
  // 실제로는 SVG를 ICO로 변환하는 라이브러리가 필요하지만, 여기서는 복사
  fs.copyFileSync(svgPath, icoPath);
  console.log('✅ ICO 아이콘 생성:', icoPath);

  // PNG 파일들 (SVG를 기반으로)
  const pngSizes = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 }
  ];

  pngSizes.forEach(({ name, size }) => {
    const pngPath = path.join(publicDir, name);
    // 실제로는 SVG를 PNG로 변환하는 라이브러리가 필요하지만, 여기서는 복사
    fs.copyFileSync(svgPath, pngPath);
    console.log(`✅ PNG 아이콘 생성 (${size}x${size}):`, pngPath);
  });

  console.log('🎉 모든 임시 아이콘 생성 완료!');
  console.log('💡 실제 사용을 위해서는 DALL-E로 생성한 아이콘으로 교체하세요.');
}

createIconFiles();
