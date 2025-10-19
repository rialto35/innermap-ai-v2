import { calculateFourPillars, lunarToSolar, type BirthInfo, type FourPillarsDetail } from "manseryeok";
import OpenAI from "openai";

// AI 클라이언트 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

/**
 * 날짜 문자열을 파싱하여 BirthInfo 객체로 변환
 */
function parseBirthInfo(dateStr: string, timeStr: string, isLunar: boolean = false): BirthInfo {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  return {
    year,
    month,
    day,
    hour,
    minute: minute || 0,
    isLunar,
    isLeapMonth: false
  };
}

/**
 * 사주 계산 + AI 해석 함수
 * @param solarBirth - 양력 생년월일 (YYYY-MM-DD)
 * @param lunarBirth - 음력 생년월일 (YYYY-MM-DD, optional)
 * @param birthTime - 출생 시간 (HH:MM)
 * @param location - 출생 지역 (optional)
 * @returns 사주 데이터와 AI 해석 텍스트
 */
export async function calculateHoroscope({
  solarBirth,
  lunarBirth,
  birthTime,
  location
}: {
  solarBirth: string;
  lunarBirth?: string;
  birthTime: string;
  location?: string;
}) {
  try {
    console.log('🔮 [calculateHoroscope] Starting...')
    
    // 1) 만세력 데이터 계산
    const birthInfo = lunarBirth
      ? parseBirthInfo(lunarBirth, birthTime, true)
      : parseBirthInfo(solarBirth, birthTime, false);

    console.log('📅 [calculateHoroscope] Birth info:', birthInfo)

    const saju = calculateFourPillars(birthInfo);

    console.log('📊 [calculateHoroscope] Saju calculated:', {
      year: saju.yearHanja,
      month: saju.monthHanja,
      day: saju.dayHanja,
      hour: saju.hourHanja
    })

    // 2) AI 모델에게 해석 요청 (프롬프트를 원하는 형태로 수정)
    console.log('🤖 [calculateHoroscope] Calling OpenAI API...')
    
    const prompt = `
아래는 만세력 사주 데이터입니다. 사주 정보(연주·월주·일주·시주와 오행 분포)를 해석하여
성격 특징, 강점, 약점, 오늘의 운세를 간결하게 작성해 주세요.

사주 데이터: ${JSON.stringify(saju, null, 2)}
위치: ${location ?? "미지정"}

다음 형식으로 작성해주세요:
- 성격 특징: (2-3문장)
- 강점: (2-3문장)
- 약점: (2-3문장)
- 오늘의 운세: (2-3문장)
    `.trim();

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message?.content?.trim() ?? "";

    console.log('✅ [calculateHoroscope] OpenAI response received')
    console.log('📝 [calculateHoroscope] Analysis length:', analysis.length, 'chars')
    console.log('📝 [calculateHoroscope] Analysis preview:', analysis.substring(0, 200))

    return { saju, analysis };
  } catch (error) {
    console.error("Failed to calculate horoscope:", error);
    throw new Error("사주 계산 또는 AI 해석에 실패했습니다.");
  }
}

/**
 * 오행 분포 계산 (사주 데이터에서 추출)
 * @param saju - 만세력 사주 데이터
 * @returns 오행 분포 객체
 */
export function calculateElementDistribution(saju: FourPillarsDetail): {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
} {
  const elementMap: Record<string, keyof typeof elements> = {
    '목': 'wood',
    '화': 'fire',
    '토': 'earth',
    '금': 'metal',
    '수': 'water'
  };

  const elements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  // 연주, 월주, 일주, 시주의 천간과 지지 오행 카운트
  const pillars = [
    { stem: saju.yearElement.stem, branch: saju.yearElement.branch },
    { stem: saju.monthElement.stem, branch: saju.monthElement.branch },
    { stem: saju.dayElement.stem, branch: saju.dayElement.branch },
    { stem: saju.hourElement.stem, branch: saju.hourElement.branch }
  ];

  pillars.forEach(({ stem, branch }) => {
    const stemKey = elementMap[stem];
    const branchKey = elementMap[branch];
    
    if (stemKey) elements[stemKey]++;
    if (branchKey) elements[branchKey]++;
  });

  return elements;
}

/**
 * 주요 오행 판단
 * @param elements - 오행 분포
 * @returns 주요 오행
 */
export function getDominantElement(elements: {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}): string {
  const entries = Object.entries(elements);
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

