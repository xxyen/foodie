import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function DirectionList({ steps, readyInMinutes }) {
  return (
    <View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Directions</Text>
        <Text style={styles.subtitle}>{`${readyInMinutes || "N/A"} mins`}</Text>
      </View>
      <View style={styles.container}>
        {steps?.map((step, index) => (
          <Text key={index} style={styles.text}>
            {`${step?.number || index + 1}. ${step?.step || "No description available"}`}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerTitle: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  container: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
