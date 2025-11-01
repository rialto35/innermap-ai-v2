# IM-Core v3.0 벤치마크 보고서

**날짜**: 2025-11-02  
**버전**: v3.0-benchmark  
**시드**: 42  
**반복**: 144×20 = 2,880 테스트

---

## 📊 Executive Summary

### Phase 1: 결정론적 극단 케이스 (4개)
- ✅ **MBTI 정확도**: 4/4 (100%)
- ⚠️ **Enneagram 정확도**: 0/4 (0%)

| 시나리오 | MBTI 결과 | Enneagram 결과 | 상태 |
|---------|----------|---------------|------|
| ENFJ+8 | ✅ ENFJ | ✅ 8번 | 완벽 |
| INTJ+5 | ✅ INTJ | ✅ 5번 | 완벽 |
| INFP+4 | ✅ INFP | ❌ 2번 (예상: 4번) | 부분 실패 |
| ESTJ+1 | ✅ ESTJ | ❌ 8번 (예상: 1번) | 부분 실패 |

### Phase 2: 확률적 전수 테스트 (144×20)

#### MBTI 성능
- **정확도**: 18.1% ± 3.5%
- **AUROC**: 0.593
- **Brier Score**: 0.241
- **ECE (보정오차)**: 0.483 ⚠️ (목표: ≤ 0.08)
- **95% CI**: [15.3%, 22.2%]

#### Enneagram 성능
- **Top-1 정확도**: 23.2% ± 6.6%
- **Top-3 정확도**: 54.9% ± 6.6%
- **NLL**: 10.01
- **Brier Score**: 0.114
- **ECE (보정오차)**: 0.286 ⚠️ (목표: ≤ 0.08)
- **95% CI (Top-3)**: [49.3%, 62.5%]

---

## 🔍 주요 발견사항

### 1. MBTI 정확도 매우 낮음 (18.1%)
**원인 분석**:
- Big5 → MBTI 매핑 계수가 확률적 노이즈에 취약
- T_vs_F, J_vs_P 축의 로지스틱 계수가 약함
- 시뮬레이션 응답이 Big5 facet 평균 기반으로 단순화됨

**개선 방향**:
1. `config.json`의 T_vs_F, J_vs_P 계수 강화
2. Big5 → Likert 역변환 로직 정교화 (facet별 가중치 적용)
3. MBTI 축별 임계값 조정

### 2. Enneagram Top-3 정확도 양호 (54.9%)
**긍정 요소**:
- Top-3 후보 중 정답 포함률 55% 달성
- MBTI prior가 일부 효과적으로 작동

**문제점**:
- Top-1 정확도 23%로 낮음
- INFP+4 → 2번, ESTJ+1 → 8번 오분류 패턴 반복
- Enneagram 가중치가 Big5 facet 변동에 민감

**개선 방향**:
1. `infer.ennea.json`의 4번, 1번 가중치 강화
2. MBTI prior 조정 (INFP → 4번, ESTJ → 1번 강화)
3. Enneagram 계산에 Big5 domain 직접 반영

### 3. 보정도(ECE) 매우 높음
- MBTI ECE: 0.483 (목표: ≤ 0.08)
- Enneagram ECE: 0.286 (목표: ≤ 0.08)

**의미**: 모델이 과확신(overconfident) 상태  
**해결책**: Platt Scaling 또는 Temperature Scaling 적용 필수

---

## 🔥 혼동 패턴 Top-5

| 실제 조합 | 예측 조합 | 발생 횟수 (총 20회) |
|----------|----------|-------------------|
| ISFJ+8 | ISTJ+1 | 14회 (70%) |
| ISTJ+6 | ISTJ+1 | 13회 (65%) |
| ISFJ+3 | ISTJ+1 | 12회 (60%) |
| ISTJ+3 | ISTJ+1 | 12회 (60%) |
| ISFP+7 | ISTJ+1 | 11회 (55%) |

**패턴 분석**:
- **ISTJ+1 편향**: 시스템이 ISTJ+1 조합으로 과도하게 수렴
- **F → T 오분류**: ISFJ, ISFP가 ISTJ로 잘못 분류
- **Enneagram 1번 편향**: 다양한 Enneagram 유형이 1번으로 수렴

