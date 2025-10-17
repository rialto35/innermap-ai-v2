# PR #5.2.3 배포 가이드

## 📦 완료된 작업

### ✅ 코드 구현 (완료)
- [x] Big5 Radar SVG builder (`buildBig5RadarSVG.ts`)
- [x] `generate-visuals` Edge Function (resvg-wasm 통합)
- [x] `/api/report/[id]` 확장 (user, hero, visuals_json)
- [x] ReportHeader tribe 컬러 테마
- [x] PDF 디자인 개선 (표지, 푸터, 페이지 번호)
- [x] React 19 충돌 해결 (@react-pdf/renderer 제거)
- [x] Pretendard 폰트 추가 (2.6MB Regular + Bold)

### ✅ Git 커밋 (완료)
```bash
f76e3d1 - chore: add Pretendard fonts for PDF rendering and chart labels
7f461b4 - fix(deps): remove @react-pdf/renderer causing React 19 conflict
8eb7fcc - feat(report): Big5 radar SVG + resvg-wasm + PDF enhancements
```

---

## 🚀 수동 배포 필요 항목

### 1️⃣ Supabase Edge Function 배포

#### 방법 A: GitHub 자동 배포 (추천)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Edge Functions 메뉴**
   - 좌측 메뉴 → "Edge Functions"
   - "Deploy from GitHub" 버튼 클릭

3. **GitHub 연동 설정**
   - Repository: `rialto35/innermap-ai-v2`
   - Branch: `main`
   - Function path: `supabase/functions/generate-visuals`
   - "Enable automatic deployments" 체크
   - Deploy 버튼 클릭

4. **배포 확인**
   - Functions 목록에서 `generate-visuals` 상태 확인
   - Logs 탭에서 배포 로그 확인

#### 방법 B: 수동 배포 (Dashboard)

1. **함수 생성**
   - Edge Functions → "Create a new function"
   - Function name: `generate-visuals`

2. **코드 복사**
   - `supabase/functions/generate-visuals/index.ts` (116줄)
   - `supabase/functions/generate-visuals/buildBig5RadarSVG.ts` (147줄)
   - Dashboard 에디터에 붙여넣기

3. **배포**
   - "Deploy function" 버튼 클릭

---

### 2️⃣ Secrets 설정 (필수)

**Edge Functions → Settings → Secrets**

| Secret Name | Value | 위치 |
|------------|-------|------|
| `SUPABASE_URL` | `https://[project-ref].supabase.co` | Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Settings → API → service_role key |

⚠️ **주의**: Service Role Key는 절대 클라이언트에 노출하지 마세요!

---

### 3️⃣ Storage Bucket 확인

**Storage → Buckets**

- `reports` bucket이 존재하는지 확인
- Public access 설정 확인
- 없으면 생성:
  ```sql
  -- SQL Editor에서 실행
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('reports', 'reports', true);
  ```

---

## 🧪 QA 체크리스트

### ✅ 1. Edge Function 동작 확인

**Supabase Dashboard → Edge Functions → generate-visuals → Logs**

테스트 호출:
```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/generate-visuals \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"reportId":"[실제-report-id]"}'
```

기대 결과:
```json
{
  "ok": true,
  "reportId": "...",
  "updates": {
    "big5RadarUrl": "https://[project-ref].supabase.co/storage/v1/object/public/reports/.../big5.png",
    "generated_at": "2025-10-17T..."
  }
}
```

---

### ✅ 2. /report/[id] 페이지 테스트

**프로덕션 환경에서 확인:**

1. **새 분석 수행**
   - `/analyze` 완료
   - 결과 ID 확인

2. **리포트 생성**
   ```javascript
   // 브라우저 콘솔에서
   const res = await fetch('/api/report', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ resultId: '[result-id]' })
   });
   const data = await res.json();
   console.log(data); // { reportId: "...", status: "queued" }
   ```

3. **리포트 페이지 접속**
   - `/report/[report-id]` 이동
   - 10~30초 대기 (LLM + 시각화 생성)

