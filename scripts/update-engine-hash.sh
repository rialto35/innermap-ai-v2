#!/bin/bash
# CI 빌드 시 자동 삽입 스크립트

COMMIT_HASH=$(git rev-parse HEAD)
VERSION_FILE="src/core/im-core/VERSION.ts"

# 기존 VERSION.ts 백업
cp "$VERSION_FILE" "$VERSION_FILE.backup"

# 새로운 해시로 업데이트
cat > "$VERSION_FILE" << EOF
/**
 * im-core 엔진 버전 정보
 */

export const ENGINE_VERSION = '1.3.1';
export const ENGINE_BUILD_DATE = '$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")';
export const ENGINE_HASH = 'sha1:$COMMIT_HASH';

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
EOF

echo "✅ Engine hash updated: $COMMIT_HASH"
