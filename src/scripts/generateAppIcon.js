import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAppIcon() {
  try {
    console.log('🎨 InnerMap AI 앱 아이콘 생성 중...');
    
    const prompt = "App icon for InnerMap AI, minimalist brain-map design, holographic gradient, modern tech style, clean lines, purple and blue gradient, brain with neural network connections, map-like elements, professional and modern, suitable for app store";
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    console.log('✅ 아이콘 생성 완료:', imageUrl);
    
    // 이미지 다운로드
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // public 폴더에 저장
    const publicDir = path.join(__dirname, '../../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const iconPath = path.join(publicDir, 'app-icon-1024.png');
    fs.writeFileSync(iconPath, Buffer.from(imageBuffer));
    
    console.log('✅ 아이콘 저장 완료:', iconPath);
    console.log('📝 다음 단계: 다양한 크기로 리사이즈하세요!');
    
  } catch (error) {
    console.error('❌ 아이콘 생성 실패:', error);
  }
}

// 스크립트 실행
if (process.env.OPENAI_API_KEY) {
  generateAppIcon();
} else {
  console.error('❌ OPENAI_API_KEY 환경변수가 설정되지 않았습니다.');
  console.log('💡 .env 파일에 OPENAI_API_KEY를 추가하세요.');
}
