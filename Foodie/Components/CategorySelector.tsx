import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CategorySelector({ selectedIndex, onSelect }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onSelect(0)} style={selectedIndex === 0 ? styles.selected : styles.unselected}>
        <Text style={selectedIndex === 0 ? styles.text_selected : styles.text_unselected}>Food</Text>
      </Pressable>
      <Pressable onPress={() => onSelect(1)} style={selectedIndex === 1 ? styles.selected : styles.unselected}>
        <Text style={selectedIndex === 1 ? styles.text_selected : styles.text_unselected}>Drinks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 30,
  },
  selected: {
    backgroundColor: "#E1AEC1",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  unselected: {
    backgroundColor: "#F1F5F5",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  text_selected: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 10,
    textAlign: "center",
  },
  text_unselected: {
    fontSize: 16,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
});
