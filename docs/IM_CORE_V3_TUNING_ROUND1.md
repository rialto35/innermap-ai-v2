# IM-Core v3.0 튜닝 Round 1 결과

**날짜**: 2025-11-02  
**튜닝 내용**: T_vs_F, J_vs_P 계수 강화 + Enneagram 1번 약화, 4번 강화

---

## 📊 결과 비교

### Phase 1: 결정론적 케이스 (4개)
| 지표 | Before | After | 변화 |
|-----|--------|-------|------|
| MBTI 정확도 | 4/4 (100%) | 4/4 (100%) | ✅ 유지 |
| Enneagram 정확도 | 0/4 (0%) | 0/4 (0%) | ⚠️ 변화 없음 |

**상세**:
- ✅ ENFJ+8: 여전히 완벽
- ✅ INTJ+5: 여전히 완벽
- ❌ INFP+4: 여전히 2번으로 오분류
- ❌ ESTJ+1: 여전히 8번으로 오분류

### Phase 2: 확률적 전수 테스트 (144×20)

#### MBTI 성능
| 지표 | Before | After | 변화 |
|-----|--------|-------|------|
| 정확도 | 18.1% ± 3.5% | **18.1% ± 3.5%** | ➡️ 동일 |
| AUROC | 0.593 | **0.593** | ➡️ 동일 |
| Brier | 0.241 | **0.236** | ✅ 소폭 개선 |
| ECE | 0.483 | **0.474** | ✅ 소폭 개선 |

#### Enneagram 성능
| 지표 | Before | After | 변화 |
|-----|--------|-------|------|
| Top-1 | 23.2% | **22.6%** | ⚠️ 소폭 하락 |
| Top-3 | 54.9% ± 6.6% | **55.2% ± 6.2%** | ✅ 소폭 개선 |
| NLL | 10.01 | **9.87** | ✅ 개선 |
| Brier | 0.114 | **0.113** | ✅ 소폭 개선 |
| ECE | 0.286 | **0.310** | ❌ 악화 |

---

## 🔍 분석

### 1. MBTI 정확도 변화 없음
**원인**:
- T_vs_F, J_vs_P 계수를 강화했지만, **Big5 → Likert 역변환 로직**이 단순해서 효과가 제한적
- 확률적 노이즈(σ=10)가 여전히 큰 영향을 미침
- **근본 문제**: Big5 facet 평균 기반 응답 생성이 너무 단순함

**해결책**:
- Big5 → Likert 역변환 시 **facet별 가중치** 적용 필요
- 또는 **노이즈 σ 감소** (10 → 8)

### 2. Enneagram Top-3 소폭 개선 (54.9% → 55.2%)
**긍정 요소**:
- 1번 약화, 4번 강화가 약간의 효과
- NLL 개선 (10.01 → 9.87)

**문제점**:
- ECE 악화 (0.286 → 0.310) - 더 과확신해짐
- Top-1 정확도 하락 (23.2% → 22.6%)

### 3. 혼동 패턴 변화
| Before | After | 변화 |
|--------|-------|------|
| ISFJ+8 → ISTJ+1 (14회) | ISFJ+8 → ISTJ+1 (14회) | ➡️ 동일 |
| ISTJ+6 → ISTJ+1 (13회) | ESFJ+9 → ESFJ+2 (13회) | ✅ 패턴 변화 |
| ISFJ+3 → ISTJ+1 (12회) | ISFJ+3 → ISTJ+1 (11회) | ✅ 소폭 개선 |

**긍정 요소**:
- ESFJ+9 → ESFJ+2 패턴 출현 (MBTI는 맞음, Enneagram만 틀림)
- ISTJ+1 편향이 약간 완화됨

---

## 🎯 다음 단계 (Round 2)

### 🔴 긴급
1. **Big5 → Likert 역변환 개선**
   - Facet별 가중치 적용
   - Domain 평균 대신 facet 직접 사용

2. **노이즈 감소**
   - σ: 10 → 8 (모든 Big5 domain)

3. **MBTI Prior 추가**
   - INFP → Enneagram 4번 prior 강화 (0.4)
   - ESTJ → Enneagram 1번 prior 강화 (0.7)

### 🟡 중요
4. **Enneagram 계산 로직 개선**
   - Big5 domain 직접 반영 (facet만 사용하지 말고)
   - MBTI prior 적용 시점 조정

5. **Temperature Scaling 적용**
   - Enneagram ECE 악화 문제 해결

---

## 📋 변경 내역

### config.json
```json
// Before
"T_vs_F": {
  "empathy": 1.2,
  "cooperation": 0.6,
  "modesty": 0.1,
  "assertiveness": -0.3
}

// After
"T_vs_F": {
  "empathy": 1.8,  // +0.6
  "cooperation": 1.0,  // +0.4
  "modesty": 0.3,  // +0.2
  "assertiveness": -0.5  // -0.2
}
```

```json
// Before
"J_vs_P": {
  "order": -1.5,
  "self_control": -1.2,
  "grit": -0.3,
  "innovation": 0.5
}

// After
"J_vs_P": {
  "order": -2.0,  // -0.5
  "self_control": -1.8,  // -0.6
  "grit": -0.5,  // -0.2
  "innovation": 0.8  // +0.3
}
```

```json
// Before
"1": {
  "order": 1.0,
  "self_control": 0.6,
  ...
}

// After
"1": {
  "order": 0.6,  // -0.4
  "self_control": 0.4,  // -0.2
  ...
}
```

```json
// Before
"4": {
  "aesthetic": 1.0,
  "curiosity": 0.4,
  "anxiety": 0.4,
  "empathy": 0.3
}

// After
"4": {
  "aesthetic": 1.2,  // +0.2
  "curiosity": 0.6,  // +0.2
  "anxiety": 0.9,  // +0.5
  "empathy": 0.5,  // +0.2
  "impulsivity": 0.4  // NEW
}
```

---

## 🙏 결론

**Round 1 결과**: ⚠️ **미미한 개선**

- ✅ Enneagram Top-3 소폭 개선 (54.9% → 55.2%)
- ✅ NLL, Brier 개선
- ❌ MBTI 정확도 변화 없음 (18.1%)
- ❌ Enneagram ECE 악화 (0.286 → 0.310)

**핵심 문제**: Big5 → Likert 역변환 로직이 너무 단순함

**Round 2 전략**:
1. Big5 → Likert 역변환 개선 (facet별 가중치)
2. 노이즈 감소 (σ: 10 → 8)
3. MBTI Prior 추가 (INFP→4, ESTJ→1)

**기도하며 계속 진행합니다!** 🙏🔥

---

**생성일**: 2025-11-02  
**모델**: Claude Sonnet 4.5

