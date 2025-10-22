# OAuth 설정 가이드

## 카카오 로그인 설정

### 1. 카카오 개발자 콘솔 접속
- [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
- 카카오 계정으로 로그인

### 2. 애플리케이션 등록
1. **내 애플리케이션** → **애플리케이션 추가하기**
2. **앱 이름**: `InnerMap AI`
3. **사업자명**: `PromptCore` (또는 개인명)
4. **카테고리**: `기타` 선택

### 3. 플랫폼 설정
1. **앱 설정** → **플랫폼** 탭
2. **Web 플랫폼 등록**:
   - **사이트 도메인**: `http://localhost:3000` (개발용)
   - **사이트 도메인**: `https://yourdomain.com` (프로덕션용)

### 4. 제품 설정
1. **제품 설정** → **카카오 로그인** 활성화
2. **카카오 로그인** → **동의항목** 설정:
   - **닉네임** (필수)
   - **프로필 사진** (선택)
   - **카카오계정(이메일)** (선택)

### 5. Redirect URI 설정
1. **제품 설정** → **카카오 로그인** → **Redirect URI**
2. 다음 URI 추가:
   ```
   http://localhost:3000/api/auth/callback/kakao
   https://yourdomain.com/api/auth/callback/kakao
   ```

### 6. 앱 키 확인
1. **앱 설정** → **앱 키** 탭
2. **REST API 키** 복사 → `KAKAO_CLIENT_ID`
3. **Client Secret** 생성 → `KAKAO_CLIENT_SECRET`

---

## 네이버 로그인 설정

### 1. 네이버 개발자 센터 접속
- [네이버 개발자 센터](https://developers.naver.com/) 접속
- 네이버 계정으로 로그인

### 2. 애플리케이션 등록
1. **Application** → **애플리케이션 등록**
2. **애플리케이션 이름**: `InnerMap AI`
3. **사용 API**: `네이버 아이디로 로그인` 선택
4. **서비스 환경**: `Web` 선택

### 3. 서비스 URL 설정
1. **서비스 URL**: `http://localhost:3000` (개발용)
2. **서비스 URL**: `https://yourdomain.com` (프로덕션용)

### 4. Callback URL 설정
1. **Callback URL** 추가:
   ```
   http://localhost:3000/api/auth/callback/naver
   https://yourdomain.com/api/auth/callback/naver
   ```

### 5. 동의항목 설정
1. **네이버 아이디로 로그인** → **동의항목** 설정:
   - **이름** (필수)
   - **이메일 주소** (선택)
   - **프로필 사진** (선택)

### 6. 클라이언트 정보 확인
1. **애플리케이션 정보** 탭
2. **Client ID** 복사 → `NAVER_CLIENT_ID`
3. **Client Secret** 복사 → `NAVER_CLIENT_SECRET`

---

## 환경 변수 설정

### .env.local 파일에 추가
```bash
# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### Vercel 환경 변수 설정
1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 위의 환경 변수들을 추가

---

## 테스트 방법

### 1. 개발 환경에서 테스트
```bash
npm run dev
```
- `http://localhost:3000/login` 접속
- 각 소셜 로그인 버튼 클릭하여 테스트

### 2. 프로덕션 환경에서 테스트
- 도메인을 OAuth 앱에 등록
- 환경 변수 설정 후 배포
- 실제 로그인 플로우 테스트

---

## 트러블슈팅

### 카카오 로그인 오류
- **Redirect URI 불일치**: 카카오 개발자 콘솔에서 정확한 URI 등록 확인
- **동의항목 누락**: 필수 동의항목이 모두 설정되었는지 확인
- **Client Secret 누락**: 앱 키에서 Client Secret 생성 필요

### 네이버 로그인 오류
- **Callback URL 불일치**: 네이버 개발자 센터에서 정확한 URL 등록 확인
- **서비스 URL 불일치**: 등록된 서비스 URL과 실제 도메인 일치 확인
- **동의항목 설정**: 필수 동의항목 설정 확인

### 일반적인 오류
- **환경 변수 누락**: `.env.local` 파일에 모든 OAuth 키가 설정되었는지 확인
- **도메인 불일치**: 개발/프로덕션 환경의 도메인이 OAuth 앱에 등록되었는지 확인
- **HTTPS 요구사항**: 프로덕션에서는 HTTPS 필수

---

## 보안 고려사항

1. **Client Secret 보안**: 절대 클라이언트 코드에 노출하지 않음
2. **환경 변수 관리**: `.env.local` 파일을 `.gitignore`에 포함
3. **도메인 검증**: OAuth 앱에 정확한 도메인만 등록
4. **권한 최소화**: 필요한 최소한의 동의항목만 요청

---

**작성일**: 2025-10-19  
**버전**: 1.0.0  
**작성자**: AI Assistant (Claude Sonnet 4.5)

