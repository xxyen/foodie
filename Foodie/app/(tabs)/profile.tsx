import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useAppContext } from "@/context/contexts";
import { Redirect,useRouter } from "expo-router";
import { useEffect } from "react";

export default function Tab() {
  const { username, id } = useAppContext();
  const router = useRouter();


  useEffect(() => {
    if (!username) {
      router.push('/welcome'); 
    }
  }, []); 

  if (!username) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Text>This is profile page</Text>
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
