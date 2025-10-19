# CrewAI 연동 가이드

## 개요

CrewAI는 다중 AI 에이전트를 활용한 심층 심리 분석 시스템입니다. 5개의 전문 에이전트가 협업하여 종합적인 분석 리포트를 생성합니다.

## 아키텍처

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  FastAPI Server │
│  (crewai_service)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CrewAI Crew   │
│  (5 Agents)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   OpenAI API    │
│   (GPT-4o)      │
└─────────────────┘
```

## 에이전트 구성

### 1. Personality Analyst (성격 분석 전문가)
- **역할**: Big5, MBTI, Inner9 데이터 종합 분석
- **출력**: 핵심 성격 특징, 강점, 약점

### 2. Growth Advisor (성장 조언 전문가)
- **역할**: 강점 극대화 및 약점 보완 전략
- **출력**: 단기/중기/장기 성장 목표

### 3. Relationship Expert (관계 심리 전문가)
- **역할**: 대인관계 패턴 및 소통 스타일 분석
- **출력**: 관계 개선 방안

### 4. Career Consultant (진로 컨설턴트)
- **역할**: 적성 분석 및 커리어 방향 제시
- **출력**: 적합한 직업 분야 및 발전 방향

### 5. Report Writer (리포트 작성자)
- **역할**: 모든 분석 결과 통합
- **출력**: 구조화된 최종 리포트 (JSON)

## 설치 및 실행

### 1. Python 환경 설정

```bash
cd crewai_service

# 가상환경 생성
python -m venv venv

# 활성화 (Windows)
.\venv\Scripts\activate

# 활성화 (Linux/Mac)
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경변수 설정

```bash
cp env.example .env
```

`.env` 파일 편집:

```env
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
HOST=0.0.0.0
PORT=8000
```

### 3. 서버 실행

```bash
# 개발 모드
uvicorn main:app --reload --port 8000

# 프로덕션 모드
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 4. Docker 실행 (선택사항)

```bash
# 빌드
docker build -t crewai-service .

# 실행
docker run -p 8000:8000 --env-file .env crewai-service

# Docker Compose
docker-compose up -d
```

## API 사용법

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "crewai-analysis",
  "version": "1.0.0",
  "environment": "development"
}
```

### Analysis Request

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "big5": {
      "O": 0.75,
      "C": 0.60,
      "E": 0.55,
      "A": 0.70,
      "N": 0.45
    },
    "mbti": "INFP",
    "inner9": {
      "creation": 75,
      "will": 60,
      "insight": 80,
      "sensitivity": 70,
      "growth": 65,
      "balance": 55,
      "harmony": 60,
      "expression": 75
    },
    "hero": {
      "code": "H-INFP-001",
      "title": "몽상가",
      "tribe": "dras"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "analysis": {
    "summary": "당신은 창의적이고 통찰력 있는 성격으로...",
    "strengths": [
      "뛰어난 창의력과 상상력",
      "깊은 통찰력과 직관",
      "타인에 대한 공감 능력"
    ],
    "weaknesses": [
      "과도한 완벽주의 경향",
      "결정을 내리는 데 시간이 오래 걸림",
      "스트레스 관리 필요"
    ],
    "growthAdvice": "당신의 창의력을 실제 행동으로 옮기는 연습을...",
    "relationships": "당신은 깊고 의미 있는 관계를 중시하며...",
    "career": "창의적 표현이 가능한 분야에서 강점을 발휘할 수 있습니다..."
  },
  "metadata": {
    "model": "gpt-4o",
    "crewVersion": "0.86.0",
    "processingTime": 12.5
  }
}
```

## Next.js 연동

### 1. 환경변수 설정

`.env.local`:

```env
NEXT_PUBLIC_CREWAI_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_CREWAI_TIMEOUT=300000
NEXT_PUBLIC_ENABLE_CREWAI=true
```

### 2. 클라이언트 사용

```typescript
import { crewAIClient } from '@/lib/crewai';

