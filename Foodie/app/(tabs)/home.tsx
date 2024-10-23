import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Text style={styles.title}>Today's Pick</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
