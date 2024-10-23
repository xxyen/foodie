import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function Tab() {
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Text>This is favorites page</Text>
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
});
