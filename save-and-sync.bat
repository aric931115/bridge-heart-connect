@echo off
setlocal
cd /d "%~dp0"

set "MESSAGE=快速存檔"
if not "%~1"=="" set "MESSAGE=%~1"

echo ========================================
echo    雙擊即可：存檔並同步到 GitHub
echo ========================================
echo.
echo 這個檔案會自動幫你完成：git add、git commit、git push
echo.

echo 正在檢查 Git 狀態...
git status --short >nul 2>nul
if errorlevel 1 (
    echo [ERROR] 這不是 Git 專案，或 Git 未安裝。
    pause
    exit /b 1
)

git status --porcelain > "%TEMP%\git-status.txt" 2>nul
set "HAS_CHANGES="
for /f "usebackq delims=" %%i in ("%TEMP%\git-status.txt") do set "HAS_CHANGES=1"
if not defined HAS_CHANGES (
    echo 沒有新的修改，已是最新狀態。
    del "%TEMP%\git-status.txt" >nul 2>nul
    pause
    exit /b 0
)
del "%TEMP%\git-status.txt" >nul 2>nul

echo.
echo 正在加入修改...
git add .
if errorlevel 1 (
    echo [ERROR] git add 失敗
    pause
    exit /b 1
)

echo.
echo 正在提交...
git commit -m "%MESSAGE%"
if errorlevel 1 (
    echo [ERROR] git commit 失敗
    pause
    exit /b 1
)

echo.
echo 正在同步到 GitHub...
git push
if errorlevel 1 (
    echo [ERROR] git push 失敗
    pause
    exit /b 1
)

echo.
echo ✅ 已成功同步到 GitHub
pause
