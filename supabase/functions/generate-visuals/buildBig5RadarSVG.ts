/**
 * buildBig5RadarSVG
 * Big5 점수를 받아 600×600 Radar Chart SVG를 생성합니다.
 * 
 * @param scores - { openness, conscientiousness, extraversion, agreeableness, neuroticism }
 * @returns SVG 문자열
 */

export interface Big5Scores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

const TRAITS = [
  { key: 'openness', label: '개방성 (O)', short: 'O' },
  { key: 'conscientiousness', label: '성실성 (C)', short: 'C' },
  { key: 'extraversion', label: '외향성 (E)', short: 'E' },
  { key: 'agreeableness', label: '친화성 (A)', short: 'A' },
  { key: 'neuroticism', label: '신경성 (N)', short: 'N' }
];

const CHART_CONFIG = {
  width: 600,
  height: 600,
  centerX: 300,
  centerY: 300,
  radius: 200,
  primaryColor: '#2A7DE1',
  fillColor: '#B8E2FF',
  fillOpacity: 0.4,
  gridColor: '#E0E0E0',
  textColor: '#555555',
  fontFamily: 'Pretendard, Arial, sans-serif',
  fontSize: 14,
  labelDistance: 220
};

/**
 * Big5 점수를 0~1 범위로 정규화 (입력이 0~100인 경우)
 */
function normalizeScore(score: number): number {
  if (score > 1) return score / 100;
  return Math.max(0, Math.min(1, score));
}

/**
 * 극좌표 → 데카르트 좌표 변환
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

/**
 * 배경 그리드 (5단계 동심원)
 */
function buildGridCircles(): string {
  const { centerX, centerY, radius, gridColor } = CHART_CONFIG;
  let svg = '';
  for (let i = 1; i <= 5; i++) {
    const r = (radius * i) / 5;
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="${gridColor}" stroke-width="1" opacity="0.5" />\n`;
  }
  return svg;
}

/**
 * 축 라인 (중심 → 각 trait 방향)
 */
function buildAxes(): string {
  const { centerX, centerY, radius, gridColor } = CHART_CONFIG;
  let svg = '';
  TRAITS.forEach((_, i) => {
    const angle = (360 / TRAITS.length) * i;
    const point = polarToCartesian(centerX, centerY, radius, angle);
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${point.x}" y2="${point.y}" stroke="${gridColor}" stroke-width="1" />\n`;
  });
  return svg;
}

/**
 * 라벨 (각 trait 이름)
 */
function buildLabels(): string {
  const { centerX, centerY, labelDistance, fontSize, fontFamily, textColor } = CHART_CONFIG;
  let svg = '';
  TRAITS.forEach((trait, i) => {
    const angle = (360 / TRAITS.length) * i;
    const point = polarToCartesian(centerX, centerY, labelDistance, angle);
    svg += `<text x="${point.x}" y="${point.y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${trait.short}</text>\n`;
  });
  return svg;
}

/**
 * 데이터 폴리곤 (사용자 점수)
 */
function buildDataPolygon(scores: Big5Scores): string {
  const { centerX, centerY, radius, primaryColor, fillColor, fillOpacity } = CHART_CONFIG;
  const points = TRAITS.map((trait, i) => {
    const score = normalizeScore(scores[trait.key as keyof Big5Scores]);
    const angle = (360 / TRAITS.length) * i;
    const point = polarToCartesian(centerX, centerY, radius * score, angle);
    return `${point.x},${point.y}`;
  }).join(' ');

  const fillWithOpacity = `${fillColor}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}`;

  return `<polygon points="${points}" fill="${fillWithOpacity}" stroke="${primaryColor}" stroke-width="2.5" />\n`;
}

/**
 * 중심점 마커
 */
function buildCenterMarker(): string {
  const { centerX, centerY, primaryColor } = CHART_CONFIG;
  return `<circle cx="${centerX}" cy="${centerY}" r="4" fill="${primaryColor}" />\n`;
}

/**
 * 메인 함수: Big5 Radar Chart SVG 생성
 */
export function buildBig5RadarSVG(scores: Big5Scores): string {
  const { width, height } = CHART_CONFIG;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  ${buildGridCircles()}
  ${buildAxes()}
  ${buildDataPolygon(scores)}
  ${buildCenterMarker()}
  ${buildLabels()}
</svg>`;
}

