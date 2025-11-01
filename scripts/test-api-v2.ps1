# Test /api/analyze with v2.2 flags
$json = @{ 
  big5 = @{ O=80; C=60; E=70; A=50; N=30 }
  mbti = 'INTP'
  reti = 6
} | ConvertTo-Json -Depth 5

Write-Output "Waiting for server to be ready..."
Start-Sleep -Seconds 3

Write-Output "Calling /api/analyze..."
try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3031/api/analyze' -Method Post -ContentType 'application/json' -Body $json
  Write-Output "Response:"
  $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
  Write-Output "Error: $_"
}

# Check shadow logs
$today = (Get-Date).ToString('yyyy-MM-dd')
$logPath = Join-Path $PWD "logs\engine_v2\$today.log"
if (Test-Path $logPath) {
  Write-Output "`n=== Shadow Log (last 5 entries) ==="
  Get-Content -Path $logPath -Tail 5
} else {
  Write-Output "`nNo shadow log found at: $logPath"
}


