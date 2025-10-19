# InnerMap AI - 성격 분석 및 히어로 매칭 시스템

## 🎭 96개 영웅 이미지 자동 생성 시스템

### 📋 개요
- **MBTI 16가지 × 에니어그램 6가지(3,4,5,6,7,8) = 96개 조합**
- 각 영웅마다 고유한 이름, 타이틀, 능력 3개, 성격 설명
- DALL-E 3 API를 통한 자동 이미지 생성
- 1024x1024 해상도의 고품질 이미지

### 🚀 영웅 이미지 생성 방법

#### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Payment Configuration
NEXT_PUBLIC_PAYMENTS_V2_GUARD=false
```

또는 터미널에서 직접 설정:
```bash
export OPENAI_API_KEY="your_openai_api_key_here"
```

#### 2. 이미지 생성 실행
```bash
npm run generate-heroes
```

또는 직접 실행:
```bash
node src/scripts/generateHeroImages.js
```

### ⚙️ 시스템 특징

#### 🔄 배치 처리
- API 제한 고려하여 5개씩 배치 처리
- 배치 간 2초 대기로 안정성 확보
- 진행률 실시간 표시 (1/96, 2/96...)

#### 🔁 재시도 로직
- 실패 시 최대 3회 재시도
- 지수 백오프로 효율적인 재시도
- 실패한 영웅 목록 자동 생성

#### 📁 파일 관리
- `public/heroes/` 폴더에 자동 저장
- 파일명: `MBTI_RETI.png` (예: `ENFP_type3.png`)
- `heroIndex.json` 파일로 인덱스 관리

### 🎨 프롬프트 예시
```
A fantasy hero named 'Sprint Adventurer', ENFP personality type 3, 
energetic and goal-oriented explorer, digital art style, portrait, 
high quality, fantasy character design, vibrant colors, 
detailed illustration, professional artwork
```

### 🖼️ 이미지 로딩 시스템

#### HeroCard 컴포넌트
- 로컬 이미지 우선 로드 (`/heroes/ENFP_type3.png`)
- 이미지 로딩 실패 시 기본 CSS 아트로 fallback
- 로딩 상태 표시 및 에러 처리

#### 사용법
```jsx
<HeroCard 
  mbtiType="ENFP" 
  enneagramType="type3" 
/>
```

### 📊 생성 결과
- ✅ 성공: 96개 영웅 이미지
- 📄 인덱스: `public/heroes/heroIndex.json`
- ❌ 실패: 실패한 영웅 목록 및 재시도 가능

### 🔧 기술 스택
- **OpenAI DALL-E 3**: 고품질 이미지 생성
- **Node.js**: 서버 사이드 스크립트
- **React**: 프론트엔드 컴포넌트
- **Tailwind CSS**: 스타일링

### 💡 팁
1. **API 비용**: 96개 이미지 생성 시 약 $9.6 (DALL-E 3 기준)
2. **생성 시간**: 약 30-60분 (API 제한 및 배치 처리 고려)
3. **저장 공간**: 약 100MB (1024x1024 PNG 파일 기준)
4. **재생성**: 기존 이미지 덮어쓰기 가능

### 🚨 주의사항
- OpenAI API 키가 필요합니다
- 충분한 API 크레딧을 확보하세요
- 네트워크 연결이 안정적인 환경에서 실행하세요
- 생성 중에는 스크립트를 중단하지 마세요

---

## 🔮 운세(만세력) 시스템

### 📋 개요
- **실제 사주팔자 계산**: `manseryeok` 라이브러리 활용
- **AI 기반 해석**: OpenAI GPT-4o를 통한 성격 분석 및 운세 해석
- **양력/음력 지원**: 양력 또는 음력 생년월일 입력 가능
- **오행 분석**: 목(木), 화(火), 토(土), 금(金), 수(水) 분포 계산

### 🚀 운세 기능 사용 방법

#### 1. 환경 변수 설정
`.env.local` 파일에 OpenAI API 키를 추가하세요:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o
```

#### 2. 운세 등록
1. 대시보드에서 "운세" 탭 클릭
2. "운세 등록하기" 버튼 클릭
3. 생년월일, 출생 시간, 출생 지역 입력
4. AI가 사주팔자를 계산하고 해석 생성

#### 3. 운세 조회
- **카드 뷰**: 대시보드에서 간단한 운세 요약 확인
- **상세 뷰**: "상세 운세 보기" 클릭하여 전체 분석 확인

### ⚙️ 기술 스택
- **manseryeok**: 한국 사주/만세력 계산 라이브러리
- **OpenAI GPT-4o**: AI 기반 운세 해석
- **Supabase**: 운세 데이터 저장
- **React Hook Form + Zod**: 폼 검증

### 📊 운세 데이터 구조
```typescript
{
  year: { heavenlyStem: '甲', earthlyBranch: '子' },
  month: { heavenlyStem: '乙', earthlyBranch: '丑' },
  day: { heavenlyStem: '丙', earthlyBranch: '寅' },
  hour: { heavenlyStem: '丁', earthlyBranch: '卯' },
  elements: {
    wood: 2,
    fire: 1,
    earth: 1,
    metal: 0,
    water: 0
  }
}
```

### 💡 AI 해석 내용
- **성격 특징**: 사주 기반 성격 분석
- **강점**: 타고난 재능과 능력
- **약점**: 주의해야 할 부분
- **오늘의 운세**: 일일 운세 조언

---

## 🎯 전체 시스템 구성

### 📁 파일 구조
```
src/
├── data/
│   ├── heroMapping.js      # 96개 영웅 데이터
│   └── backgroundMapping.js # 39개 배경 데이터
├── scripts/
│   └── generateHeroImages.js # 이미지 생성 스크립트
└── components/
    └── HeroCard.jsx        # 히어로 카드 컴포넌트
```

### 🌟 주요 기능
- **96개 고유 영웅**: MBTI × 에니어그램 조합
- **39개 자연 배경**: 색채심리 기반
- **자동 이미지 생성**: DALL-E 3 API 활용
- **실시간 로딩**: 이미지 상태 관리
- **Fallback 시스템**: 이미지 실패 시 대체 표시

InnerMap AI로 당신만의 고유한 히어로를 만나보세요! 🎭✨
