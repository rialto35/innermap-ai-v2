# Download Pretendard fonts for PDF rendering

$regularUrl = "https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Regular.ttf"
$boldUrl = "https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Bold.ttf"

$regularPath = "public/fonts/Pretendard-Regular.ttf"
$boldPath = "public/fonts/Pretendard-Bold.ttf"

Write-Host "Downloading Pretendard-Regular.ttf..."
try {
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($regularUrl, $regularPath)
    Write-Host "✓ Pretendard-Regular.ttf downloaded successfully"
} catch {
    Write-Host "✗ Failed to download Pretendard-Regular.ttf: $_"
}

Write-Host "Downloading Pretendard-Bold.ttf..."
try {
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($boldUrl, $boldPath)
    Write-Host "✓ Pretendard-Bold.ttf downloaded successfully"
} catch {
    Write-Host "✗ Failed to download Pretendard-Bold.ttf: $_"
}

Write-Host "`nFont download complete!"

