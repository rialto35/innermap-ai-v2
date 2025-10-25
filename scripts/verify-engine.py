#!/usr/bin/env python3
"""
참조 엔진 파이썬판
JS ↔ Python 결과 비교용
"""

import json
import sys
import random
import math

def normalize_likert(value, min_val=1, max_val=7):
    """Likert 1~7 → 0~1 정규화"""
    if math.isnan(value):
        return 0.5
    return max(0, min(1, (value - min_val) / (max_val - min_val)))

def normalize_likert_avg(arr, min_val=1, max_val=7):
    """Likert 배열 평균 → 0~1"""
    if not arr:
        return 0.5
    avg = sum(arr) / len(arr)
    return normalize_likert(avg, min_val, max_val)

def to_big5(responses):
    """55문항 응답을 Big5 점수로 변환"""
    sum_val = sum(responses)
    avg = sum_val / len(responses)
    
    # JS와 동일한 로직 (랜덤 시드 고정)
    random.seed(42)  # 결정적 결과를 위해 시드 고정
    
    return {
        'o': max(0, min(100, (avg * 10 + random.random() * 10))),
        'c': max(0, min(100, (avg * 10 + random.random() * 10))),
        'e': max(0, min(100, (avg * 10 + random.random() * 10))),
        'a': max(0, min(100, (avg * 10 + random.random() * 10))),
        'n': max(0, min(100, (avg * 10 + random.random() * 10)))
    }

def to_mbti(big5, responses):
    """Big5 점수와 응답을 기반으로 MBTI 유형 결정"""
    # JS와 동일한 로직
    dims = {
        'E': max(0, min(1, big5['e'] / 100)),
        'S': max(0, min(1, (100 - big5['o']) / 100)),
        'T': max(0, min(1, (100 - big5['a']) / 100)),
        'J': max(0, min(1, big5['c'] / 100))
    }
    
    # 추가 문항 보정
    if len(responses) >= 30:
        additional_e = normalize_likert_avg(responses[20:25])
        additional_s = normalize_likert_avg(responses[25:30])
        dims['E'] = (dims['E'] + additional_e) / 2
        dims['S'] = (dims['S'] + additional_s) / 2
    
    # 이진 분기
    i = dims['E'] < 0.5
    n = dims['S'] < 0.5
    f = dims['T'] < 0.5
    p = dims['J'] < 0.5
    
    mbti = f"{'I' if i else 'E'}{'N' if n else 'S'}{'F' if f else 'T'}{'P' if p else 'J'}"
    return mbti

def to_reti(big5, responses):
    """Big5 점수와 응답을 기반으로 RETI 유형 결정"""
    # JS와 동일한 로직
    core = normalize_likert_avg(responses[30:35])
    score01 = max(0, min(1, 0.5 * core + 0.5 * (big5['e'] / 100)))
    reti = max(1, min(9, round(score01 * 8 + 1)))
    return reti

def to_inner9(big5, mbti, reti, weights=None):
    """Big5, MBTI, RETI를 융합하여 Inner9 9축 계산"""
    if weights is None:
        weights = {'big5': 1, 'mbti': 0.5, 'reti': 0.5}
    
    # JS와 동일한 로직
    inner9_scores = {
        'creation': big5['o'] * weights['big5'] + (10 if 'N' in mbti else 0) * weights['mbti'],
        'balance': (100 - abs(big5['e'] - big5['c'])) * weights['big5'] + (5 if 'J' in mbti else 0) * weights['mbti'],
        'intuition': big5['o'] * weights['big5'] + (15 if 'N' in mbti else 0) * weights['mbti'],
        'analysis': big5['c'] * weights['big5'] + (10 if 'T' in mbti else 0) * weights['mbti'],
        'harmony': big5['a'] * weights['big5'] + (15 if 'F' in mbti else 0) * weights['mbti'],
        'drive': big5['e'] * weights['big5'] + (10 if reti > 5 else 0) * weights['reti'],
        'reflection': (100 - big5['n']) * weights['big5'] + (5 if 'I' in mbti else 0) * weights['mbti'],
        'empathy': big5['a'] * weights['big5'] + (10 if 'F' in mbti else 0) * weights['mbti'],
        'discipline': big5['c'] * weights['big5'] + (10 if reti < 5 else 0) * weights['reti']
    }
    
    return [
        {'label': key.capitalize(), 'value': max(0, min(100, value))}
        for key, value in inner9_scores.items()
    ]

def run_all(responses, opts=None):
    """55문항 응답을 모든 분석 결과로 변환"""
    if opts is None:
        opts = {}
    
    weights = opts.get('weights', {'big5': 1, 'mbti': 0.5, 'reti': 0.5})
    
    # 1단계: Big5 분석
    big5 = to_big5(responses)
    
    # 2단계: MBTI 분석
    mbti = to_mbti(big5, responses)
    
    # 3단계: RETI 분석
    reti = to_reti(big5, responses)
    
    # 4단계: Inner9 분석
    inner9 = to_inner9(big5, mbti, reti, weights)
    
    return {
        'big5': big5,
        'mbti': mbti,
        'reti': reti,
        'inner9': inner9,
        'timestamp': '2024-12-19T14:30:00.000Z'
    }

def main():
    """메인 실행 함수"""
    if len(sys.argv) < 2:
        # 테스트용 샘플 데이터
        responses = [4] * 55
    else:
        # 명령행 인수로 받은 응답 데이터
        responses = json.loads(sys.argv[1])
    
    result = run_all(responses)
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