4. **확인 항목**
   - [ ] Tribe 컬러 gradient 정상 표시
   - [ ] Big5 Radar 이미지 로딩
   - [ ] 브라우저 Network 탭: `big5.png` 200 OK
   - [ ] Markdown 본문 렌더링
   - [ ] 섹션 카드 스타일 적용

---

### ✅ 3. PDF 다운로드 테스트

**리포트 페이지에서 "PDF 다운로드" 버튼 클릭**

확인 항목:
- [ ] 다운로드 파일명: `InnerMap_Report_[name]_[date].pdf`
- [ ] 한글 폰트 정상 렌더링 (Pretendard)
- [ ] Big5 Radar 차트 이미지 삽입
- [ ] 푸터: "InnerMap AI © 2025 PromptCore"
- [ ] 페이지 번호: "Page 1 / N"
- [ ] 다중 페이지 정상 분할
- [ ] 섹션 카드 gradient 배경
- [ ] Tribe 컬러 헤더

---

## 🐛 트러블슈팅

### Edge Function 404 에러
```
Error: Function not found
```
**해결**: Dashboard에서 함수 배포 확인, 이름이 정확히 `generate-visuals`인지 확인

---

### Big5 이미지 로딩 실패
```
Failed to load image: 404 Not Found
```
**원인**: 
1. Edge Function이 호출되지 않음
2. Storage bucket 권한 문제
3. `visuals_json`이 업데이트되지 않음

**해결**:
1. Edge Function Logs 확인
2. Storage → reports bucket → Public access 확인
3. SQL Editor에서 `reports.visuals_json` 확인:
   ```sql
   SELECT id, visuals_json FROM reports WHERE id = '[report-id]';
   ```

---

### PDF 한글 깨짐
```
한글이 □□□로 표시됨
```
**원인**: Pretendard 폰트 미적용

**해결**:
1. `public/fonts/Pretendard-Regular.ttf` 파일 존재 확인
2. Vercel 배포 로그에서 폰트 파일 업로드 확인
3. 브라우저 Network 탭에서 폰트 로딩 확인

---

### PDF 빈 페이지 생성
```
첫 페이지가 비어있음
```
**원인**: `html2pdf.js` 스크롤 위치 문제

**해결**: 이미 수정됨 (`window.scrollTo(0, 0)`)
- 캐시 클리어 후 재시도
- Vercel 배포 시 "Ignore build cache" 체크

---

## 📊 성능 지표

### 예상 처리 시간
- **LLM 분석**: 10~20초 (gpt-4-turbo-preview)
- **시각화 생성**: 3~5초 (resvg PNG 변환)
- **PDF 다운로드**: 2~3초 (클라이언트 렌더링)
- **전체 파이프라인**: 15~30초

### 리소스 사용량
- **Edge Function**: ~50MB 메모리, ~2초 실행
- **Storage**: ~50KB per report (Big5 PNG)
- **LLM 토큰**: ~2,000 tokens per report

---

## 🎯 다음 단계: PR #5.2.4

현재 MVP 완성 후, 디자인 고도화:

1. **Hero 일러스트 표지**
   - `hero.image_url` → PDF 표지 중앙
   - Tribe 컬러 배경

2. **Markdown 컬러 테마**
   - H2/H3 헤더 #2A7DE1
   - 리스트 bullet 커스터마이징

3. **보조척도 막대 차트**
   - Flow, Affect, Control 등
   - 수평 막대 그래프

4. **성장벡터 차트**
   - 4분면 scatter plot
   - 현재 위치 + 목표 위치

---

## 📝 체크리스트 요약

- [x] 코드 구현 완료
- [x] Git 커밋 및 푸시
- [x] Pretendard 폰트 추가
- [ ] **Supabase Edge Function 배포** ← 수동 작업 필요
- [ ] **Secrets 설정** ← 수동 작업 필요
- [ ] Storage bucket 확인
- [ ] QA: /report/[id] 로드 테스트
- [ ] QA: PDF 다운로드 테스트

---

**배포 완료 후 이 문서를 업데이트해주세요!** ✅

