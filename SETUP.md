# 다움테크카메라 설정 및 빌드 가이드

## 📋 필수 사전 준비

### 1. Node.js 설치
- Node.js 16.x 이상 버전 권장
- 설치 확인: `node --version`

### 2. NPM 또는 Yarn 설치
- NPM: 이미 Node.js와 함께 설치됩니다
- Yarn 선택적: `npm install -g yarn`

### 3. 안드로이드 개발 환경
- Android Studio 설치
- SDK 및 Emulator 설정

---

## 🚀 빌드 절차 (안드로이드)

### 단계 1: 프로젝트 클론 또는 폴더 이동
```bash
# 현재 위치 확인
pwd

# 프로젝트가 있는지 확인
ls -la
```

### 단계 2: 의존성 패키지 설치
```bash
npm install
# 또는
yarn install
```

### 단계 3: 안드로이드 프리빌드 (패키지화)
```bash
npx expo prebuild --platform android
```

이 명령은:
- `android/` 폴더 생성 (Gradle 프로젝트)
- 앱 매니페스트 설정
- 리소스 포함
- 안드로이드 네이티브 코드 준비

### 단계 4: Android Studio에서 빌드 (선택)

1. Android Studio 실행
2. File → Open → `android/` 폴더 선택
3. Gradle 동기화 기다림
4. 빌드 타겟 선택 (Pixel 5, Galaxy S21 등)
5. Run('▶') 버튼 클릭

### 단계 5: 명령줄로 빌드 (빠른 방법)
```bash
# 에뮬레이터가 실행 중이고 터미널에서
npm run android
```

---

## 📱 실행 및 테스트

### 에뮬레이터 필수
- Google Play Services 포함된 에뮬레이터 권장
- API 24 (Android 7.0) 이상 권장

### 방법 1: Expo Dev Client
```bash
# 항상 이 방법을 사용하세요
npx expo start --android
```

### 방법 2: 안드로이드 스토어 배포
1. APK 생성: `android/gradlew assembleRelease`
2. 구글 Play Console에서 업로드

---

## 🔐 권한 설정 확인

`app.json`에 자동으로 다음이 포함됩니다:
```json
"android": {
  "permissions": [
    "android.permission.CAMERA",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.POST_NOTIFICATIONS"
  ]
}
```

### 권한 요청 절차 (안드로이드 13+)
```bash
# 앱 설치 후 '{"toasts_allowed": true}' 허용
# 또는 Settings → Apps → 다움테크카메라 → Permissions
```

---

## 🐛 문제 해결

### 문제 1: npm install 실패
```bash
# 캐시 재설정 및 재설치
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 문제 2: prebuild 실패
```bash
# Expo SDK 일치 확인
npm list expo
npm install expo@~51.0.0 --save-exact

# 다시 시도
npx expo prebuild --clean --platform android
```

### 문제 3: 권한 거부 오류
- 안드로이드 설정에서 개발자 옵션 활성화 (USB 디버깅)
- 설치된 앱 패키지 ID 확인: `com.kydtech.camera`

### 문제 4: 알림 표시 안 됨
```bash
# adb 명령어로 테스트
adb shell pm grant com.kydtech.camera android.permission.POST_NOTIFICATIONS
```

---

## 📦 빌드 결과물

### 로컬 실행
- 에뮬레이터/IP로 접속
- QR 코드 스캔 또는 URL 입력

### 배포용 APK
```bash
# 디지털 서명 (keystore 필요)
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# APK 빌드
./android/gradlew assembleRelease --keystore myfile.jks \
  -my-key-alias
```

---

## 📊 기능 테스트 체크리스트

- [ ] 알림바에서 카메라 아이콘 표시
- [ ] 알림 클릭 시 점검 목록 화면 호출
- [ ] 점검 항목 드롭다운 검색 작동
- [ ] 카메라 촬영 기능
- [ ] 카메라 프리뷰 실시간
- [ ] 사진 저장 폴더 생성 자동
- [ ] 파일명 타임스탬프 포함
- [ ] 촬영 후 저장/취소 기능

---

## 🎯 최적화 및 추가 개발

### 썸네일 이미지 추가
```bash
mkdir -p assets/icons
# PNG 파일을 assets/icons/ 에 배치:
# - app-icon.png (1024x1024)
# - adaptive-icon.png (512x512)
# - splash.png (1024x1024)
```

### 구글 Play 배포 가이드
1. [구글 Play Console](https://play.google.com/console) 접속
2. 새 앱 등록
3. APK 업로드
4. 서비스 조건 확인 및 제출
5. 3~5일 검수 대기

---

## 📞 지원

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [expo-notifications API](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

**작성일**: 2026-11-01
**대상**: 안드로이드 7.0 이상
**SDK 버전**: Expo SDK 51+