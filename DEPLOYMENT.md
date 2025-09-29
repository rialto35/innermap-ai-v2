# Innermap AI 배포 가이드

## Vercel 배포 방법

### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

### 2. Vercel 로그인
```bash
vercel login
```

### 3. 프로젝트 배포
```bash
vercel
```

### 4. 프로덕션 배포
```bash
vercel --prod
```

## 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `OPENAI_API_KEY`: OpenAI API 키
- `ANTHROPIC_API_KEY`: Anthropic API 키
- `NODE_ENV`: production

## 배포 후 확인사항

1. ✅ 스크롤 상단 이동 작동
2. ✅ 영웅 카드 가독성 확인
3. ✅ AI 분석 기능 정상 작동
4. ✅ 144 영웅 시스템 정상 작동
5. ✅ 한글화 완료 확인

## 프로젝트 특징

- **Next.js 15.4.6** 기반
- **React 19** 사용
- **Tailwind CSS** 스타일링
- **AI 분석**: OpenAI + Anthropic
- **144 영웅 시스템** 완전 구현
- **완전 한글화** 완료




