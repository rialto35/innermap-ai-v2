import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// heroMapping 데이터 가져오기
import { heroMapping } from '../data/heroMapping.js';

// 설정
const BATCH_SIZE = 5; // API 제한 고려
const RETRY_ATTEMPTS = 3;
const DELAY_BETWEEN_BATCHES = 2000; // 2초 대기

// 폴더 생성
const heroesDir = path.join(__dirname, '../../public/heroes');
if (!fs.existsSync(heroesDir)) {
  fs.mkdirSync(heroesDir, { recursive: true });
}

// 프롬프트 생성 함수
function generatePrompt(heroKey, heroData) {
  const mbtiType = heroKey.split('_')[0];
  const enneagramType = heroKey.split('_')[1];
  
  return `A fantasy hero named '${heroData.name}', ${mbtiType} personality type ${enneagramType.replace('type', '')}, ${heroData.personality}, digital art style, portrait, high quality, fantasy character design, vibrant colors, detailed illustration, professional artwork`;
}

// 이미지 생성 함수
async function generateImage(heroKey, heroData, attempt = 1) {
  try {
    const prompt = generatePrompt(heroKey, heroData);
    console.log(`\n🎨 생성 중: ${heroKey}`);
    console.log(`📝 프롬프트: ${prompt}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    
    // 이미지 다운로드
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // 파일 저장
    const fileName = `${heroKey}.png`;
    const filePath = path.join(heroesDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(imageBuffer));
    
    console.log(`✅ 성공: ${fileName}`);
    return { success: true, fileName };
    
  } catch (error) {
    console.error(`❌ 실패 (시도 ${attempt}/${RETRY_ATTEMPTS}): ${heroKey}`, error.message);
    
    if (attempt < RETRY_ATTEMPTS) {
      console.log(`🔄 재시도 중... (${attempt + 1}/${RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 지수 백오프
      return generateImage(heroKey, heroData, attempt + 1);
    }
    
    return { success: false, error: error.message, heroKey };
  }
}

// 배치 처리 함수
async function processBatch(heroKeys, startIndex) {
  const batch = heroKeys.slice(startIndex, startIndex + BATCH_SIZE);
  const promises = batch.map(heroKey => 
    generateImage(heroKey, heroMapping[heroKey])
  );
  
  return Promise.all(promises);
}

// 메인 실행 함수
async function generateAllHeroImages() {
  console.log('🚀 영웅 이미지 생성 시작!');
  console.log(`📊 총 ${Object.keys(heroMapping).length}개 영웅 처리 예정`);
  
  const heroKeys = Object.keys(heroMapping);
  const results = [];
  const failedHeroes = [];
  
  // 배치별 처리
  for (let i = 0; i < heroKeys.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(heroKeys.length / BATCH_SIZE);
    
    console.log(`\n📦 배치 ${batchNumber}/${totalBatches} 처리 중...`);
    console.log(`📈 진행률: ${i + 1}-${Math.min(i + BATCH_SIZE, heroKeys.length)}/${heroKeys.length}`);
    
    const batchResults = await processBatch(heroKeys, i);
    
    // 결과 수집
    batchResults.forEach(result => {
      results.push(result);
      if (!result.success) {
        failedHeroes.push(result.heroKey);
      }
    });
    
    // 배치 간 대기 (API 제한 고려)
    if (i + BATCH_SIZE < heroKeys.length) {
      console.log(`⏳ ${DELAY_BETWEEN_BATCHES/1000}초 대기 중...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  // 결과 요약
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n🎉 생성 완료!');
  console.log(`✅ 성공: ${successful}개`);
  console.log(`❌ 실패: ${failed}개`);
  
  if (failedHeroes.length > 0) {
    console.log('\n❌ 실패한 영웅들:');
    failedHeroes.forEach(heroKey => console.log(`  - ${heroKey}`));
  }
  
  // heroIndex.json 생성
  const heroIndex = {};
  heroKeys.forEach(heroKey => {
    const fileName = `${heroKey}.png`;
    const filePath = path.join(heroesDir, fileName);
    heroIndex[heroKey] = {
      fileName,
      exists: fs.existsSync(filePath),
      path: `/heroes/${fileName}`
    };
  });
  
  const indexPath = path.join(heroesDir, 'heroIndex.json');
  fs.writeFileSync(indexPath, JSON.stringify(heroIndex, null, 2));
  console.log(`\n📄 인덱스 파일 생성: ${indexPath}`);
  
  return { successful, failed, failedHeroes, heroIndex };
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  // 환경 변수 확인
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    console.log('💡 사용법: OPENAI_API_KEY=your_key node src/scripts/generateHeroImages.js');
    process.exit(1);
  }
  
  generateAllHeroImages()
    .then(result => {
      console.log('\n🎊 모든 작업이 완료되었습니다!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 치명적 오류:', error);
      process.exit(1);
    });
}

export { generateAllHeroImages, generateImage };
