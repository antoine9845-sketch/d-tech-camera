# 📱 안드로이드 APK 빌드 및 설치 가이드

## 📋 목차
1. [로컬에서 APK 빌드](#1-로컬에서-apk-빌드) - 권장
2. [EAS Build 사용](#2-eas-build-사용) - 클라우드 빌드
3. [기기에서 직접 실행](#3-기기에서-직접-실행) - 빠른 테스트
4. [설치 방법](#4-설치-방법)

---

## 1️⃣ 로컬에서 APK 빌드 (권장)

### 최소 사전 요구사항
- ✅ Node.js 16.x 이상 ([설치](https://nodejs.org))
- ✅ Android Studio ([설치](https://developer.android.com/studio))
- ✅ JDK 8 또는 11
- ✅ 안드로이드 SDK (Android API 24 이상)
- ✅ 에뮬레이터 또는 실제 안드로이드 기기

### Windows 사용자
```bash
# 1. 프로젝트 폴더로 이동
cd "C:\Users\tkdal\OneDrive\바탕 화면\omniroute-claude"

# 2. 설치된 npm 패키지 확인 (없으면 설치)
npm install

# 3. APK 빌드 (실행)
build-apk.bat

# 또는手動으로 실행:
npx expo prebuild --platform android
cd android
gradlew.bat assembleDebug
```

### Mac/Linux 사용자
```bash
# 1. 프로젝트 폴더로 이동
cd "/Users/tkdal/OneDrive/바탕 화면/omniroute-claude"

# 2. 설치된 npm 패키지 확인 (없으면 설치)
npm install

# 3. APK 빌드 권한 부여 (Mac 설치 시)
chmod +x build-apk.sh
./build-apk.sh

# 또는手動으로 실행:
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

### 빌드 결과 확인
```bash
# 결과 위치
android/app/build/outputs/apk/debug/app-debug.apk

# 파일 크기 확인
# 일반적으로 20-80MB (용량은 의존성에 따라 다름)
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 2️⃣ EAS Build 사용 (클라우드 빌드)

### 장점
- 🚀 내 컴퓨터 설정 불필요
- 🏭 CI/CD 자동화 가능
- 🌍 여러 플랫폼 동시 빌드
- 🔒 안전한 빌드 환경

### 사전 준비
1. [참가 신청](https://expo.dev/signup) (무료)
2. 트위터 OAuth 로그인
3. EAS CLI 설치
```bash
npm install -g eas-cli
eas login
```

### EAS 프로젝트 설정
```bash
# 프로젝트 초기화
eas build:configure

# manifest.json을 직접 설정 파일로 사용할 경우
```

### Debug 빌드 (무료)
```bash
# 2분 내외 소요
eas build --platform android --profile debug
```

### Release 빌드 구성
```bash
# 프로필 생성
eas build:configure

# 구성된 URL에서 다운로드
open ~\/Library\/Developer\/Xcode\/DerivedData\/TWTeam-*/...\/app-release.apk
```

### 빌드 결과 확인
```bash
# 진행 상황 확인
eas build:list

# 빌드 URL에서 직접 다운로드
# https://expo.dev/accounts/<username>/projects/d-tech-camera/builds/<build-id>
```

---

## 3️⃣ 기기에서 직접 실행 (빠른 테스트)

### 방법 A: Expo Go 앱 사용

#### 사전 준비
1. 안드로이드 기기에서:
   - Google Play에서 **Expo Go** 앱 설치
   - 노트: 이 방식은 프로덕션용이 아님

#### 실행 방법
```bash
# 1. Expo 서버 실행
npm start

# 2. 안드로이드 기기와 PC를 동일 Wi-Fi에 연결
# 3. 터미널에서 입력:
a - Android (Expo Go)
```

#### 장점
- ✅ 즉시 실행 가능
- ✅ 편집 후 재시작만으로 반영
- ✅ 무료

#### 단점
- ❌ 프로덕션용 아님
- ❌ 강력한 기능 제한 (카메라, 알림 등)
- ❌ 실제 사용 불가

---

### 방법 B: Expo Dev Client (추천)

#### 사전 준비
```bash
# 1. 패키지 설치
npm install

# 2. 안드로이드 파일 생성
npx expo prebuild --platform android --clean

# 3. APK 빌드
cd android
gradlew assembleDebug
```

#### 설치 방법
1. 빌드된 APK를 스마트폰으로 전송
2. 파일 인식(기본 앱 열기)으로 엽니다
3. 설치(Install) 버튼 누릅니다

#### 이 방식의 장점
- ✅ 카메라, 알림 등 강력 기능 사용 가능
- ✅ 프로덕션 배포 가능
- ✅ 로컬 네트워크에서 즉시 실행
- ✅ APK 파일로 배포 가능

---

## 4️⃣ 기기에 설치하기

### 방법 1: USB로 직접 설치

#### 안드로이드 설정
1. 기기 설정 → 개발자 옵션
2. USB 디버깅 켬 (설치 패널 가져오기 허용)

#### PC에서 설치
```bash
# 에뮬레이터인 경우
adb devices
adb start-server
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 파일 전송 후 파일 관리자에서 설치
adb push android/app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
```

#### 기기에서 설치
1. 파일 관리자에서 'app-debug.apk' 선택
2. "설치할 앱?" 클릭
3. "설치" 버튼 누릅니다
4. "보안 설정" → "알 수 없는 소스" > "설정 후 계속" (필요시)

---

### 방법 2: 웹 브라우저로 전송

#### PC에서 웹 서버 실행 (각 폴더에서)
```bash
# HTTP 서버 시작
npx serve -s android/app/build/outputs/apk/debug

# 또는 Python 3 사용
python -m http.server 8000

# 또는 Node의 http-server
npx http-server
```

#### 기기에서 접속
1. PC와 스마트폰 동일 Wi-Fi 연결
2. PC IP 확인 (Windows: ipconfig; Mac: ifconfig)
3. 브라우저에서 접속: `http://[PC_IP]:8000/app-debug.apk`
4. 다운로드 후 설치

---

### 방법 3: 이메일 또는 메신저 전송

1. APK 파일을 기기로 이메일로 전송
2. 첨부 파일 클릭 → "설치" (파일 인식)
3. 설치 진행

---

## 📱 기기별 설치 방법

### Samsung Galaxy
1. 파일 다운로드
2. "기본 앱 열기" → 다운로드된 애플리케이션 인식
3. "설치" → "완료" → "열기"

### Google Pixel
1. "파일을 다운로드했습니다." 토스트 확인
2. 파일 관리자에서 파일 클릭
3. "설치" → APK 정보 확인 → "계속" → "설치"

### LG
1. 다운로드 목록에서 파일 선택
2. "설치" 버튼 클릭
3. "보안 설정" → "알 수 없는 출처" → "설정 후 계속"

---

## 🔧 여러 기기에 동시 설치

### 사용자 단위로 APK 배포
```bash
# 국내에서는 주로 이 방법 사용
# 1. 빌드된 APK를 각 사용자에게 파일 첨부
# 2. 각 기기에서 APK 열기 및 설치
# 3. 각 사용자에게 사용법 문서 전달
```

### 장치 제조사별 배포
```bash
# LG 배포 시:
adb devices
adb install -r app-debug.apk
# 각 기기에서 반복

# Enterprise (회사 배포) 시:
# - 테스트 배포 패키지로 배포
# - AirDroid, Scrcpy 등을 이용한 원격 설치
```

---

## 🐛 빌드 문제 해결

### 문제 1: gradlew.exe 찾을 수 없음
```bash
# Windows:
npx expo prebuild --clean
cd android
.\gradlew.bat assembleDebug

# Mac/Linux:
./gradlew assembleDebug
```

### 문제 2: 권한 거부
```bash
# AndroidManifest.xml 확인
# 권한 추가:
- android.permission.CAMERA
- android.permission.WRITE_EXTERNAL_STORAGE
- android.permission.READ_EXTERNAL_STORAGE
- android.permission.POST_NOTIFICATIONS
```

### 문제 3: 충돌 또는 블루스크린
```bash
# 안드로이드 SDK 업데이트
sdkmanager "Android SDK Build-Tools 34.0.0"

# Gradle 캐시 삭제
cd android
rm -rf .gradle
./gradlew clean
cd ..
npx expo prebuild --clean
```

### 문제 4: 앱이 설치되지 않음
```bash
# 기존 버전 삭제 버튼 추가
apk install --uninstall app-debug.apk

# 또는 기기에서 보안 설정 → 알 수 없는 소스 ON
```

---

## 📊 빌드 시간 예상

| 빌드 방식 | 예상 시간 | 비용 |
|----------|---------|------|
| 로컬 Debug | 3-10분 | 무료 |
| 로컬 Release | 10-30분 | 무료 |
| EAS Build Debug | 2-5분 | 무료 (최대 30일) |
| EAS Build Release | 5-15분 | 유료 (Dream Plan 100개까지) |

---

## ✅ 빌드 전체 체크리스트

- [ ] Node.js 16.x 이상 설치 확인
- [ ] npm install 완료
- [ ] 안드로이드 Studio 설치 완료
- [ ] 안드로이드 SDK API 24 이상
- [ ] npx expo prebuild 실행 완료
- [ ] android 디렉토리 생성 확인
- [ ] gradlew 실행 권한 확인 (Linux/Mac)
- [ ] APK 빌드 완료
- [ ] APK 파일 크기 확인 (20-80MB)
- [ ] 기기에서 정상 설치 확인
- [ ] 카메라 기능 테스트
- [ ] 알림 기능 테스트
- [ ] 저장 위치 확인

---

## 📞 추가 지원

### 도움말 문서
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [차트리 빌드 문서](https://docs.expo.dev/build/introduction)

### EAS 빌드 터미널 명령어
```bash
# EAS 로그인
eas login

# 프로젝트 등록
eas project:register

# 빌드 진행 상황 조회
eas build:list

# 빌드 로그 확인
eas build:logs

# 그라들 버전 확인
eas build -p android --profile debug --verbose
```

---

## 🎯 추천 실행 순서

### 1단계: 로컬 Debug 빌드
```bash
npm install
npx expo prebuild --platform android --clean
cd android && gradlew.bat assembleDebug
```

**→ APK 생성 수 10분 내외 → 기기에 설치 및 테스트**

### 2단계: 프로덕션 배포 준비
```bash
# 서명 키 생성
keytool -genkey -v -keystore release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# Release APK 빌드
cd android
./gradlew assembleRelease -- keystores ...
```

### 3단계: EAS 배포 (선택)
```bash
eas build --platform android --profile production
```

---

**작성일**: 2026-11-01
**최종 업데이트**: 2026-11-01