const result = await crewAIClient.analyze({
  userId: 'user-123',
  big5: { O: 0.75, C: 0.60, E: 0.55, A: 0.70, N: 0.45 },
  mbti: 'INFP',
  inner9: {
    creation: 75,
    will: 60,
    insight: 80,
    sensitivity: 70,
    growth: 65,
    balance: 55,
    harmony: 60,
    expression: 75,
  },
  hero: {
    code: 'H-INFP-001',
    title: '몽상가',
    tribe: 'dras',
  },
});

console.log(result.analysis.summary);
```

### 3. React Hook 사용

```typescript
import { useCrewAIAnalysis } from '@/lib/crewai';

function AnalysisComponent() {
  const { analyze, loading, error, data } = useCrewAIAnalysis();

  const handleAnalyze = async () => {
    try {
      await analyze({
        userId: 'user-123',
        big5: { ... },
        inner9: { ... },
      });
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? '분석 중...' : '분석 시작'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data.analysis, null, 2)}</pre>}
    </div>
  );
}
```

### 4. Fallback 메커니즘

CrewAI 서비스가 unavailable할 때 자동으로 Next.js API route로 폴백:

```typescript
const result = await crewAIClient.analyzeWithFallback(request);
```

Fallback은 `/api/analysis/fallback` 엔드포인트를 사용하여 직접 OpenAI API를 호출합니다.

## 성능 최적화

### 1. 타임아웃 설정

```env
CREWAI_TIMEOUT_SECONDS=300
NEXT_PUBLIC_CREWAI_TIMEOUT=300000
```

### 2. 캐싱 (향후 구현)

```typescript
// Redis 캐싱 예시
const cacheKey = `analysis:${userId}:${hash(input)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const result = await crewAIClient.analyze(input);
await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
```

### 3. 병렬 처리

현재는 순차 처리(Sequential Process)를 사용하지만, 향후 병렬 처리로 전환 가능:

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    process=Process.hierarchical,  # 또는 Process.parallel
)
```

## 모니터링

### 로그 확인

```bash
# 실시간 로그
tail -f crewai_service.log

# Docker 로그
docker logs -f crewai-service
```

### 메트릭

- **처리 시간**: `metadata.processingTime`
- **성공률**: 200 vs 500 응답 비율
- **에러율**: 에러 로그 모니터링

## 트러블슈팅

### 1. CrewAI 서비스 연결 실패

**증상**: `Failed to connect to CrewAI service`

**해결**:
- CrewAI 서비스가 실행 중인지 확인: `curl http://localhost:8000/health`
- 방화벽 설정 확인
- `NEXT_PUBLIC_CREWAI_SERVICE_URL` 환경변수 확인

### 2. OpenAI API 키 오류

**증상**: `OPENAI_API_KEY is not configured`

**해결**:
- `.env` 파일에 `OPENAI_API_KEY` 설정
- API 키 유효성 확인
- 요금 한도 확인

### 3. 타임아웃 오류

**증상**: `Analysis timed out`

**해결**:
- `CREWAI_TIMEOUT_SECONDS` 증가
- `CREWAI_MAX_ITERATIONS` 감소
- OpenAI 모델을 더 빠른 모델로 변경 (gpt-4o-mini)

### 4. JSON 파싱 오류

**증상**: `Failed to parse analysis result`

**해결**:
- OpenAI 응답에 `response_format: { type: 'json_object' }` 설정
- 프롬프트에 JSON 형식 명시
- Fallback 로직 활용

## 배포

### Vercel + Separate Python Service

1. **Next.js**: Vercel에 배포
2. **CrewAI Service**: AWS EC2, Google Cloud Run, 또는 Railway에 배포
3. **환경변수**: Vercel에서 `NEXT_PUBLIC_CREWAI_SERVICE_URL` 설정

### Docker Compose (All-in-One)

```yaml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_CREWAI_SERVICE_URL=http://crewai:8000
  
  crewai:
    build: ./crewai_service
    ports:
      - "8000:8000"
    env_file:
      - ./crewai_service/.env
```

## 향후 계획

- [ ] 에이전트 성능 튜닝
- [ ] Redis 캐싱 구현
- [ ] Prometheus 메트릭 추가
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 실시간 분석 진행률 표시
- [ ] A/B 테스트 (CrewAI vs Direct OpenAI)

