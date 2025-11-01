# IM-Core v3.0 - Research Prototype

## ⚠️ 중요 면책 조항

**이 엔진은 연구용 프로토타입입니다.**

### 목적
- **자기이해 및 코칭 목적**의 참고 자료
- 연구 및 프로토타입 테스트
- 이론적 타당성 검증

### 검증되지 않은 사항
- ❌ 실제 피험자 데이터 부족 (n < 100)
- ❌ 통계적 신뢰도 미검증 (Cronbach's α, 재검사 신뢰도)
- ❌ 측정불변성 미확인 (성별/연령/문화)
- ❌ IRT 파라미터 미추정 (간소화 공식 사용)
- ❌ 외적 준거 타당도 미검증

### 사용 금지
- 🚫 **임상 진단 또는 치료 결정**
- 🚫 **채용, 승진, 선발 등 의사결정**
- 🚫 **법적 또는 공식 평가**
- 🚫 **교육 배치 또는 자격 판정**

### 권장 사항
- ✅ 결과를 참고용으로만 활용
- ✅ 전문가 상담 병행
- ✅ 100명 이상 파일럿 테스트 필요
- ✅ 심리학 전문가 검토 필수

---

## 📋 개요

### 설계 원칙

**측정 코어 (Core Measurement)**
- Big5 60문항 (BFI-2 구조 참조)
- 5개 영역 × 3개 파셋 × 4문항
- 등가가중 (1/N) 기본
- CTT + IRT 간소화

**해석 레이어 (Interpretation Layer)**
- MBTI: Big5 → 로지스틱 확률 매핑
- Enneagram: Big5 → softmax Top-3 후보
- Inner9: Big5 파셋 → 합성지표

### 이론적 근거

| 항목 | 참조 |
|------|------|
| Big5 구조 | Soto & John (2017) - BFI-2 |
| 등가가중 | Dawes (1979) - 단순 모형의 견고성 |
| IRT 기본 | Embretson & Reise (2000, 2013) |
| MBTI 주의점 | Pittenger (2005) |
| Enneagram 검토 | Hook et al. (2021) |
| 측정불변성 | Meredith (1993) |

---

## 🧩 구조

### 파일 구조

```
src/core/im-core-v3/
├── index.ts              # runIMCoreV3() 메인 엔트리
├── types.ts              # 타입 정의
├── items60-v3.ts         # 60문항
├── config.json           # 가중치 템플릿
├── big5-v3.ts            # Big5 채점 (CTT + IRT)
├── mbti-mapper.ts        # Big5 → MBTI 로지스틱
├── ennea-mapper.ts       # Big5 → Enneagram softmax
├── inner9-v3.ts          # Big5 파셋 → Inner9 합성
└── validator.ts          # 검증 스크립트
```

### 데이터 흐름

```
60문항 응답 (Likert 1-5)
    ↓
[Big5 채점]
  - 역문항 변환
  - 파셋별 평균 (1/4)
  - 영역별 평균 (1/3)
  - IRT θ 추정
  - 95% CI 계산
    ↓
[해석 레이어]
  ├─ MBTI: 로지스틱 확률 (4축 독립)
  ├─ Enneagram: softmax Top-3
  └─ Inner9: 파셋 조합 (등가가중)
    ↓
[최종 결과]
  - Big5 점수 + CI
  - MBTI 유형 + 확률 + 경계
  - Enneagram Top-3 + 확신도
  - Inner9 9개 지표 + CI
```

---

## 📊 60문항 구조

### Big5 영역 및 파셋

| 영역 | 파셋 | 문항 수 | 역문항 |
|------|------|---------|--------|
| **O (개방성)** | 지적호기심, 미적감수성, 혁신성 | 12 | 6 |
| **C (성실성)** | 정리정돈, 끈기·근면, 자기통제 | 12 | 6 |
| **E (외향성)** | 사회성, 활력·활동성, 주도성 | 12 | 6 |
| **A (우호성)** | 공감·이타, 협동·신뢰, 겸손·배려 | 12 | 6 |
| **N (신경성)** | 불안, 충동·민감, 스트레스 취약 | 12 | 6 |
| **합계** | **15개 파셋** | **60** | **30 (50%)** |

### 응답 척도

- **1**: 전혀 아니다
- **2**: 아니다
- **3**: 보통이다
- **4**: 그렇다
- **5**: 매우 그렇다

### 역문항 변환

```
x' = 6 - x
```

---

## 🧮 채점 방법

### 1. Big5 채점 (등가가중)

#### 파셋 점수
```
파셋 평균 = Σ(문항 점수) / 4
파셋 T-score = (파셋 평균 - 1) * 25
```

#### 영역 점수
```
영역 평균 = (파셋1 + 파셋2 + 파셋3) / 3
```

#### IRT θ 추정 (간소화)
```
θ = (영역 점수 - 50) / 10
```

#### 95% 신뢰구간
```
CI = θ ± 1.96 * SE
SE ≈ 0.3 (간소화)
```

### 2. MBTI 매핑 (로지스틱)

#### 4축 독립 확률
```
P(E) = σ(0.9*sociability + 0.5*vitality + 0.3*assertiveness - 0.2*anxiety)
P(N) = σ(0.6*innovation + 0.6*curiosity - 0.2*order)
P(F) = σ(-0.3*modesty - 0.7*empathy + 0.2*assertiveness - 0.2*cooperation)
P(P) = σ(0.8*order + 0.7*self_control + 0.3*grit - 0.2*innovation)

σ(x) = 1 / (1 + exp(-x))
```

#### 유형 결정
```
type = (E>0.5?"E":"I") + (N>0.5?"N":"S") + (F>0.5?"F":"T") + (P>0.5?"P":"J")
```

#### 경계 플래그
```
boundary = 0.4 < P(축) < 0.6
```

### 3. Enneagram 매핑 (softmax)

#### 유형별 점수
```
score(type) = Σ w_i * z_i + MBTI_prior
```

#### Softmax 확률화
```
P(type) = exp(score) / Σ exp(score_j)
```

#### Top-3 추출
```
candidates = sorted(P, descending)[:3]
```

### 4. Inner9 합성 (등가가중)

#### 지표별 계산
```
지표 = Σ(w_i * 파셋_z_i) / Σ|w_i|
T-score = 50 + 10 * z
```

#### 9개 지표
1. 탐구심: curiosity(1.0) + innovation(0.5) + aesthetic(0.3)
2. 자기통제: self_control(1.0) + order(0.6) + grit(0.6)
3. 사회관계: sociability(0.8) + cooperation(0.8) + empathy(0.6)
4. 리더십: assertiveness(1.0) + vitality(0.5) + order(0.3)
5. 협업성: cooperation(1.0) + modesty(0.6) + empathy(0.6)
6. 정서안정: -anxiety(1.0) - impulsivity(0.6) - stress_vulnerability(0.8)
7. 회복탄력: grit(0.9) - stress_vulnerability(0.6) + empathy(0.3)
8. 몰입: grit(0.7) + self_control(0.7) + curiosity(0.4)
9. 성장동기: innovation(0.7) + curiosity(0.7) + assertiveness(0.3)

---

## 🧪 검증 체크리스트

### Phase 0: 구조 검증 ✅

- [x] 60문항 완성
- [x] 역문항 30개 (50%)
- [x] 파셋별 4문항
- [x] 영역별 12문항
- [x] 문항 ID 1~60 연속

### Phase 1: 파일럿 테스트 (n=100~300)

- [ ] 내적 일관성 (Cronbach's α)
  - 영역: α ≥ 0.80
  - 파셋: α ≥ 0.70
- [ ] 문항 반응 특성 (IRT)
  - 난이도 (difficulty)
  - 변별도 (discrimination)
- [ ] 결측치 패턴 분석
- [ ] 응답 시간 분석

### Phase 2: 본 조사 (n=800+)

- [ ] 재검사 신뢰도 (2~4주)
  - 목표: r ≥ 0.70
- [ ] 구조 타당도 (CFA)
  - 5영역 / 15파셋 적합도
  - χ²/df, CFI ≥ 0.90, RMSEA ≤ 0.08
- [ ] 측정불변성 (MI)
  - configural → metric → scalar
  - 성별, 연령, 언어
- [ ] 수렴·변별 타당도 (MTMM)
  - 동특성·이방법
  - 이특성·동방법

### Phase 3: 외적 타당도

- [ ] 준거 타당도
  - 삶의 만족도
  - 정서 (긍정/부정)
  - 행동 지표
- [ ] 예측 타당도
  - 학업/직무 성과
  - 대인관계 질
  - 웰빙 지표

---

## 📝 사용 예시

### 기본 사용

```typescript
import { runIMCoreV3 } from "@/core/im-core-v3";

// 60문항 응답 (1~5)
const responses: Record<number, Likert5> = {
  1: 5, 2: 2, 3: 4, 4: 5, 5: 4,
  // ... 60문항
};

// 엔진 실행
const result = runIMCoreV3(responses);

console.log("MBTI:", result.mbti.type);
console.log("Enneagram:", result.enneagram.primary);
console.log("Inner9:", result.inner9);
```

### 검증 실행

```bash
# TypeScript 직접 실행
npx tsx src/core/im-core-v3/validator.ts

# 또는 Node.js
node -r ts-node/register src/core/im-core-v3/validator.ts
```

---

## 🔬 연구 계획

### 단기 (1~3개월)

1. **파일럿 테스트** (n=100~300)
   - 문항 선별 및 수정
   - 내적 일관성 확인
   - 응답 시간 최적화

2. **한국어 규준 수집**
   - 성별, 연령 층화
   - 평균, SD 산출

### 중기 (3~6개월)

1. **본 조사** (n=800+)
   - 재검사 신뢰도
   - 구조 타당도 (CFA)
   - 측정불변성 (MI)

2. **가중치 학습**
   - 교차검증 (5×2 k-fold)
   - Ridge/Lasso/Elastic-Net
   - 베이스라인 대비 유의 개선

### 장기 (6~12개월)

1. **외적 타당도 검증**
   - 준거 타당도
   - 예측 타당도
   - 종단 연구

2. **다국어 확장**
   - 영어, 일본어 번역
   - 문화적 측정불변성

---

## 📚 참고 문헌

### 핵심 참조

- **Soto, C. J., & John, O. P. (2017).** The next Big Five Inventory (BFI-2): Developing and assessing a hierarchical model with 15 facets to enhance bandwidth, fidelity, and predictive power. *Journal of Personality and Social Psychology, 113*(1), 117-143.

- **Dawes, R. M. (1979).** The robust beauty of improper linear models in decision making. *American Psychologist, 34*(7), 571-582.

- **Embretson, S. E., & Reise, S. P. (2000).** *Item response theory for psychologists.* Mahwah, NJ: Lawrence Erlbaum Associates.

- **Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., & Conner, M. (2021).** The Enneagram: A systematic review of the literature and directions for future research. *Journal of Clinical Psychology, 77*(4), 865-883.

- **Pittenger, D. J. (2005).** Cautionary comments regarding the Myers-Briggs Type Indicator. *Consulting Psychology Journal: Practice and Research, 57*(3), 210-221.

- **Meredith, W. (1993).** Measurement invariance, factor analysis and factorial invariance. *Psychometrika, 58*(4), 525-543.

### 추가 참조

- DeVellis, R. F. (2016). *Scale development: Theory and applications* (4th ed.). Thousand Oaks, CA: SAGE.

- McCrae, R. R., & Costa, P. T., Jr. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. *Journal of Personality, 57*(1), 17-40.

---

## 📞 문의

연구 협력, 데이터 공유, 전문가 검토 문의:
- 프로젝트: InnerMap AI v2
- 버전: v3.0-research
- 최종 업데이트: 2025-11-02

---

**© 2025 InnerMap AI. 연구용 프로토타입. 상업적 사용 금지.**

