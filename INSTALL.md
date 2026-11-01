# 다움테크카메라 빠른 설치 가이드

## 🎯 5분 만에 실행하기

### 1️⃣ 프로젝트 폴더로 이동
```bash
cd "C:\Users\tkdal\OneDrive\바탕 화면\omniroute-claude"
```

### 2️⃣ 패키지 설치
```bash
npm install
```

### 3️⃣ 빌드 및 실행
```bash
# 안드로이드 빌드 (시간이 조금 걸림)
npx expo prebuild --platform android

# 에뮬레이터에서 실행
npm run android
```

---

## 📋 필수 요구사항

| 항목 | 버전 | 비고 |
|------|------|------|
| Node.js | 16.x 이상 | [확인](https://nodejs.org) |
| NPM | 7.x 이상 | Node.js와 같이 설치 |
| 안드로이드 Studio | 최신 버전 | [다운로드](https://developer.android.com/studio) |

---

## 🔍 확인 사항

### ✅ 필수 폴더 구조
```
✅ App.js - 메인 앱
✅ lib/InspectionItems.js - 30개 점검 항목
✅ components/NotificationManager.js - 알림 관리
✅ screens/InspectionListScreen.js - 목록 화면
✅ screens/CameraScreen.js - 촬영 화면
✅ app.json - Expo 설정
✅ package.json - 의존성
```

### ✅ 핵심 기능 구현 완료
1. ✅ 알림바 Persistent Notification
2. ✅ 30개 점검 항목 드롭다운
3. ✅ 자동 폴더 생성 (Pictures/TelecomInspection/[항목명]/)
4. ✅ 타임스탬프 파일명 ([항목명]_YYYYMMDD_HHMMSS.jpg)
5. ✅ 안드로이드 권한 설정

---

## 🚀 테스트 방법

### 1단계: 알림 확인
앱이 시작되면 3초 후 알림바에:
- **아이콘**: 📷
- **제목**: "다움테크카메라"
- **본문**: "클릭하여 점검 사진을 촬영하세요"

### 2단계: 목록에서 항목 선택
1. 알림 클릭 → 점검 목록 화면 표시
2. 드롭다운에서 검색 또는 선택
3. "점검 사진을 촬영하세요" 아이콘 클릭

### 3단계: 촬영 및 저장
1. 카메라 프리뷰 확인
2. 쉐터 버튼 클릭 또는 스피커 재생
3. 저장 버튼 클릭
4. 사진 위치 확인

---

## 📂 저장 위치 확인

앱이 설치된 기기의 파일 경로:
```
/storage/emulated/0/Pictures/TelecomInspection/
├── 데이터전용_모뎀_OTT_기기/  ← 점검 항목명에 해당하는 폴더
├── LAN_스위치_패브릭/         ← 자동 생성
├── 인버터_축전지/
├── IT_상태감시/
├── ...
│
└── 예시 파일:
    ├── 데이터전용_모뎀_기기_20261101_143025.jpg
    └── LAN_스위치_케이블_20261101_143506.jpg
```

---

## 🆘 자주 발생하는 문제

### Q1: 알림이 표시되지 않음
```bash
# adb 명령어로 권한 확인
adb shell pm list packages | grep camera
adb shell pm grant com.kydtech.camera android.permission.POST_NOTIFICATIONS
```

### Q2: 카메라 사용 불가
- 설정 → 앱은 → 권한 → 카메라 ON
- 카메라 앱으로 테스트 후 다시 실행

### Q3: 저장 실패
```bash
# 파일 경로 확인
ldd -r --test d-tech-camera.apk
```

---

## 📊 기능 개요

### 30개 점검 항목 포함
| 카테고리 | 항목 수 | 예시 |
|----------|---------|------|
| 데이터 전용 기기 | 1개 | 데이터전용 모뎀 / OTT 기기 |
| LAN 전용선 | 1개 | LAN 스위치, 패브릭 커넥터 |
| 인버터/축전지 | 2개 | 인버터, 축전지(IPCC) |
| IT 상태감시 | 7개 | 역률, 케이블 콘센트 등 |
| 보안 Surveillance | 1개 | CCTV 모니터, 스위치 |
| 기타 IT 장비 | 8개 | 데이터인터페이스 등 |
| 앱 기능 테스트 | 10개 | 알림, 카메라, 폴더 생성 등 |

### UI/UX 특징
- 🎨 현대적 Material Design
- 🔍 즉시 검색 가능
- 📱 반응형 레이아웃
- 🌙 어두운 테마
- ✅ 직관적 인터페이스

---

## 📝 패키지 정보

| 항목 | 값 |
|------|-----|
| 패키지 ID | `com.kydtech.camera` |
| 앱 이름 | 다움테크카메라 |
| 버전 | 1.0.0 |
| SDK | Expo SDK 51 |
| 빌드일 | 2026-11-01 |

---

## 🎓 참고 자료

- [전체 문서](./README.md)
- [상세 설정 가이드](./SETUP.md)
- [앱 소스코드](./)
- [Vercel 배포](https://expo.dev) - 옵션

---

**시작하기 전에**: 안드로이드 에뮬레이터가 실행 중인지 확인하세요!

```bash
# 에뮬레이터 실행
adb devices
```

최소 2대의 권한 등록된 에뮬레이터가 있어야 합니다.