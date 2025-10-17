# PR #5.2.3 QA 테스트 스크립트

## 🎯 테스트 목표
- Big5 Radar Chart 자동 생성 확인
- Tribe 컬러 테마 적용 확인
- PDF 다운로드 품질 확인

---

## ✅ 사전 준비

1. **프로덕션 환경 접속**
   - URL: https://innermap-ai-v2.vercel.app
   - Google 계정으로 로그인

2. **브라우저 개발자 도구 열기**
   - `F12` 또는 `Ctrl+Shift+I`
   - Console 탭 열기
   - Network 탭 열기

3. **Supabase Dashboard 준비**
   - Edge Functions → `generate-visuals` → Logs 탭 열기
   - Storage → `reports` bucket 열기

---

## 📋 테스트 1: 새 분석 수행

### 1-1. 분석 시작
1. `/analyze` 페이지 이동
2. 모든 질문 응답 (자동 진행 확인)
3. 마지막 질문 응답 후 자동 제출 확인

### 1-2. 결과 ID 확인
분석 완료 후 URL 확인:
```
/result/[result-id]
```

**result-id 복사**: `____________________`

---

## 📋 테스트 2: 리포트 생성

### 2-1. 리포트 생성 요청

**브라우저 Console에서 실행:**

```javascript
// 1. 리포트 생성 요청
const resultId = '[위에서 복사한 result-id]';

const response = await fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resultId })
});

const data = await response.json();
console.log('✅ 리포트 생성:', data);

// reportId 저장
const reportId = data.reportId;
console.log('📝 Report ID:', reportId);
```

**기대 결과:**
```json
{
  "reportId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "status": "queued"
}
```

**reportId 복사**: `____________________`

---

### 2-2. 리포트 상태 확인 (10~30초 대기)

**Console에서 실행:**

```javascript
// 2. 리포트 상태 폴링 (10초마다)
async function checkReportStatus() {
  const res = await fetch(`/api/report/${reportId}`);
  const report = await res.json();
  console.log('📊 Status:', report.status);
  
  if (report.status === 'ready') {
    console.log('✅ 리포트 생성 완료!');
    console.log('🎨 Visuals:', report.visuals_json);
    return report;
  } else if (report.status === 'failed') {
    console.error('❌ 리포트 생성 실패:', report.error_msg);
    return report;
  } else {
    console.log('⏳ 생성 중... 10초 후 재시도');
    setTimeout(checkReportStatus, 10000);
  }
}

checkReportStatus();
```

**체크리스트:**
- [ ] `status: "processing"` → `status: "ready"` 전환 확인
- [ ] `visuals_json.big5RadarUrl` 존재 확인
- [ ] `visuals_json.generated_at` 타임스탬프 확인

---

### 2-3. Supabase Logs 확인

**Supabase Dashboard → Edge Functions → generate-visuals → Logs**

확인 항목:
- [ ] `[generate-visuals]` 로그 출력
- [ ] `reportId` 일치 확인
- [ ] `Big5 radar 생성됨` 또는 유사 메시지
- [ ] 에러 없음

---

### 2-4. Storage 확인

**Supabase Dashboard → Storage → reports bucket**

경로: `reports/[reportId]/charts/big5.png`

확인 항목:
- [ ] `big5.png` 파일 존재
- [ ] 파일 크기: ~10~50KB
- [ ] 이미지 미리보기 정상 (600×600 레이더 차트)

---

## 📋 테스트 3: /report/[id] 페이지

### 3-1. 페이지 접속

**URL 직접 입력:**
```
https://innermap-ai-v2.vercel.app/report/[reportId]
```

또는 **Console에서 이동:**
```javascript
window.location.href = `/report/${reportId}`;
```

---

### 3-2. 시각적 확인

#### ✅ 헤더 영역
- [ ] 사용자 이름 표시
- [ ] Hero 이름 표시
- [ ] **Tribe 이름 표시** (예: "Logic Tribe")
- [ ] **Tribe 컬러 gradient 배경** (예: 블루 계열)
- [ ] 생성 날짜 표시