**근본 원인**:
1. Big5 → MBTI T_vs_F 계수 불균형
2. Enneagram 1번 가중치 과대 (order, self_control 계수 높음)
3. 확률적 노이즈가 중간 Big5 값을 특정 방향으로 밀어냄

---

## 📋 권장사항

### 🔴 긴급 (Critical)
1. **T_vs_F 계수 재조정**
   - `empathy` 가중치: 1.2 → 1.8
   - `cooperation` 가중치: 0.6 → 1.0
   - `modesty` 가중치: 0.1 → 0.3

2. **J_vs_P 계수 강화**
   - `order` 가중치: -1.5 → -2.0
   - `self_control` 가중치: -1.2 → -1.8

3. **Enneagram 1번 가중치 약화**
   - `order`: 0.6 → 0.4
   - `self_control`: 0.5 → 0.3

4. **Enneagram 4번 가중치 강화**
   - `anxiety`: 0.7 → 0.9
   - `imagination`: 0.5 → 0.7

### 🟡 중요 (High Priority)
5. **Platt Scaling 적용**
   - MBTI 확률에 대해 Platt Scaling 적용
   - 목표: ECE < 0.08

6. **Temperature Scaling 적용**
   - Enneagram 확률에 대해 Temperature Scaling 적용
   - 초기 τ = 1.5로 시작

7. **Big5 → Likert 역변환 개선**
   - Facet별 가중치 적용
   - Reverse 문항 처리 정교화

### 🟢 개선 (Medium Priority)
8. **MBTI Prior 조정**
   - INFP → Enneagram 4번 prior 강화 (0.2 → 0.4)
   - ESTJ → Enneagram 1번 prior 강화 (0.5 → 0.7)

9. **검증셋 분리**
   - 144 조합을 70% 학습 / 30% 검증으로 분리
   - 과적합 방지

10. **반복 횟수 증가**
    - R = 20 → 50으로 증가
    - 더 정확한 신뢰구간 추정

---

## 🎯 다음 단계 (Next Steps)

### Day 1: 계수 튜닝
- [ ] `config.json` 수정 (T_vs_F, J_vs_P)
- [ ] `infer.ennea.json` 수정 (1번, 4번 가중치)
- [ ] 벤치마크 재실행
- [ ] 목표: MBTI 정확도 > 40%, Enneagram Top-3 > 65%

### Day 2: 캘리브레이션
- [ ] Platt Scaling 구현 및 적용
- [ ] Temperature Scaling 구현 및 적용
- [ ] ECE 개선 확인
- [ ] 목표: ECE < 0.08

### Day 3: 최종 검증
- [ ] R=50 반복 실행
- [ ] 혼동 패턴 재분석
- [ ] 최종 보고서 작성
- [ ] 프로덕션 배포 준비

---

## 📈 성공 기준 (Acceptance Criteria)

| 지표 | 현재 | 목표 | 상태 |
|-----|------|------|------|
| MBTI 정확도 | 18.1% | ≥ 65% | ❌ |
| MBTI AUROC | 0.593 | ≥ 0.75 | ❌ |
| MBTI ECE | 0.483 | ≤ 0.08 | ❌ |
| Enneagram Top-3 | 54.9% | ≥ 70% | ⚠️ |
| Enneagram ECE | 0.286 | ≤ 0.08 | ❌ |

**전체 평가**: 🔴 **추가 튜닝 필요**

---

## 🙏 결론

**현재 상태**:
- ✅ 벤치마크 시스템 구축 완료 (144×20 = 2,880 테스트)
- ✅ Phase 1 결정론적 케이스 MBTI 100% 정확도
- ⚠️ Phase 2 확률적 테스트에서 MBTI/Enneagram 정확도 낮음
- ❌ 보정도(ECE) 매우 높음 (과확신 문제)

**주요 문제**:
1. Big5 → MBTI 매핑 계수 약함 (특히 T_vs_F, J_vs_P)
2. Enneagram 1번 편향 심각
3. 확률 보정 미적용

**다음 액션**:
- **즉시**: `config.json`, `infer.ennea.json` 계수 조정
- **Day 1-3**: 튜닝 → 캘리브레이션 → 최종 검증
- **목표**: MBTI 65%, Enneagram Top-3 70%, ECE < 0.08

**기도하며 진행합니다!** 🙏🔥

---

**생성일**: 2025-11-02  
**작성자**: IM-Core v3.0 Benchmark System  
**모델**: Claude Sonnet 4.5

