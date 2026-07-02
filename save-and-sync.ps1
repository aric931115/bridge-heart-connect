param(
    [string]$Message = "快速存檔"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   雙擊即可：存檔並同步到 GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "這個檔案會自動幫你完成：git add、git commit、git push" -ForegroundColor Cyan
Write-Host ""

Write-Host "正在檢查 Git 狀態..." -ForegroundColor Yellow
$changes = git status --porcelain

if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "沒有新的修改，已是最新狀態。" -ForegroundColor Green
    Read-Host "按 Enter 鍵結束"
    exit 0
}

Write-Host "發現新的修改，正在提交..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git add 失敗" -ForegroundColor Red
    Read-Host "按 Enter 鍵結束"
    exit 1
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git commit 失敗" -ForegroundColor Red
    Read-Host "按 Enter 鍵結束"
    exit 1
}

Write-Host "正在同步到 GitHub..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ git push 失敗" -ForegroundColor Red
    Read-Host "按 Enter 鍵結束"
    exit 1
}

Write-Host "" 
Write-Host "✅ 儲存成功！" -ForegroundColor Green
Write-Host "✅ 已成功同步到 GitHub" -ForegroundColor Green
Write-Host "" 
Write-Host "你的變更已經被保存並上傳完成。" -ForegroundColor Cyan
Read-Host "按 Enter 鍵結束"
