/**
 * Big5 성격 분석 엔진
 * 55문항 응답을 Big5 점수로 변환
 */

import { normalizeLikert, normalizeBig5 } from './normalization';
import questionsData from '@/data/questions.unified.json';

export type Big5Scores = {
  o: number; // Openness (개방성)
  c: number; // Conscientiousness (성실성)
  e: number; // Extraversion (외향성)
  a: number; // Agreeableness (친화성)
  n: number; // Neuroticism (신경성)
};

/**
 * 55문항 응답을 Big5 점수로 변환
 * @param responses 55개 문항 응답 (1~7 Likert 스케일)
 * @returns Big5 점수 (0~100)
 */
export function toBig5(responses: number[]): Big5Scores {
  if (responses.length !== 55) {
    throw new Error('응답은 정확히 55개여야 합니다');
  }

  // Phase 0: 엔진 V2 또는 구성 허용 시 질문 메타를 이용한 역문항/가중치 적용
  const useMeta = (process.env.IM_ENGINE_V2_ENABLED === 'true') || (process.env.IM_BIG5_CONFIG_ENABLED === 'true');

  if (useMeta) {
    const section = (questionsData as any).sections?.find((s: any) => s.id === 'section_big5');
    const questions: Array<{ id: string; reverse: boolean; weight: number; domain: string }> = section?.questions || [];

    type Acc = { sum: number; w: number };
    const acc: Record<'o'|'c'|'e'|'a'|'n', Acc> = {
      o: { sum: 0, w: 0 },
      c: { sum: 0, w: 0 },
      e: { sum: 0, w: 0 },
      a: { sum: 0, w: 0 },
      n: { sum: 0, w: 0 },
    };

    for (let i = 0; i < Math.min(responses.length, questions.length); i++) {
      const q = questions[i];
      const raw = responses[i]; // 1..7
      const scored = q?.reverse ? (8 - raw) : raw; // reverse: 8 - score
      const w = typeof q?.weight === 'number' ? q.weight : 1;

      const domain = q?.domain as string;
      if (domain?.startsWith('big5.')) {
        const key = domain.split('.')[1] as 'openness'|'conscientiousness'|'extraversion'|'agreeableness'|'neuroticism';
        const mapKey: Record<typeof key, 'o'|'c'|'e'|'a'|'n'> = {
          openness: 'o', conscientiousness: 'c', extraversion: 'e', agreeableness: 'a', neuroticism: 'n'
        };
        const k = mapKey[key];
        acc[k].sum += normalizeLikert(scored) * w; // 0..1 가중합
        acc[k].w += w;
      }
    }

    const toScore01 = (a: Acc) => (a.w > 0 ? a.sum / a.w : 0.5);
    return normalizeBig5({
      o: toScore01(acc.o),
      c: toScore01(acc.c),
      e: toScore01(acc.e),
      a: toScore01(acc.a),
      n: toScore01(acc.n),
    });
  }

  // 기본(후방 호환) 경로: 단순 평균 → 0..100
  const opennessItems = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51];
  const conscientiousnessItems = [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52];
  const extraversionItems = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53];
  const agreeablenessItems = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54];
  const neuroticismItems = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const avg = (idxs: number[]) => idxs.reduce((s, idx) => s + responses[idx - 1], 0) / idxs.length;

  const scores = {
    o: normalizeLikert(avg(opennessItems)),
    c: normalizeLikert(avg(conscientiousnessItems)),
    e: normalizeLikert(avg(extraversionItems)),
    a: normalizeLikert(avg(agreeablenessItems)),
    n: normalizeLikert(avg(neuroticismItems))
  };

  return normalizeBig5(scores);
}