#### ✅ Big5 Radar Chart
- [ ] 이미지 로딩 (최초 10~30초 소요 가능)
- [ ] 600×600 크기 차트 표시
- [ ] 5개 축 (O, C, E, A, N) 라벨 표시
- [ ] 파란색 폴리곤 (#2A7DE1)
- [ ] 반투명 채우기 (#B8E2FF)

#### ✅ 본문 서사
- [ ] Markdown 렌더링 정상
- [ ] 섹션 카드 스타일 (gradient 배경, 둥근 모서리)
- [ ] H2 헤더 컬러 (#2A7DE1)
- [ ] 리스트 bullet 표시
- [ ] 여백 및 줄간격 적절

#### ✅ 액션 버튼
- [ ] "PDF 다운로드" 버튼 표시
- [ ] "공유하기" 버튼 표시
- [ ] "대시보드로" 버튼 표시

---

### 3-3. Network 탭 확인

**F12 → Network 탭**

확인 항목:
- [ ] `/api/report/[id]` → 200 OK
- [ ] `big5.png` → 200 OK (Supabase Storage URL)
- [ ] 이미지 크기: ~10~50KB
- [ ] 로딩 시간: < 2초

---

### 3-4. Console 에러 확인

**F12 → Console 탭**

확인 항목:
- [ ] 에러 없음 (빨간색 메시지 없음)
- [ ] 경고 최소화 (노란색 메시지)

---

## 📋 테스트 4: PDF 다운로드

### 4-1. PDF 생성

**리포트 페이지에서:**
1. "PDF 다운로드" 버튼 클릭
2. 생성 중 로딩 표시 확인 (2~5초)
3. 파일 다운로드 확인

**파일명 확인:**
```
InnerMap_Report_[사용자이름]_[날짜].pdf
```

---

### 4-2. PDF 품질 확인

**다운로드한 PDF 열기:**

#### ✅ 표지 (Page 1)
- [ ] "InnerMap AI" 타이틀
- [ ] 사용자 이름
- [ ] Hero 이름
- [ ] Tribe 이름
- [ ] 생성 날짜
- [ ] **Tribe 컬러 gradient 헤더**

#### ✅ 본문 (Page 2~N)
- [ ] **한글 폰트 정상 렌더링** (Pretendard)
- [ ] 깨진 글자 없음 (□□□ 없음)
- [ ] 줄간격 적절 (1.6~1.7)
- [ ] 여백 적절 (상하 48pt, 좌우 36pt)

#### ✅ Big5 Radar Chart
- [ ] **차트 이미지 삽입됨**
- [ ] 선명도 양호 (600×600)
- [ ] 컬러 정상 (파란색 계열)
- [ ] 라벨 가독성 양호

#### ✅ 섹션 스타일
- [ ] H2 헤더 컬러 (#2A7DE1)
- [ ] 섹션 카드 배경 (연한 그라데이션)
- [ ] 둥근 모서리 (border-radius)
- [ ] 그림자 효과 (box-shadow)

#### ✅ 푸터 (모든 페이지)
- [ ] **"InnerMap AI © 2025 PromptCore"** 텍스트
- [ ] **페이지 번호** (예: "Page 1 / 4")
- [ ] 중앙 정렬
- [ ] 회색 텍스트 (#888)

#### ✅ 페이지 분할
- [ ] 섹션 단위로 페이지 나뉨
- [ ] 중간에 잘린 텍스트 없음
- [ ] 빈 페이지 없음

---

### 4-3. PDF 파일 크기

**파일 속성 확인:**
- [ ] 파일 크기: 200KB ~ 2MB (적정 범위)
- [ ] 페이지 수: 3~6 페이지 (일반적)

---

## 📋 테스트 5: 공유 기능

### 5-1. 공유 버튼 클릭

**리포트 페이지에서:**
1. "공유하기" 버튼 클릭
2. Web Share API 지원 확인

**모바일/지원 브라우저:**
- [ ] 시스템 공유 다이얼로그 표시
- [ ] 링크 복사 옵션 표시

**데스크톱/미지원 브라우저:**
- [ ] 클립보드 복사 알림 표시
- [ ] 링크 복사 확인

### 5-2. 공유 링크 확인

**복사된 링크:**
```
https://innermap-ai-v2.vercel.app/report/[reportId]
```

**새 시크릿 창에서 테스트:**
- [ ] 링크 접속 시 로그인 요구
- [ ] 로그인 후 리포트 표시
- [ ] 본인 리포트만 접근 가능 (권한 확인)

---

## 📋 테스트 6: 엣지 케이스

### 6-1. 중복 생성 방지 (멱등성)

**Console에서 실행:**
```javascript
// 같은 resultId로 2번 호출
const res1 = await fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resultId })
});
const data1 = await res1.json();

const res2 = await fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resultId })
});
const data2 = await res2.json();

console.log('첫 번째:', data1.reportId);
console.log('두 번째:', data2.reportId);
console.log('동일?', data1.reportId === data2.reportId);
```

**기대 결과:**
- [ ] 같은 `reportId` 반환
- [ ] 중복 리포트 생성 안 됨

---

### 6-2. 비로그인 접근

**시크릿 창에서:**
1. `/report/[reportId]` 직접 접속
2. 로그인 페이지로 리다이렉트 확인

**기대 결과:**
- [ ] 401 Unauthorized 또는 로그인 페이지로 이동
- [ ] 리포트 내용 노출 안 됨

---

### 6-3. 타인 리포트 접근

**다른 계정으로 로그인 후:**
1. 다른 사용자의 `reportId` 접속 시도

**기대 결과:**
- [ ] 403 Forbidden 에러
- [ ] "권한이 없습니다" 메시지

---

## 📊 테스트 결과 요약

### ✅ 통과 항목
- [ ] Edge Function 배포 및 실행
- [ ] Big5 Radar Chart 자동 생성
- [ ] Storage 업로드 및 Public URL
- [ ] Tribe 컬러 테마 적용
- [ ] PDF 다운로드 (한글 폰트)
- [ ] PDF Big5 차트 이미지 삽입
- [ ] PDF 푸터 및 페이지 번호
- [ ] 공유 기능
- [ ] 멱등성 (중복 방지)
- [ ] 권한 검증

### ❌ 실패 항목
(발견된 이슈 기록)

---

### 🐛 발견된 버그
(있으면 기록)

---

### 💡 개선 제안
(있으면 기록)

---

## 🎯 최종 승인 체크리스트

- [ ] 모든 테스트 통과
- [ ] 치명적 버그 없음
- [ ] 성능 이슈 없음 (< 30초 전체 파이프라인)
- [ ] UX 이슈 없음
- [ ] 프로덕션 배포 준비 완료

---

**테스트 완료 일시**: _______________  
**테스터**: _______________  
**승인 여부**: [ ] 승인 / [ ] 조건부 승인 / [ ] 재작업 필요

