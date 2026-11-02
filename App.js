/**
 * 다움테크카메라 - 메인 앱 파일
 * 알림바 Persistent Notification, 카메라, 30개 점검 항목 지원
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, StatusBar, ActivityIndicator, Alert, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import { AppState } from "react-native";
import { SAVE_DIRECTORY } from "./lib/InspectionItems";

// Components
import NotificationManager from "./components/NotificationManager";
import InspectionListScreen from "./screens/InspectionListScreen";
import CameraScreen from "./screens/CameraScreen";

const Stack = createNativeStackNavigator();

// Notification Handler 설정 - 안전하게 처리
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (error) {
  console.warn("NotificationHandler 설정 실패 (무시됨):", error);
}

export default function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [hasActiveNotification, setHasActiveNotification] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const cameraRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // 알림 권한 요청 및 설정 - 거부해도 앱은 진행, 알림 기능만 비활성화
  const requestNotificationPermission = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      // 권한 거부 시에도 앱 진행 허용 (알림 기능만 끔)
      console.log("알림 권한 거부됨 - 알림 기능 비활성화 상태로 진행");
      setPermissionGranted(true); // 로딩 화면 해제
      return false;
    }

    setPermissionGranted(true);
    return true;
  }, []);

  // 촬영 아이콘 알림 생성 - 채널 준비 후, 실패 시 팝업 없이 조용히 처리
  const createCameraNotification = useCallback(async () => {
    // 채널 준비 대기 (최대 2초)
    const waitForChannel = () => new Promise((resolve) => {
      const check = setInterval(() => {
        if (channelReady) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(check); resolve(); }, 2000);
    });
    await waitForChannel();

    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "다움테크카메라",
            body: "클릭하여 점검 사진을 촬영하세요",
          },
        });
        setHasActiveNotification(true);
        console.log("알림 생성 완료");
      } catch (error) {
        console.warn("알림 생성 실패 (무시됨):", error);
        // Alert 제거 - 조용히 실패 처리
      }
    }
  }, [requestNotificationPermission, channelReady]);

  // 알림 채널 등록 (안드로이드 필요) - 안전하게 처리
  const [channelReady, setChannelReady] = useState(false);

  useEffect(() => {
    const registerNotificationChannel = async () => {
      try {
        await Notifications.setNotificationChannelAsync("camera-action", {
          name: "카메라 촬영",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF0000",
          showBadge: true,
        });
        setChannelReady(true);
      } catch (error) {
        console.warn("알림 채널 등록 실패 (무시됨):", error);
        setChannelReady(true); // 채널 실패해도 진행
      }
    };
    registerNotificationChannel();
  }, []);

  // 카메라 권한 요청
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === "granted";
  };

  // 사진 촬영 핸들러
  const takePicture = async () => {
    if (!cameraRef.current || !selectedItem) {
      Alert.alert("미리보기 오류", "항목을 먼저 선택해주세요.");
      return null;
    }

    if (!await requestCameraPermission()) {
      Alert.alert("권한 필요", "카메라 권한이 필요합니다.");
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
      });
      return photo;
    } catch (error) {
      console.error("촬영 실패:", error);
      Alert.alert("촬영 실패", "사진 촬영 중 오류가 발생했습니다.");
      return null;
    }
  };

  // 사진 저장 로직
  const savePhoto = async (photoUri, category) => {
    try {
      // 점검 항목 이름에서 폴더명으로 변환 (공백을 밑줄로 변경)
      const folderName = category.replace(/\s+/g, "_");

      // 촬영 날짜와 시간
      const date = new Date();
      const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(date.getDate()).padStart(2, "0")}_${String(
        date.getHours()
      ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(
        date.getSeconds()
      ).padStart(2, "0")}`;

      // 파일명 생성: 항목이름_타임스탬프.jpg
      const fileName = `${folderName}_${timestamp}.jpg`;

      // 저장 경로: Pictures/TelecomInspection/카테고리/
      const baseDirectory = `${FileSystem.documentDirectory}${SAVE_DIRECTORY}`;
      const destPath = `${baseDirectory}/${folderName}/${fileName}`;

      // 전체 경로에서 중간 경로 자동 생성 (폴더가 없으면 생성)
      await FileSystem.makeDirectoryAsync(baseDirectory, {
        intermediates: true,
      });
      await FileSystem.makeDirectoryAsync(
        `${baseDirectory}/${folderName}`,
        { intermediates: true }
      );

      // 파일 이동/복사
      await FileSystem.copyAsync({
        from: photoUri,
        to: destPath,
      });

      console.log("사진 저장 완료:", destPath);
      return destPath;
    } catch (error) {
      console.error("사진 저장 실패:", error);
      Alert.alert("저장 실패", "사진을 저장하는 중 오류가 발생했습니다.");
      return null;
    }
  };

  // 메인 앱 스크린
  const MainNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName="InspectionList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="InspectionList"
          component={InspectionListScreen}
          initialParams={{ selectedItem, setSelectedItem }}
          options={{ title: "점검 항목 선택" }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          initialParams={{
            takePicture,
            savePhoto,
            selectedItem,
          }}
          options={({ route }) => ({
            title: selectedItem || "점검 촬영",
            headerBackVisible: false,
          })}
        />
      </Stack.Navigator>
    );
  };

  // App 상태 감시 (앱을 백그라운드에서 포그라운드로 전환 시)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("앱이 백그라운드에서 활성화됨");
        setHasActiveNotification(true);
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // 초기화 (앱 시작 시 3초 후 알림 생성)
  useEffect(() => {
    const initTimer = setTimeout(() => {
      createCameraNotification();
    }, 3000);

    return () => clearTimeout(initTimer);
  }, [createCameraNotification]);

  if (!permissionGranted) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>권한 확인 중...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <NotificationManager onNotificationPress={() => {}} />
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});