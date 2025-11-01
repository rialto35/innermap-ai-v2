-- Inner9 분포/퍼센타일 메트릭 (PostgreSQL)
-- 사용법 (psql): \i scripts/metrics/inner9_distribution.sql

-- 1) 전체 축별 분포 요약 (p50/p95)
WITH axes AS (
  -- case A1: 배열의 각 원소가 객체 {label, value} 형태
  SELECT
    tar.created_at,
    (elem->>'label') AS label,
    CASE WHEN jsonb_typeof(elem->'value') = 'number'
      THEN (elem->'value')::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'object'
    AND jsonb_typeof(elem->'label') = 'string'
    AND jsonb_typeof(elem->'value') = 'number'

  UNION ALL

  -- case A2: 배열의 각 원소가 [label, value] 형태
  SELECT
    tar.created_at,
    (elem->>0) AS label,
    CASE WHEN jsonb_typeof(elem->1) = 'number'
      THEN (elem->>1)::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'array'
    AND jsonb_array_length(elem) >= 2
    AND jsonb_typeof(elem->0) = 'string'
    AND jsonb_typeof(elem->1) = 'number'

  UNION ALL

  -- case B: 객체 {label: value} 형태 (value가 숫자인 항목만)
  SELECT
    tar.created_at,
    e.key AS label,
    CASE WHEN jsonb_typeof(e.value) = 'number'
      THEN (e.value)::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_each(tar.inner9) AS e(key, value)
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'object'
    AND jsonb_typeof(e.value) = 'number'
)
SELECT
  label,
  COUNT(*) AS n,
  ROUND((percentile_cont(0.5) WITHIN GROUP (ORDER BY value))::numeric, 2) AS p50,
  ROUND((percentile_cont(0.95) WITHIN GROUP (ORDER BY value))::numeric, 2) AS p95,
  ROUND(MIN(value), 2) AS min,
  ROUND(MAX(value), 2) AS max
FROM axes
WHERE value IS NOT NULL
GROUP BY label
ORDER BY label;

-- 2) Balance 축 최근 7일 추이 (중앙값)
WITH axes AS (
  -- 배열 형태: {label,value}
  SELECT
    date_trunc('day', tar.created_at) AS d,
    (elem->>'label') AS label,
    CASE WHEN jsonb_typeof(elem->'value') = 'number'
      THEN (elem->'value')::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'object'
    AND jsonb_typeof(elem->'label') = 'string'
    AND jsonb_typeof(elem->'value') = 'number'
    AND tar.created_at >= NOW() - INTERVAL '7 days'

  UNION ALL

  -- 배열 형태: [label, value]
  SELECT
    date_trunc('day', tar.created_at) AS d,
    (elem->>0) AS label,
    CASE WHEN jsonb_typeof(elem->1) = 'number'
      THEN (elem->>1)::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'array'
    AND jsonb_array_length(elem) >= 2
    AND jsonb_typeof(elem->0) = 'string'
    AND jsonb_typeof(elem->1) = 'number'
    AND tar.created_at >= NOW() - INTERVAL '7 days'

  UNION ALL

  -- 객체 형태 (값이 숫자인 경우만)
  SELECT
    date_trunc('day', tar.created_at) AS d,
    e.key AS label,
    CASE WHEN jsonb_typeof(e.value) = 'number'
      THEN (e.value)::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_each(tar.inner9) AS e(key, value)
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'object'
    AND jsonb_typeof(e.value) = 'number'
    AND tar.created_at >= NOW() - INTERVAL '7 days'
)
SELECT
  d,
  ROUND((percentile_cont(0.5) WITHIN GROUP (ORDER BY value))::numeric, 2) AS p50,
  ROUND((percentile_cont(0.95) WITHIN GROUP (ORDER BY value))::numeric, 2) AS p95,
  COUNT(*) AS n
FROM axes
WHERE label = 'Balance' AND value IS NOT NULL
GROUP BY d
ORDER BY d;

-- 3) 이상치 확인 (0 또는 100 고정치 비율)
WITH axes AS (
  -- 배열 형태: {label,value}
  SELECT
    (elem->>'label') AS label,
    CASE WHEN jsonb_typeof(elem->'value') = 'number'
      THEN (elem->'value')::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'object'
    AND jsonb_typeof(elem->'label') = 'string'
    AND jsonb_typeof(elem->'value') = 'number'

  UNION ALL

  -- 배열 형태: [label, value]
  SELECT
    (elem->>0) AS label,
    CASE WHEN jsonb_typeof(elem->1) = 'number'
      THEN (elem->>1)::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_array_elements(tar.inner9) AS elem
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'array'
    AND jsonb_typeof(elem) = 'array'
    AND jsonb_array_length(elem) >= 2
    AND jsonb_typeof(elem->0) = 'string'
    AND jsonb_typeof(elem->1) = 'number'

  UNION ALL

  -- 객체 형태 (값이 숫자인 경우만)
  SELECT
    e.key AS label,
    CASE WHEN jsonb_typeof(e.value) = 'number'
      THEN (e.value)::text::numeric
      ELSE NULL
    END AS value
  FROM public.test_assessment_results tar
  CROSS JOIN LATERAL jsonb_each(tar.inner9) AS e(key, value)
  WHERE tar.inner9 IS NOT NULL
    AND jsonb_typeof(tar.inner9) = 'object'
    AND jsonb_typeof(e.value) = 'number'
)
SELECT
  label,
  ROUND(100.0 * AVG(CASE WHEN value = 0 OR value = 100 THEN 1 ELSE 0 END), 2) AS pct_hard_limits,
  COUNT(*) AS n
FROM axes
WHERE value IS NOT NULL
GROUP BY label
ORDER BY label;


