/**
 * Persistent Notification Manager
 * 안드로이드 알림바에서 카메라 촬영 아이콘 제공
 */

import React, { useCallback, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

const NOTIFICATION_ID = "camera-notification";

export default function NotificationManager({ onNotificationPress }) {
  const notificationListener = useRef();
  const responseListener = useRef();

  // 알림 채널 등록 - 안전하게 처리
  useEffect(() => {
    const registerNotificationChannel = async () => {
      try {
        await Notifications.setNotificationChannelAsync("camera-action", {
          name: "카메라 촬영",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF6B00",
          showBadge: true,
        });
      } catch (error) {
        console.warn("알림 채널 등록 실패 (무시됨):", error);
      }
    };
    registerNotificationChannel();
  }, []);

  // 수신 알림 리스너 - 안전하게 정리
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("알림 수신:", notification);
      }
    );

    // 액션 알림 리스너
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("알림 응답:", response);
        const action = response.notification.request.content.data.action;
        if (action === "take_photo" && onNotificationPress) {
          onNotificationPress();
        }
      }
    );

    return () => {
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, [onNotificationPress]);

  return null;
}