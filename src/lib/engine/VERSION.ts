/**
 * 엔진 버전 정보
 */

export const ENGINE_VERSION = '1.2.0';
export const ENGINE_BUILD_DATE = '2024-12-19T14:20:00.000Z';

export interface EngineMetadata {
  version: string;
  buildDate: string;
  weightsVersion: string;
  weightsChecksum: string;
}

export function getEngineMetadata(): EngineMetadata {
  return {
    version: ENGINE_VERSION,
    buildDate: ENGINE_BUILD_DATE,
    weightsVersion: '1.0.0',
    weightsChecksum: 'sha256:abc123...' // 실제 체크섬은 런타임에 계산
  };
}
