@echo off
title 다움테크카메라 APK 빌드 및 설치 안내
chcp 65001 >nul

echo ==========================================
echo   다움테크카메라 APK 빌드 및 설치
echo ==========================================
echo.

REM ── 1. Java 확인 ──
echo [1/5] Java 설치 확인...
if defined JAVA_HOME (
    echo ✓ JAVA_HOME 설정됨: %JAVA_HOME%
) else (
    echo ✗ JAVA_HOME 미설정됨
    echo.
    echo [방법] Java 17 이상 설치 후 재실행:
    echo   1. https://adoptium.net/ 에서 OpenJDK 17 다운로드
    echo   2. 설치 후 컴퓨터 재시작
    echo   3. 이 스크립트 다시 실행
    pause
    exit /b 1
)

REM ── 2. npm install ──
echo.
echo [2/5] npm 패키지 설치 확인...
cd /d "C:\Users\tkdal\OneDrive\바탕 화면\omniroute-claude"
npm install 2>&1 | find "added" >nul
if %errorlevel% equ 0 (
    echo ✓ npm 패키지 설치 완료
) else (
    echo ! npm 설치 오류 - 다시 시도합니다.
    npm install
)

REM ── 3. Expo prebuild ──
echo.
echo [3/5] 안드로이드 프로젝트 파일 생성...
npx expo prebuild --platform android --clean 2>&1 | find "Successfully" >nul
if %errorlevel% equ 0 (
    echo ✓ 안드로이드 프로젝트 생성 완료
) else (
    echo ! prebuild 오류 확인 로그 필요
)

REM ── 4. Gradle APK 빌드 ──
echo.
echo [4/5] Debug APK 빌드 중... (약 5-10분 소요)
cd /d android
call gradlew.bat assembleDebug 2>&1 | find "BUILD" >nul
if %errorlevel% equ 0 (
    echo ✓ Debug APK 빌드 완료
) else (
    echo ! Gradle 빌드 오류 - 로그 확인 필요
    gradlew.bat assembleDebug 2>&1 | tail -30
)

REM ── 5. APK 위치 안내 ──
echo.
echo [5/5] 설치 파일 안내
echo.
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo ✓ APK 파일 위치:
    echo.
    echo   %CD%\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo [갤럭시 핸드폰에 설치 방법]
    echo   1. 파일 탐색기에서 위 경로의 app-debug.apk 파일 클릭
    echo   2. "설치" 버튼 클릭
    echo   3. "확인" 클릭 (보안 경고 경우)
    echo   4. 앱 런치 → "다움테크카메라" 실행
    echo.
    echo [주요 기능 테스트]
    echo   - 상단 알림바 📷 아이콘 클릭
    echo   - 점검 항목 30개 드롭다운 선택
    echo   - 카메라 촬영 후 자동 저장
    echo   - Pictures/TelecomInspection/[항목명]/ 폴더 저장
) else (
    echo ! APK 파일을 찾을 수 없음
    echo   android\app\build\outputs\apk\debug\ 경로 확인
)

echo.
echo ==========================================
echo   종료
echo ==========================================
pause