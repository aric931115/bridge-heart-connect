Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Bridge Heart Connect - 開發伺服器啟動" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Node.js
Write-Host "正在檢查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 找不到 Node.js！請先安裝 Node.js" -ForegroundColor Red
    Write-Host "   下載網址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按 Enter 鍵結束"
    exit 1
}

# 檢查 npm
Write-Host "正在檢查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version 2>$null
    Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 找不到 npm！請重新安裝 Node.js" -ForegroundColor Red
    Read-Host "按 Enter 鍵結束"
    exit 1
}

Write-Host ""
Write-Host "正在安裝依賴套件 (如果需要的話)..." -ForegroundColor Yellow
& npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 安裝依賴失敗！" -ForegroundColor Red
    Read-Host "按 Enter 鍵結束"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 啟動開發伺服器..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "應用程式將在以下網址開啟：" -ForegroundColor Green
Write-Host "  http://localhost:8080/" -ForegroundColor Green
Write-Host ""
Write-Host "按 Ctrl+C 可以停止伺服器" -ForegroundColor Yellow
Write-Host ""

& npm run dev

Read-Host "按 Enter 鍵結束"