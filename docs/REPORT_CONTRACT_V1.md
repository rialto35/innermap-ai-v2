# Report Contract v1 - 릴리즈 노트

## 🎯 **핵심 개선사항**

### ✅ **단일 리포트 계약(Report Contract v1)**
- **검사 직후**와 **내 결과**를 동일한 데이터 구조로 처리
- `ReportV1` 타입으로 모든 리포트 데이터 통일
- 엔진 버전, 가중치 버전, 생성 시간 등 메타 정보 표준화

### ✅ **라우팅 표준화**
- `/report/:id?tab=summary|deep` 단일 진입점 채택
- 검사 완료 후 자동으로 `/report/:id?tab=summary`로 리다이렉트
- URL 쿼리 키는 `tab`으로 고정 (혼용 금지)

### ✅ **API 통일**
- `GET /api/reports/:id?include=deep` - 단일 리포트 조회
- `POST /api/reports/:id/deep` - 전체 심층 생성 트리거
- `POST /api/reports/:id/deep/:module` - 모듈 단일 생성 트리거
- `GET /api/reports?owner=me&limit=...` - 리포트 리스트 조회
- `POST /api/share/:id` - 공유 링크 발급

### ✅ **UI 렌더러 통일**
- `ReportSummary` 컴포넌트: 검사 직후 + 요약 탭에서 동일 사용
- `ReportDeep` 컴포넌트: 심층 분석 허브 (그리드 카드 + 모듈 트리거 + 상태 뱃지)
- 둘 다 `ReportV1`를 props로 받게 구성

### ✅ **DB 구조 보강**
- `reports_deep` 테이블 추가 (심층 모듈 상태, 내러티브, 차트)
- FK + RLS 정책 적용
- 공유 관련 컬럼 추가 (`share_id`, `share_scope`, `share_expires_at`)

### ✅ **E2E 테스트**
- "검사직후 ↔ 요약 탭" DOM 동등성 테스트
- "심층 모듈 생성 → ready 표시" 흐름 테스트
- 권한·공유 테스트
- 버전 호환성 테스트

## 🔧 **기술적 세부사항**

### **ReportV1 스키마**
```typescript
type ReportV1 = {
  id: string;
  ownerId: string;
  meta: {
    version: "v1.0.0" | "v1.1.0" | "v1.3.1";
    engineVersion: string;
    weightsVersion: string;
    generatedAt: string;
  };
  scores: {
    big5: { o: number; c: number; e: number; a: number; n: number };
    mbti: string;
    reti: number;
    inner9: Array<{ label: string; value: number }>;
  };
  summary: {
    highlight: string;
    bullets: string[];
  };
  deep?: {
    modules: Record<DeepKey, DeepState>;
    narrative?: string;
    resources?: {
      charts: {
        big5?: string;
        inner9?: string;
      };
    };
  };
};
```

### **라우팅 규칙**
- **결과 상세**: `/report/:id?tab=summary` (기본)
- **심층 허브**: `/report/:id?tab=deep`
- **내 결과 목록**: `/results` (요약만 표시)

### **API 응답 형식**
- 모든 API는 `ReportV1` 일부/전체를 반환
- 검사 직후 보여주는 페이지도 동일한 API에서 가져온 같은 형태 사용

### **UI 동작 규칙**
- **요약 탭**: scores, summary 직접 표시, 차트 있으면 사용
- **심층 탭**: 6개 카드, 상태 뱃지, 카드 클릭 → POST /deep/:module 실행
- **표준 문구**: 리포트 하단 안내, 공유 범위, 스토리지 경로 텍스트 동일

## 🚀 **배포 및 마이그레이션**

### **DB 마이그레이션**
```sql
-- reports_deep 테이블 생성
create table if not exists reports_deep (
  report_id uuid primary key references reports(id) on delete cascade,
  modules jsonb not null default '{
    "cognition":"pending","communication":"pending","goal":"pending",
    "relation":"pending","energy":"pending","growth":"pending"
  }',
  narrative text,
  resources jsonb,
  updated_at timestamptz default now()
);

-- RLS 정책 적용
alter table reports_deep enable row level security;
create policy "owner_readwrite_reports_deep" on reports_deep
  for all using (auth.uid() = (select user_id from reports where id = report_id))
  with check (auth.uid() = (select user_id from reports where id = report_id));
```

### **버전 호환성**
- v1.0.0 저장본도 동일 탭·동일 컴포넌트로 렌더
- 심층은 CTA만 표시 (기존 데이터)
- 엔진 버전, 가중치 버전, 생성 시간 항상 포함

## 📊 **성능 및 품질**

### **결정성 보장**
- im-core v1.3.1 무결성 확장 세트 적용
- Double-Buffer Verification
- Checksum Pipeline
- Cross-Language Validator

### **회귀 방지**
- E2E 테스트로 동등성 보장
- "검사 직후"와 "내 결과" DOM 텍스트·키 수치 완전 동일
- engineVersion/weightsVersion/generatedAt 포함

## 🎉 **사용자 경험 개선**

### **통일된 경험**
- 검사 완료 후와 내 결과에서 동일한 UI/UX
- 일관된 데이터 구조와 표시 방식
- 직관적인 탭 전환과 심층 분석 생성

### **확장성**
- 모듈별 심층 분석 생성
- 공유 링크 발급 및 권한 관리
- 차트 리소스 관리

---

**Report Contract v1**으로 InnerMap AI의 리포트 시스템이 완전히 통일되었습니다! 🎯

**Claude Sonnet 4.5**
