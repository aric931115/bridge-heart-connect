@echo off
echo ========================================
echo    Bridge Heart Connect - Dev Server
echo ========================================
echo.

@echo off
echo ========================================
echo    Bridge Heart Connect - Dev Server
echo ========================================
echo.

cd /d "%~dp0"

REM Add Node.js to PATH if not already there
set "NODE_PATH=C:\Program Files\nodejs"
if exist "%NODE_PATH%\node.exe" (
    set "PATH=%NODE_PATH%;%PATH%"
)

echo Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js first
    echo Download: https://nodejs.org/
    echo Make sure Node.js is in your PATH
    pause
    exit /b 1
)

echo Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found! Please reinstall Node.js
    pause
    exit /b 1
)

echo.
echo Installing dependencies (if needed)...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo         Starting Dev Server...
echo ========================================
echo.
echo App will be available at:
echo   http://localhost:8080/
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause