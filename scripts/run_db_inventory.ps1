# InnerMap AI v2 - Database Inventory & ERD Generation
# 전체 프로세스를 자동화하는 메인 스크립트

Write-Host "🔍 InnerMap AI v2 - Database Inventory & ERD Generation" -ForegroundColor Cyan
Write-Host ""

# 1. 환경변수 확인
if (!$env:DATABASE_URL -and !$env:PGHOST) {
    Write-Host "❌ Database connection not found!" -ForegroundColor Red
    Write-Host "Please set DATABASE_URL or PGHOST environment variables" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Gray
    Write-Host "  `$env:DATABASE_URL = 'postgres://user:pass@host:port/dbname'" -ForegroundColor Gray
    Write-Host "  or" -ForegroundColor Gray
    Write-Host "  `$env:PGHOST = 'host'; `$env:PGPORT = '5432'; etc." -ForegroundColor Gray
    exit 1
}

# 2. PostgreSQL 클라이언트 확인
try {
    $psqlVersion = psql --version 2>$null
    if ($psqlVersion) {
        Write-Host "✅ PostgreSQL client found: $psqlVersion" -ForegroundColor Green
    } else {
        throw "psql not found"
    }
} catch {
    Write-Host "❌ PostgreSQL client (psql) not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools" -ForegroundColor Yellow
    exit 1
}

# 3. Node.js 확인
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 4. DB 메타데이터 수집
Write-Host "📊 Step 1: Collecting database metadata..." -ForegroundColor Yellow
try {
    if ($env:DATABASE_URL) {
        psql "$env:DATABASE_URL" -f scripts/db_inventory.sql
    } else {
        psql -f scripts/db_inventory.sql
    }
    
    # 결과 파일 확인
    $csvFiles = @(
        "docs/db/exports/01_tables.csv",
        "docs/db/exports/02_columns.csv", 
        "docs/db/exports/03_keys.csv",
        "docs/db/exports/04_foreign_keys.csv",
        "docs/db/exports/05_views.csv",
        "docs/db/exports/06_rls_policies.csv",
        "docs/db/exports/07_table_stats.csv"
    )
    
    $allExist = $true
    foreach ($file in $csvFiles) {
        if (Test-Path $file) {
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file (missing)" -ForegroundColor Red
            $allExist = $false
        }
    }
    
    if (!$allExist) {
        throw "Some CSV files were not generated"
    }
    
    Write-Host "✅ Database metadata collection completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Database metadata collection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 5. 테이블 사용처 스캔
Write-Host "🔍 Step 2: Scanning table usage in codebase..." -ForegroundColor Yellow
try {
    & "scripts/scan_table_usage.ps1"
    if (Test-Path "docs/db/exports/08_table_usage.md") {
        Write-Host "✅ Table usage scan completed" -ForegroundColor Green
    } else {
        throw "Usage scan output not found"
    }
} catch {
    Write-Host "❌ Table usage scan failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 6. DBML 생성
Write-Host "🎨 Step 3: Generating DBML ERD..." -ForegroundColor Yellow
try {
    node scripts/gen_dbml_from_csv.js
    if (Test-Path "docs/erd/innermap_v2_auto.dbml") {
        Write-Host "✅ DBML generation completed" -ForegroundColor Green
    } else {
        throw "DBML file not generated"
    }
} catch {
    Write-Host "❌ DBML generation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 7. 결과 요약
Write-Host "📋 Results Summary:" -ForegroundColor Cyan
Write-Host "  📁 Database exports: docs/db/exports/" -ForegroundColor White
Write-Host "  📊 Table usage map: docs/db/exports/08_table_usage.md" -ForegroundColor White
Write-Host "  🎨 DBML ERD: docs/erd/innermap_v2_auto.dbml" -ForegroundColor White
Write-Host ""

# 8. 품질 검증
Write-Host "🔍 Quality Check:" -ForegroundColor Cyan

# 핵심 테이블 존재 확인
$coreTables = @("users", "test_assessments", "test_assessment_results", "user_profiles")
$tablesCsv = Import-Csv "docs/db/exports/01_tables.csv"
$foundTables = $tablesCsv | Select-Object -ExpandProperty tablename

foreach ($table in $coreTables) {
    if ($foundTables -contains $table) {
        Write-Host "  ✅ $table" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $table (missing)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Database inventory and ERD generation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review docs/erd/innermap_v2_auto.dbml" -ForegroundColor White
Write-Host "  2. Upload to dbdiagram.io for visual ERD" -ForegroundColor White
Write-Host "  3. Commit changes: git add docs/ && git commit -m 'chore(db): export schema & ERD'" -ForegroundColor White

