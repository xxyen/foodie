import React from "react";
import { View, Pressable, Text, StyleSheet, ScrollView } from "react-native";

export default function CategorySelector({ selectedIndex, onSelect, categories }) {
  return (
  <ScrollView
      horizontal={true}
      style={{ width: "90%" }}
      showsHorizontalScrollIndicator={false}>
    <View style={styles.container}>

      {categories.map((category, index) => (
        <Pressable
          key={category}
          style={selectedIndex === index ? styles.selected : styles.unselected}
          onPress={() => onSelect(index, category)}
        >
          <Text
            style={
              selectedIndex === index
                ? styles.textSelected
                : styles.textUnselected
            }
          >
            {category}
          </Text>
        </Pressable>
      ))}

    </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "flex-start",
    gap: 10,
  },
  selected: {
    backgroundColor: "#E1AEC1",
    borderRadius: 20,
    opacity: 0.8,
    paddingVertical: 10,
    width: 100,
  },
  unselected: {
    backgroundColor: "#F1F5F5",
    borderRadius: 20,
     opacity: 0.8,
    paddingVertical: 10,
    width: 100,
  },
  textSelected: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textUnselected: {
    fontSize: 16,
    color: "#0A2533",
    textAlign: "center",
  },
});
