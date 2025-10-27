# InnerMap AI v2 - Table Usage Scanner (PowerShell)
# 코드베이스에서 각 테이블 사용처를 자동 스캔

param(
    [string]$OutputPath = "docs/db/exports/08_table_usage.md"
)

# 출력 디렉토리 생성
$outputDir = Split-Path $OutputPath -Parent
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# 헤더 작성
@"
# Table Usage Map (auto-generated)

"@ | Out-File -FilePath $OutputPath -Encoding UTF8

# 테이블 목록 읽기
$tablesCsv = "docs/db/exports/01_tables.csv"
if (!(Test-Path $tablesCsv)) {
    Write-Error "Tables CSV not found: $tablesCsv"
    exit 1
}

$tables = Import-Csv $tablesCsv | Select-Object -ExpandProperty tablename

foreach ($table in $tables) {
    Write-Host "Scanning usage for table: $table"
    
    # 테이블 섹션 헤더
    @"

## $table

"@ | Out-File -FilePath $OutputPath -Append -Encoding UTF8
    
    # 검색 패턴들
    $patterns = @(
        "from\(['`"]$table['`"]\)",
        "public\.$table\b",
        "['`"]$table['`"]",
        "\.$table\b"
    )
    
    $found = $false
    
    foreach ($pattern in $patterns) {
        try {
            # src와 app 디렉토리에서 검색
            $results = Get-ChildItem -Path "src", "app" -Recurse -File -Include "*.ts", "*.tsx", "*.js", "*.jsx" | 
                Select-String -Pattern $pattern -AllMatches
            
            if ($results) {
                foreach ($result in $results) {
                    $line = "- $($result.Filename):$($result.LineNumber): $($result.Line.Trim())"
                    $line | Out-File -FilePath $OutputPath -Append -Encoding UTF8
                    $found = $true
                }
            }
        }
        catch {
            # 검색 실패는 무시
        }
    }
    
    if (!$found) {
        "- No usage found" | Out-File -FilePath $OutputPath -Append -Encoding UTF8
    }
    
    "" | Out-File -FilePath $OutputPath -Append -Encoding UTF8
}

# 푸터 추가
@"

> Generated on $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
"@ | Out-File -FilePath $OutputPath -Append -Encoding UTF8

Write-Host "Table usage scan completed: $OutputPath"
