/**
 * 카메라 촬영 화면
 * 실시간 프리뷰 및 사진 촬영
 */

import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import INSPECTION_ITEMS from "../lib/InspectionItems";

export default function CameraScreen({ route, navigation }) {
  const { takePicture, savePhoto, selectedItem } = route.params;
  const [previewUri, setPreviewUri] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef(null);

  // 카메라가 준비되었을 때
  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  // 카메라 프리뷰
  const renderCameraPreview = () => {
    return (
      <CameraView
        style={styles.cameraContainer}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
        onShutter={(e) => {
          console.log("쇼터 작동됨", e);
        }}
      />
    );
  };

  // 촬영 버튼
  const handleCapture = async () => {
    if (!cameraRef.current) {
      Alert.alert("촬영 실패", "카메라가 초기화되지 않았습니다.");
      return;
    }

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
        skipProcessing: false,
      });

      if (photo) {
        setPreviewUri(photo.uri);
        setCapturedImage(photo);
      }
    } catch (error) {
      console.error("촬영 오류:", error);
      Alert.alert("촬영 실패", "사진을 촬영하는 중 오류가 발생했습니다.");
    } finally {
      setIsCapturing(false);
    }
  };

  // 촬영된 사진 저장
  const handleSavePhoto = async () => {
    if (!previewUri) {
      return;
    }

    const category = selectedItem || "미분류";
    const savedPath = await savePhoto(previewUri, category);

    if (savedPath) {
      Alert.alert("저장 완료", `사진이 저장되었습니다.\n\n경로: ${savedPath}`, [
        {
          text: "확인",
          onPress: () => {
            setPreviewUri(null);
            setCapturedImage(null);
            navigation.goBack();
          },
        },
      ]);
    }
  };

  // 취소
  const handleCancel = () => {
    setPreviewUri(null);
    setCapturedImage(null);
    navigation.goBack();
  };

  // 프리뷰 뷰
  const renderPreview = () => {
    if (previewUri) {
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
          <View style={styles.previewOverlay}>
            <View style={styles.previewControls}>
              <TouchableOpacity
                style={[styles.controlButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isCapturing}
              >
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.saveButton]}
                onPress={handleSavePhoto}
                disabled={isCapturing}
              >
                <Ionicons name="checkmark" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.previewHint}>촬영 완료! 체크 버튼으로 저장</Text>
          </View>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>점검 촬영</Text>
            <Text style={styles.headerSubtext}>{selectedItem || "미분류"}</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.cameraContainer}>
          {renderCameraPreview()}
        </View>

        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonActive]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            <Ionicons name="camera" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraHint}>
          <Text style={styles.hintText}>스픽 재생 버튼으로 촬영</Text>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {renderPreview()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  headerSubtext: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 2,
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  captureButtonContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonActive: {
    opacity: 0.7,
  },
  cameraHint: {
    alignItems: "center",
    paddingBottom: 30,
  },
  hintText: {
    color: "#fff",
    fontSize: 14,
  },
  previewContainer: {
    flex: 1,
    position: "relative",
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 30,
    justifyContent: "space-between",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
  },
  saveButton: {
    backgroundColor: "#34c759",
  },
  previewHint: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});