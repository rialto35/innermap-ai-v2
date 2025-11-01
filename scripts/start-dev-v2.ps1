# Clear ports
$ports = 3000,3001,3002,3031
foreach ($port in $ports) {
  $pids = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
  if ($pids) {
    $pids | Where-Object { $_ -gt 0 } | ForEach-Object { 
      Try { Stop-Process -Id $_ -Force } Catch {} 
    }
  }
}
Write-Output "Ports cleared"

# Set environment variables
$env:IM_ENGINE_V2_ENABLED = 'true'
$env:IM_INNER9_NONLINEAR_ENABLED = 'true'
$env:IM_ANALYSIS_VERBOSE_LOG = 'true'

Write-Output "Starting dev server on port 3031 with v2.2 flags..."
npx next dev -p 3031


