@echo off
echo ========================================
echo   다움테크카메라 빠른 빌드 스크립트
echo ========================================
echo.

REM 노드.js가 설치되어 있는지 확인
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [경고] Node.js가 설치되지 않았습니다.
    echo https://nodejs.org/ 에서 다운로드 후 재시도하세요.
    pause
    exit /b 1
)

echo 1/3 패키지 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo [오류] 수취이 실패했습니다.
    pause
    exit /b 1
)

echo.
echo 2/3 안드로이드 파일 생성 중...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo [오류] prebuild 실패했습니다.
    pause
    exit /b 1
)

echo.
echo 3/3 Debug APK 빌드 중...
cd android
call .\gradlew.bat assembleDebug
cd ..
echo.

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo [✓] APK 생성 성공!
    echo.
    echo 위치: %CD%\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo ===== 설치 방법 =====
    echo 1. 이 APK 파일을 스마트폰으로 전송하세요.
    echo 2. 파일 인식(기본 앱 열기)을 사용하여 APK 파일 엽니다.
    echo 3. 설치(Install) 버튼을 누릅니다.
    echo 4. 필요한 경우 권한을 허용합니다.
    echo.
    echo ===== 기능 테스트 =====
    echo - 알림바 아이콘 확인 (앱 시작 후 3초)
    echo - 점검 항목 목록 확인
    echo - 카메라 촬영 기능
    echo - 저장 위치 확인 (내부 저장소/Pictures/TelecomInspection/)
    echo.
) else (
    echo [오류] APK를 찾을 수 없습니다.
)

echo ========================================
pause