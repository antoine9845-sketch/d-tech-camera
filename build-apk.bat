@echo off
chcp 65001
echo ========================================
echo   다움테크카메라 APK 빌드 시작
echo ========================================
echo.

echo [1/5] 패키지 설치 확인 중...
call npm list 2>nul | find "expo" >nul
if %errorlevel% neq 0 (
    echo [%errorlevel%] 패키지가 설치되어 있지 않습니다. 설치를 시작합니다.
    call npm install
) else (
    echo 패키지가 이미 설치되어 있습니다.
)
echo.

echo [2/5] 안드로이드 파일 생성 (prebuild)...
call npx expo prebuild --platform android ^
  --clean
echo.

if not exist "android\gradlew.bat" (
    echo [오류] 안드로이드 폴더가 생성되지 않았습니다.
    pause
    exit /b 1
)

echo [3/5] Debug APK 빌드 중...
cd android
call .\gradlew.bat assembleDebug
cd ..
echo.

echo [4/5] APK 위치 확인...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo [✓ 성공] APK가 생성되었습니다!
    echo.
    echo 위치: %CD%\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo [5/5] 설치 방법:
    echo   1. 파일인식(기본 앱 열기)을 사용하여 APK 파일 엽니다.
    echo   2. 설치(Install) 버튼을 누릅니다.
    echo   3. 필요한 경우 권한을 허용합니다.
    echo.
) else (
    echo [오류] APK를 찾을 수 없습니다.
)
echo ========================================
echo   빌드 완료
echo ========================================
pause