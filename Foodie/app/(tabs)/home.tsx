import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  GestureResponderEvent,
} from "react-native";

export default function Home() {
  // states
  const [isSelected, setIsSelected] = useState<Number>(0);
  const [tag, setTag] = useState<String>("breakfast");

  // functions
  function changeTag(num: Number, tag: String): void {
    setIsSelected(num);
    setTag(tag);
  }

  


  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>
      <View style={styles.container}>
        <ScrollView horizontal={true} style={{width: "90%"}}>
          <View style={styles.container_topbar}>
            <Pressable style={isSelected === 0? styles.tag_selected : styles.tag_unselected} onPress={()=>changeTag(0, "breakfast")}>
              <Text style={isSelected === 0? styles.tagtext_selected: styles.tagtext_unselected}>Breakfast</Text>
            </Pressable>
            <Pressable style={isSelected === 1? styles.tag_selected : styles.tag_unselected} onPress={()=>changeTag(1, "lunch")}>
              <Text style={isSelected === 1? styles.tagtext_selected: styles.tagtext_unselected}>Lunch</Text>
            </Pressable>
            <Pressable style={isSelected === 2? styles.tag_selected : styles.tag_unselected} onPress={()=>changeTag(2, "dinner")}>
              <Text style={isSelected === 2? styles.tagtext_selected: styles.tagtext_unselected}>Dinner</Text>
            </Pressable>
            <Pressable style={isSelected === 3? styles.tag_selected : styles.tag_unselected} onPress={()=>changeTag(3, "snack")}>
              <Text style={isSelected === 3? styles.tagtext_selected: styles.tagtext_unselected}>Snacks</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  container_topbar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: Platform.OS == "android" ? 50 : 20,
    marginBottom: 10
  },
  tag_selected: {
    backgroundColor: "#E1AEC1",
    opacity: 0.8,
    borderRadius: 20,
    width: 100
  },
  tagtext_selected: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 10,
    textAlign: "center"
  },
  tag_unselected: {
    backgroundColor: "#F1F5F5",
    opacity: 0.8,
    borderRadius: 20,
    width: 100
  },
  tagtext_unselected: {
    fontSize: 16,
    color: "#0A2533",
    padding: 10,
    textAlign: "center"
  },
});
