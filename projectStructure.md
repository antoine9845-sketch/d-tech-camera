# 다움테크카메라 프로젝트 구조

## 📁 프로젝트 폴더 구조

```
d-tech-camera/
├── app.json
├── package.json
├── App.js
├── assets/
│   └── icons/
├── components/
│   ├── CategorySelector.js
│   ├── CameraScreen.js
│   ├── NotificationManager.js
│   └── MainNavigator.js
├── screens/
│   ├── InspectionListScreen.js
│   └── HomeScreen.js
├── utils/
│   ├── CameraUtils.js
│   ├── StorageUtils.js
│   └── NotificationHelper.js
└── lib/
    └── InspectionItems.js
```

## 📋 주요 기능 요약

1. **알림바 아이콘** 안드로이드 상단에서 촬영할 수 있는 퍼시스턴트 알림
2. **30개 점검 항목** 드롭다운/리스트로 선택 가능
3. **자동 저장** 선택한 항목명 폴더 + 타임스탬프 파일명에 저장
4. **내부 저장소** Pictures/TelecomInspection/ 디렉토리 구조