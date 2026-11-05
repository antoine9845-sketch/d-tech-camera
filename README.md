# ㅇㅇ테크카메라 (D-Tech Camera)

안드로이드 스마트폰용 알림바 기반 점검 사진 촬영 자동화 앱

## 📱 주요 기능

1. **알림바 Persistent Notification**
   - 안드로이드 상단 알림바에서 즉시 점검 사진 촬영 가능
   - 앱 실행 시 3초 후 자동 알림 생성

2. **30개 점검 항목 드롭다운/리스트**
   - 그룹화된 카테고리별 점검 목록
   - 검색 기능으로 빠른 항목 선택
   - 개별 항목 선택 및 리스트 표시

3. **자동 저장 로직**
   - 선택한 점검 항목명으로 하위 폴더 자동 생성
   - 타임스탬포 형식의 파일명: `항목명_YYYYMMDD_HHMMSS.jpg`
   - 내부 저장소: `Pictures/TelecomInspection/항목명/`

4. **카메라 촬영 화면**
   - 실시간 프리뷰
   - 스피커 재생으로 촬영 가능
   - 촬영 후 저장/취소 선택

## 🚀 시작하기

### 사전 준비

**npm 패키지 설치**
```bash
npm install
# 또는
yarn install
```

### 안드로이드 빌드

```bash
# Expo Dev Client로 실행
npx expo prebuild --platform android

# 에뮬레이터/기기에서 실행
npm run android

# 또는 직접 실행
expo start --android
```

### iOS 빌드 (Mac only)
```bash
npx expo prebuild --platform ios
npm start
```

## 📋 권한 요청

앱에는 다음 권한이 필요합니다:
- 🔵 카메라 (`android.permission.CAMERA`)
- 💾 파일 시스템 (`android.permission.WRITE_EXTERNAL_STORAGE`, `android.permission.READ_EXTERNAL_STORAGE`)
- 🔔 알림 (`android.permission.POST_NOTIFICATIONS`)

`app.json`에서 권한이 자동으로 구성됩니다.

## 📂 프로젝트 구조

```
d-tech-camera/
├── App.js                    # 메인 앱 파일
├── app.json                 # Expo 설정
├── package.json             # 의존성
├── lib/
│   └── InspectionItems.js   # 30개 점검 항목 목록
├── components/
│   └── NotificationManager.js  # 알림 관리자
├── screens/
│   ├── InspectionListScreen.js  # 점검 목록 화면
│   └── CameraScreen.js          # 카메라 촬영 화면
└── assets/
    └── icons/              # 앱 아이콘
```

## 🔧 주요 의존성

```json
{
  "expo": "~51.0.0",
  "expo-camera": "~15.0.0",
  "expo-notifications": "~0.28.0",
  "expo-file-system": "~17.0.0",
  "react-native-dropdown-picker": "^5.4.6",
  "react-native-safe-area-context": "^4.10.0",
  "react-native-screens": "~3.31.0"
}
```

## 💡 사용법

1. **앱 시작**
   - 알림바에서 카메라 아이콘 클릭하면 바로 촬영
   - 점검 항목 선택 화면에서 원하는 항목 선택

2. **점검 항목 선택**
   - 드롭다운에서 직접 선택
   - 리스트에서 검색 후 항목 클릭
   - 선택한 항목명으로 폴더 자동 생성

3. **사진 촬영**
   - 촬영 버튼 클릭 또는 스피커 재생
   - 프리뷰 확인 후 저장/취소

4. **사진 저장**
   - 자동으로 Pictures/TelecomInspection/[항목명]/ 파일에 저장
   - 파일명: [항목명]_20261101_143025.jpg

## 🐛 문제 해결

### 알림이 표시되지 않음
- 알림 권한이 허용되었는지 확인
- `expo-notifications` 모듈이 올바르게 설치되었는지 확인

### 카메라 미리보기 안됨
- 카메라 권한이 허용되었는지 확인
- `expo-camera` 버전이 최신인지 확인

### 사진이 저장되지 않음
- 파일 시스템 쓰기 권한이 있는지 확인
- `Pictures/TelecomInspection` 디렉토리가 생성되었는지 확인

## 📄 라이선스

MIT License

---

**개발사**: ㅇㅇ테크
**버전**: 1.0.0
**빌드된 날짜**: 2026-11-01
