/**
 * Engine Version
 * 
 * 스냅샷 재현성을 위한 엔진 버전 관리
 * - 버전이 변경되면 새로운 스냅샷이 생성됨
 * - 과거 결과는 해당 버전으로 고정되어 보관됨
 */

export const ENGINE_VERSION = 'v1.1.0';

export interface EngineVersionInfo {
  version: string;
  timestamp: string;
  changes: string[];
}

export const VERSION_HISTORY: EngineVersionInfo[] = [
  {
    version: 'v1.1.0',
    timestamp: '2025-10-16',
    changes: [
      'Weighted scoring with domain-based mapping',
      'Reverse item handling',
      'Auxiliary psychological scales (SDT, affect, engagement)',
      'Unified questionnaire format (55 items)',
      'Enhanced reproducibility with answers hash'
    ]
  },
  {
    version: 'v1.0.0',
    timestamp: '2025-10-16',
    changes: [
      'Initial release',
      'Huber scoring with clipping and tiebreaker',
      'Big5, MBTI, RETI scoring',
      '12 tribes (innate) + 12 stones (acquired) mapping',
      '144 heroes matching system'
    ]
  }
];

export function getCurrentVersion(): string {
  return ENGINE_VERSION;
}

export function getVersionInfo(version: string): EngineVersionInfo | undefined {
  return VERSION_HISTORY.find(v => v.version === version);
}

