# 로컬 개발 환경 설정 가이드

## 문제: 로그인 시 프로덕션 사이트로 리다이렉트

로컬 개발 환경에서 Google OAuth 로그인 시 프로덕션 사이트로 리다이렉트되는 문제 해결 방법입니다.

## 해결 방법

### 1. 환경 변수 수정

`.env.local` 파일에서 `NEXTAUTH_URL`을 로컬 환경으로 변경:

```bash
# 기존 (프로덕션)
NEXTAUTH_URL="https://innermap-ai-v2.vercel.app"

# 변경 (로컬 개발)
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Google Cloud Console 설정

Google Cloud Console에서 OAuth 2.0 클라이언트 ID 설정:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. "APIs & Services" > "Credentials" 이동
4. OAuth 2.0 클라이언트 ID 편집
5. "승인된 리다이렉트 URI"에 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 3. 개발 서버 재시작

환경 변수 변경 후 개발 서버를 재시작:

```bash
npm run dev
```

## 환경별 설정 분리

### 로컬 개발 환경
- `NEXTAUTH_URL="http://localhost:3000"`
- `NEXT_PUBLIC_BASE_URL="http://localhost:3000"`

### 프로덕션 환경
- `NEXTAUTH_URL="https://innermap-ai-v2.vercel.app"`
- `NEXT_PUBLIC_BASE_URL="https://innermap-ai-v2.vercel.app"`

## 확인 방법

1. 로컬에서 `npm run dev` 실행
2. `http://localhost:3000` 접속
3. 로그인 시도
4. `http://localhost:3000`으로 리다이렉트되는지 확인

## 주의사항

- 로컬 개발 시에는 반드시 `NEXTAUTH_URL`을 `http://localhost:3000`으로 설정
- 프로덕션 배포 전에는 다시 프로덕션 URL로 변경 필요
- Google OAuth 설정에서 로컬 URI가 승인되어야 함
