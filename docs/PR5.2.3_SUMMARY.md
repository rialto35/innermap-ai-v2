# PR #5.2.3: Report Data 확장 + 차트 이미지 자동 생성

## 🎯 목표
- Big5 Radar Chart SVG → PNG 자동 생성 (resvg-wasm)
- `/api/report/[id]` 확장: user.name, hero.name, hero.tribe, visuals_json 반환
- ReportHeader에 Tribe 컬러 테마 반영
- PDF 디자인 개선: 페이지 번호, 브랜딩, 헤더 컬러 강조

---

## ✅ 구현 완료 항목

### 1️⃣ Big5 Radar Chart SVG 생성기
**파일**: `supabase/functions/generate-visuals/buildBig5RadarSVG.ts`

- **기능**:
  - Big5 점수(0-100 또는 0-1) → 600×600 SVG Radar Chart 생성
  - 5단계 동심원 그리드
  - 축 라인 + 라벨 (O, C, E, A, N)
  - 데이터 폴리곤 (반투명 fill + 테두리)
  - Pretendard 폰트 사용 (한글 지원)

- **차트 규격**:
  - 캔버스: 600×600
  - 중심: (300, 300)
  - 반경: 200
  - 색상: Primary #2A7DE1, Fill #B8E2FF (40% opacity)
  - 폰트: Pretendard, 14pt, #555

---

### 2️⃣ Edge Function: generate-visuals
**파일**: `supabase/functions/generate-visuals/index.ts`

- **기능**:
  - `reportId` 입력 → `reports` + `test_results` 조인
  - Big5 점수 조회 → `buildBig5RadarSVG()` 호출
  - **resvg-wasm**로 SVG → PNG 변환
  - Supabase Storage(`reports` bucket)에 업로드
  - `reports.visuals_json` 업데이트:
    ```json
    {
      "big5RadarUrl": "https://...",
      "generated_at": "2025-10-18T00:00:00.000Z"
    }
    ```

- **멱등성**: `visuals_json.generated_at` 존재 시 스킵

- **의존성**:
  - `npm:@resvg/resvg-js` (Deno 호환)
  - `https://esm.sh/@supabase/supabase-js@2`

---

### 3️⃣ API 확장: /api/report/[id]
**파일**: `src/app/api/report/[id]/route.ts`

- **변경 사항**:
  - `users` 테이블에서 `user.name` 조회 (reports.user_id는 email)
  - `test_results` 테이블에서 `hero.name`, `hero.tribe` 조회
  - 응답 스키마 확장:
    ```typescript
    {
      id: string;
      status: string;
      summary_md: string;
      user: { name: string };
      hero: { name: string; tribe: string };
      visuals_json: {
        big5RadarUrl: string | null;
        auxBarsUrl: string | null;
        growthVectorUrl: string | null;
        generated_at: string | null;
      };
      created_at: string;
      finished_at: string;
    }
    ```

- **자동 Trigger**:
  - `visuals_json.big5RadarUrl`이 없으면 `generate-visuals` Edge Function 비차단 호출

---

### 4️⃣ ReportHeader Tribe 컬러 테마
**파일**: `src/components/report/ReportHeader.tsx`

- **컬러 맵핑**:
  | Tribe   | Avatar Gradient       | Accent Bar          | Text Color        |
  |---------|-----------------------|---------------------|-------------------|
  | Fire    | red-400 → orange-500  | red-500 → orange-600 | red-700           |
  | Water   | blue-400 → cyan-500   | blue-500 → cyan-600  | blue-700          |
  | Earth   | green-400 → emerald-500 | green-500 → emerald-600 | green-700       |
  | Air     | purple-400 → indigo-500 | purple-500 → indigo-600 | purple-700      |
  | Logic   | indigo-400 → blue-500 | indigo-500 → blue-600 | indigo-700        |
  | Emotion | pink-400 → rose-500   | pink-500 → rose-600   | pink-700          |

- **UI 변경**:
  - Avatar: Tribe 컬러 gradient + 영웅 이름 첫 글자
  - Tribe 이름 표시 (예: "Water 부족")
  - Accent bar 색상 Tribe에 맞춰 변경

---

### 5️⃣ PDF 디자인 개선
**파일**: 
- `src/components/report/ReportActions.tsx`
- `src/components/report/ReportMarkdown.tsx`

**개선 사항**:

