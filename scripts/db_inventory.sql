-- InnerMap AI v2 - Database Inventory Collection
-- PostgreSQL 메타데이터를 CSV로 수집
-- 실행: psql "$DATABASE_URL" -f scripts/db_inventory.sql

-- Tables
\copy (
  SELECT schemaname, tablename
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename
) TO 'docs/db/exports/01_tables.csv' CSV HEADER;

-- Columns
\copy (
  SELECT
    c.table_name,
    c.ordinal_position AS pos,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
  ORDER BY c.table_name, c.ordinal_position
) TO 'docs/db/exports/02_columns.csv' CSV HEADER;

-- PK & UNIQUE
\copy (
  SELECT
    tc.table_name,
    tc.constraint_type,
    kcu.column_name,
    tc.constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('PRIMARY KEY','UNIQUE')
  ORDER BY tc.table_name, tc.constraint_type
) TO 'docs/db/exports/03_keys.csv' CSV HEADER;

-- Foreign Keys
\copy (
  SELECT
    tc.table_name AS child_table,
    kcu.column_name AS child_column,
    ccu.table_name AS parent_table,
    ccu.column_name AS parent_column,
    tc.constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.constraint_type = 'FOREIGN KEY'
  ORDER BY child_table, child_column
) TO 'docs/db/exports/04_foreign_keys.csv' CSV HEADER;

-- Views
\copy (
  SELECT table_name, view_definition
  FROM information_schema.views
  WHERE table_schema = 'public'
  ORDER BY table_name
) TO 'docs/db/exports/05_views.csv' CSV HEADER;

-- RLS Policies
\copy (
  SELECT
    n.nspname   AS schema,
    c.relname   AS table_name,
    p.polname   AS policy_name,
    p.polcmd    AS command,
    pg_get_expr(p.polqual, p.polrelid) AS using_expr,
    pg_get_expr(p.polwithcheck, p.polrelid) AS check_expr
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY table_name, policy_name
) TO 'docs/db/exports/06_rls_policies.csv' CSV HEADER;

-- Table sizes and row counts
\copy (
  SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
  FROM pg_tables t
  LEFT JOIN pg_stat_user_tables s ON t.tablename = s.relname
  WHERE t.schemaname = 'public'
  ORDER BY tablename
) TO 'docs/db/exports/07_table_stats.csv' CSV HEADER;
