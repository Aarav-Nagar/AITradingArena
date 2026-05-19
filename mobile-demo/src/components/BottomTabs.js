import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../theme/theme";

export const tabs = [
  ["Check", "search-outline"],
  ["Report", "document-text-outline"],
  ["Journal", "book-outline"],
  ["Growth", "trending-up-outline"],
  ["Arena", "trophy-outline"],
  ["Learn", "school-outline"],
  ["Profile", "person-outline"]
];

export function BottomTabs({ activeTab, setActiveTab, disabledTabs = [] }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(([name, icon]) => (
        <Pressable
          key={name}
          style={[styles.tabItem, disabledTabs.includes(name) && styles.disabled]}
          onPress={() => !disabledTabs.includes(name) && setActiveTab(name)}
        >
          <Ionicons
            name={icon}
            size={19}
            color={activeTab === name ? palette.green : palette.muted}
          />
          <Text style={[styles.tabLabel, activeTab === name && styles.active]}>{name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 74,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: palette.border
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  tabLabel: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 4
  },
  active: {
    color: palette.green
  },
  disabled: {
    opacity: 0.35
  }
});
