# CrewAI Analysis Service

AI 기반 심층 심리 분석을 위한 CrewAI 마이크로서비스입니다.

## 🚀 Quick Start

### 1. 가상환경 생성 및 활성화

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정

```bash
cp env.example .env
# .env 파일을 열어 API 키 설정
```

### 4. 서버 실행

```bash
# 개발 모드
uvicorn main:app --reload --port 8000

# 프로덕션 모드
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📡 API Endpoints

### POST /analyze

심층 분석을 실행합니다.

**Request Body:**

```json
{
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
}
```

**Response:**

```json
{
  "success": true,
  "analysis": {
    "summary": "당신은...",
    "strengths": ["..."],
    "weaknesses": ["..."],
    "growthAdvice": "...",
    "relationships": "...",
    "career": "..."
  },
  "metadata": {
    "model": "gpt-4o",
    "crewVersion": "0.86.0",
    "processingTime": 12.5
  }
}
```

### GET /health

서비스 상태를 확인합니다.

## 🧠 CrewAI Agents

### 1. Personality Analyst (성격 분석가)
- Big5, MBTI, Inner9 데이터를 종합 분석
- 핵심 성격 특징 도출

### 2. Growth Advisor (성장 조언자)
- 강점과 약점 분석
- 구체적인 성장 전략 제시

### 3. Relationship Expert (관계 전문가)
- 대인관계 패턴 분석
- 소통 스타일 개선 방안 제시

### 4. Career Consultant (진로 컨설턴트)
- 적성과 역량 분석
- 커리어 발전 방향 제시

### 5. Report Writer (리포트 작성자)
- 모든 분석 결과를 통합
- 구조화된 최종 리포트 생성

## 🧪 Testing

```bash
# 전체 테스트 실행
pytest

# 커버리지 포함
pytest --cov=. --cov-report=html

# 특정 테스트 실행
pytest tests/test_crew.py -v
```

## 📦 Deployment

### Docker

```bash
docker build -t crewai-service .
docker run -p 8000:8000 --env-file .env crewai-service
```

### Docker Compose

```bash
docker-compose up -d
```

## 📚 Documentation

- [CrewAI 공식 문서](https://docs.crewai.com/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [OpenAI API 문서](https://platform.openai.com/docs/)

## 🔧 Development

### Code Formatting

```bash
# Black
black .

# Ruff
ruff check . --fix
```

### Type Checking

```bash
mypy .
```

## 📝 License

MIT

