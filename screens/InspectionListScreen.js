/**
 * 점검 목록 화면
 * 30개 점검 항목을 드롭다운/리스트로 제공
 */

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Dropdown from "react-native-dropdown-picker";
import INSPECTION_ITEMS from "../lib/InspectionItems";

export default function InspectionListScreen({ route, navigation }) {
  const { selectedItem, setSelectedItem } = route.params || {
    selectedItem: null,
    setSelectedItem: () => {},
  };

  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 검색필터
  const filteredItems = INSPECTION_ITEMS.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 드롭다운 항목 변환
  const dropdownItems = filteredItems.map((item, index) => ({
    label: item,
    value: item,
    id: index + 1,
  }));

  // 카메라 화면으로 이동
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    navigation.navigate("Camera", {
      takePicture: global.takePicture || (() => null),
      savePhoto: global.savePhoto || (() => null),
      selectedItem: item,
    });
    setDropdownOpen(false);
  };

  // 개별 항목 클릭
  const handleItemClick = (item) => {
    setSelectedItem(item);
    navigation.navigate("Camera", {
      selectedItem: item,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>다움테크카메라</Text>
        <Text style={styles.subtitle}>점검 항목 선택</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="점검 항목 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.dropdownContainer}>
        <Dropdown
          label="점검 항목 선택"
          open={dropdownOpen}
          value={dropdownValue}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          onSelectItem={(item) => handleSelectItem(item.value)}
          textStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownItemText}
          containerStyle={styles.dropdownContainerStyle}
          containerProps={{ disabled: false }}
          selectedItemContainerStyle={styles.dropdownSelectedContainerStyle}
          dropDownContainerStyle={styles.dropdownListContainerStyle}
          maxHeight={300}
          search={true}
          searchPlaceholder="항목 검색..."
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>{filteredItems.length}개 항목</Text>
        <FlatList
          data={filteredItems}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => handleItemClick(item)}
            >
              <View style={styles.itemLeft}>
                <View style={styles.checkCircle}>
                  {selectedItem === item && (
                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                  )}
                </View>
                <Text
                  style={[
                    styles.itemText,
                    selectedItem === item && styles.itemSelected,
                  ]}
                >
                  {item}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0056b3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    zIndex: 10,
  },
  dropdownContainerStyle: {
    width: "100%",
    paddingHorizontal: 0,
  },
  dropdownText: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dropdownItemText: {
    paddingVertical: 8,
  },
  dropdownListContainerStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownSelectedContainerStyle: {
    backgroundColor: "#007AFF",
    marginVertical: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 30,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  itemSelected: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});