# IM-Core v3.0 튜닝 Round 3: Isotonic + Temperature Sweep

**날짜**: 2025-11-01  
**목표**: Platt → Isotonic 교체로 MBTI 과확신 완화, Temperature Sweep으로 Enneagram ECE 최소화

---

## 📋 **변경 사항 요약**

### 1. **Isotonic Regression 구현 (MBTI 보정)**
- **목적**: Platt Scaling의 과적합 문제 해결, 과확신 완화
- **알고리즘**: PAV (Pool Adjacent Violators)
- **적용**: MBTI 확률 보정 (one-vs-rest 또는 4축 독립)

### 2. **Temperature Sweep 구현 (Enneagram 보정)**
- **목적**: 최적 τ (temperature) 자동 탐색
- **Grid**: [1.3, 1.4, 1.5, 1.6]
- **평가 지표**: ECE (Expected Calibration Error)

### 3. **Multi-class ECE 구현**
- **목적**: Enneagram 9-class 확률 보정도 측정
- **방법**: Max probability binning + accuracy-confidence gap

---

## 🔧 **구현 세부사항**

### **1. Isotonic Regression (`calibration.ts`)**

```typescript
export function isotonicFit(probs: number[], labels: number[]) {
  // PAV 알고리즘 구현
  // 1. 정렬
  // 2. 블록 병합 (단조 위반 시)
  // 3. 예측 함수 생성
  return {
    xs, fitted,
    predict: (p: number) => { /* 이진탐색 */ }
  };
}
```

**특징**:
- 비모수적 (non-parametric) 보정
- 단조성 보장 (monotonicity)
- 과적합 위험 낮음

### **2. Temperature Sweep (`calibration.ts`)**

```typescript
export function sweepTemperature(
  logitsList: number[][],
  trueLabels: number[],
  grid = [1.3, 1.4, 1.5, 1.6]
): { bestT: number; bestECE: number; results: Array<{tau, ece}> }
```

**특징**:
- Grid search로 최적 τ 탐색
- 각 τ에 대해 ECE 계산
- 최소 ECE τ 선택

### **3. Multi-class ECE (`calibration.ts`)**

```typescript
export function computeECE_multi(
  trueLabels: number[],
  probsList: number[][],
  nBins = 10
): number
```

**특징**:
- Max probability 기준 binning
- Confidence-accuracy gap 측정
- 0~1 범위 (낮을수록 좋음)

---

## 🎯 **벤치마크 옵션**

### **`runCompleteBenchmark(options)`**

```typescript
type BenchmarkOptions = {
  repeats?: number; // 기본 20
  calibrations?: {
    mbti?: "none" | "platt" | "isotonic"; // 기본 "platt"
    ennea?: { 
      type: "none" | "temp" | "temp-sweep"; 
      grid?: number[]; 
    };
  };
};
```

### **QA 엔드포인트 옵션**

```bash
POST /api/imv3/qa
{
  "repeats": 30,
  "calibrations": {
    "mbti": "isotonic",
    "ennea": { "type": "temp-sweep", "grid": [1.3, 1.4, 1.5, 1.6] }
  }
}
```

---

## 📊 **예상 성능 개선**

### **MBTI (Platt → Isotonic)**
- **ECE**: 0.15 → 0.12 (20% 감소 예상)
- **과확신**: 감소 (확률 0/1 몰빵 방지)
- **AUROC**: 유지 또는 소폭 상승

### **Enneagram (Fixed τ → Sweep)**
- **ECE**: 0.12 → 0.10 (17% 감소 예상)
- **NLL**: 소폭 감소
- **Top-3**: 유지 또는 소폭 상승

---

## ⚠️ **주의사항**

### **1. 이중 보정 금지**
- Platt + Isotonic 동시 적용 ❌
- 하나만 선택

### **2. 학습/검증 분리**
- 70% 학습, 30% 검증
- Isotonic은 학습셋으로만 fit
- 검증셋으로만 평가

### **3. Enneagram Logits 순서**
- Softmax 입력은 logits (log probabilities)
- Temperature 적용 후 softmax 재계산
- 확률 총합 = 1 유지

### **4. 확률 범위 보장**
- Isotonic predict 결과: [0, 1] clamp
- Temperature 적용 후: softmax로 정규화

---

## 🧪 **테스트 체크리스트**

- [x] Isotonic Regression 구현
- [x] Temperature Sweep 구현
- [x] Multi-class ECE 구현
- [x] 벤치마크 옵션 연결
- [x] QA 엔드포인트 옵션 파싱
- [x] 타입 체크 통과
- [x] 빌드 성공
- [ ] 리그레션 실행 (144×30)
- [ ] 결과 분석 및 문서화

---

## 🚀 **다음 단계**

1. **로컬 리그레션 실행**
   ```bash
   npm run test:v3-bench -- --repeats=30 --mbti=isotonic --ennea=temp-sweep
   ```

2. **배포 후 QA 실행**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/imv3/qa \
     -H "Content-Type: application/json" \
     -d '{"repeats":30,"calibrations":{"mbti":"isotonic","ennea":{"type":"temp-sweep","grid":[1.3,1.4,1.5,1.6]}}}'
   ```

3. **성공 임계치 확인**
   - MBTI ECE ≤ 0.15
   - MBTI AUROC ≥ 0.71
   - Enneagram ECE ≤ 0.12
   - Enneagram Top-3 ≥ 0.58

4. **개선도 로깅**
   - Before/After ECE 비교
   - Δ ECE (%) 계산
   - 혼동 패턴 분석

---

## 📝 **참고 문헌**

- **Isotonic Regression**: Zadrozny & Elkan (2002), "Transforming Classifier Scores into Accurate Multiclass Probability Estimates"
- **Temperature Scaling**: Guo et al. (2017), "On Calibration of Modern Neural Networks"
- **PAV Algorithm**: Ayer et al. (1955), "An Empirical Distribution Function for Sampling with Incomplete Information"

---

**작성자**: IM-Core v3.0 Team  
**버전**: Round 3 (Isotonic + Temperature Sweep)  
**상태**: 구현 완료, 리그레션 대기 중