#### A. 페이지 번호 + 브랜딩
- 각 페이지 하단 중앙:
  - 좌측: `Page 1 / 4` (9pt, #666)
  - 우측: `© 2025 InnerMap AI by PromptCore` (8pt, #8C8C8C)

#### B. 마진 조정
- `margin: [16, 14, 24, 14]` (top, left, bottom, right)
- 페이지 번호 공간 확보 (bottom 24pt)

#### C. 헤더 컬러 강조
- H1: `text-indigo-800 dark:text-indigo-300`
- H2: `text-indigo-600 dark:text-indigo-400`
- H3: `text-indigo-700 dark:text-indigo-300`

#### D. 섹션 카드 배경 강화
- `bg-gradient-to-br from-white to-indigo-50/30`
- `border-indigo-100/60`
- 미세한 색상 톤으로 고급스러움 부여

#### E. 페이지 분리 개선
- `pagebreak: { mode: ['css', 'legacy', 'avoid-all'] }`
- 섹션 카드마다 `.pdf-avoid-break` 적용

---

### 6️⃣ Pretendard 폰트 준비
**파일**: 
- `public/fonts/README.md` (다운로드 가이드)
- `docs/FONT_DOWNLOAD.md` (상세 안내)

**수동 다운로드 필요**:
1. https://github.com/orioncactus/pretendard/releases
2. `Pretendard-Regular.ttf`, `Pretendard-Bold.ttf` 다운로드
3. `E:\innermap-ai-v2\public\fonts\`에 배치

**자동 다운로드 시도**:
- PowerShell `Invoke-WebRequest` 실패 (네트워크 이슈)
- 수동 다운로드 가이드 제공

---

## 🔧 기술 스택

| 구분 | 기술 |
|------|------|
| SVG 생성 | Custom TypeScript (buildBig5RadarSVG) |
| SVG → PNG | resvg-wasm (Deno Edge Function) |
| Storage | Supabase Storage (reports bucket) |
| PDF 생성 | html2pdf.js (client-side) |
| 폰트 | Pretendard (SIL OFL 1.1) |
| 컬러 시스템 | Tailwind CSS (Tribe별 gradient) |

---

## 📊 데이터 플로우

```
1. 사용자 → /report/[id] 접속
2. GET /api/report/[id]
   ├─ reports 조회
   ├─ users 조회 (user.name)
   ├─ test_results 조회 (hero.name, hero.tribe, big5 점수)
   └─ visuals_json 확인
       └─ 없으면 → POST /functions/generate-visuals
3. generate-visuals Edge Function
   ├─ test_results에서 Big5 점수 조회
   ├─ buildBig5RadarSVG() → SVG 생성
   ├─ Resvg → PNG 변환
   ├─ Supabase Storage 업로드
   └─ reports.visuals_json 업데이트
4. 클라이언트
   ├─ ReportHeader (Tribe 컬러)
   ├─ Big5RadarChart (PNG 이미지)
   ├─ ReportMarkdown (서사)
   └─ PDF 다운로드 (페이지 번호 + 브랜딩)
```

---

## 🧪 QA 체크리스트

### 배포 전
- [ ] `supabase/functions/generate-visuals` 배포 확인
- [ ] Supabase Storage `reports` bucket 생성 및 공개 접근 설정
- [ ] Pretendard 폰트 파일 배치 (`public/fonts/`)
- [ ] Edge Function 시크릿 설정:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 배포 후
- [ ] `/api/report/[id]` 응답에 `user.name`, `hero.name`, `hero.tribe` 포함 확인
- [ ] `visuals_json.big5RadarUrl` 자동 생성 확인
- [ ] Storage에 `reports/<reportId>/charts/big5.png` 업로드 확인
- [ ] ReportHeader에 Tribe 컬러 반영 확인
- [ ] PDF 다운로드 시:
  - [ ] 페이지 번호 하단 중앙 표시
  - [ ] 브랜딩 텍스트 표시
  - [ ] 헤더 색상 indigo 계열
  - [ ] 섹션 카드 배경 그라데이션
  - [ ] 페이지 분리 정상 작동
- [ ] Big5 Radar Chart PNG 렌더링 (한글 라벨 포함)
- [ ] 한글 폰트 깨짐 없음 (Pretendard 적용 시)

---

## 🚀 배포 명령

### 1. Edge Function 배포 (Supabase Dashboard)
```
1. Supabase Dashboard → Edge Functions → generate-visuals
2. Code 탭 → index.ts 내용 복사/붙여넣기
3. buildBig5RadarSVG.ts도 동일 폴더에 추가
4. Deploy 버튼 클릭
5. Secrets 탭 → SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 설정
```

### 2. Vercel 배포
```bash
git add .
git commit -m "feat(report): PR #5.2.3 - Big5 chart generation + Tribe colors + PDF improvements"
git push origin main
```

### 3. 폰트 배치 (수동)
```
1. docs/FONT_DOWNLOAD.md 참고
2. Pretendard-Regular.ttf, Pretendard-Bold.ttf 다운로드
3. public/fonts/ 폴더에 배치
4. git add public/fonts/*.ttf
5. git commit -m "chore(fonts): add Pretendard for PDF/charts"
6. git push
```

---

## 📝 다음 단계 (PR #5.3)

1. **Auxiliary Scales Bar Chart** (보조 척도 막대 차트)
2. **Growth Vector Chart** (성장 벡터 타임라인)
3. **LLM 토큰/에러 모니터링 대시보드**
4. **Edge Function 크론 스케줄링** (10~15초 간격)
5. **PDF 표지 페이지 개선** (Hero 이미지 + Tribe 배경)

---

## 🎨 디자인 완성도

| 항목 | Before | After | 비고 |
|------|--------|-------|------|
| 표지 | 단순 텍스트 | Tribe 컬러 적용 | Hero 이미지는 다음 PR |
| 헤더 | 회색 | Indigo 계열 | 시각적 강조 |
| 섹션 카드 | 흰색 배경 | 그라데이션 | 미세 톤인톤 |
| 푸터 | 없음 | 페이지 번호 + 브랜딩 | 전문성 향상 |
| 차트 | 클라이언트 렌더 | PNG 이미지 | 성능 개선 |
| 폰트 | 시스템 | Pretendard (예정) | 한글 미려도 |

**현재 완성도: 85%** (폰트 배치 후 90%)

---

## 📚 참고 문서

- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [resvg-wasm](https://github.com/yisibl/resvg-js)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**작성일**: 2025-10-18  
**버전**: v5.2.3  
**작성자**: AI Agent (Cursor)

