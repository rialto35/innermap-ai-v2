/**
 * im-core 엔진 버전 정보
 */

export const ENGINE_VERSION = '1.3.1';
export const ENGINE_BUILD_DATE = '2024-12-19T14:30:00.000Z';
export const ENGINE_HASH = 'sha1:{{commit-hash}}';

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
