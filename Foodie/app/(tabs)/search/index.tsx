import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  GestureResponderEvent,
  ScrollView,
} from "react-native";

export default function Tab() {
  // variables
  const img = "../../../assets/img_search.png";

  // functions
  function onChangeSearchText(text: string): void {
    throw new Error("Function not implemented.");
  }

  function onPressSearchByImage(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  // states
  const [isSelected, setIsSelected] = useState<number | undefined>(undefined);

  function changeTag(tag: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.title}>Search</Text>
        </View>
        <TextInput
          style={styles.search_input}
          onChangeText={onChangeSearchText}
          placeholder="What would you like to eat today?"
          placeholderTextColor="rgba(128,128,128, 0.9)"
        />
        <View style={styles.container_header}>
          <Text style={styles.title2}>Search By Image</Text>
        </View>
        <View style={styles.img_search_wrapper}>
          <Pressable
            style={styles.img_search_icon_bkg}
            onPress={onPressSearchByImage}
          >
            <Image
              source={require(img)}
              style={styles.img_search_icon}
              resizeMode="cover"
            />
          </Pressable>
        </View>
        <View style={styles.container_header}>
          <Text style={styles.title2}>Search By Type</Text>
        </View>
        <View style={styles.img_search_wrapper}>
          <View style={styles.container_tag}>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("American")}>
                <Text style={styles.tag_text}>American🇺🇸</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Asain")}>
                <Text style={styles.tag_text}>Asain🏮</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Latin American")}>
                <Text style={styles.tag_text}>Latin American🌮</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("Gluten Free")}>
                <Text style={styles.tag_text}>Gluten Free🌾</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Vegetarian")}>
                <Text style={styles.tag_text}>Vegetarian🌱</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Vegan")}>
                <Text style={styles.tag_text}>Vegan🌿</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("appetizer")}>
                <Text style={styles.tag_text}>Appetizer🫒</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("main course")}>
                <Text style={styles.tag_text}>Main Course🍽️</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("salad")}>
                <Text style={styles.tag_text}>Salad🥗</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("dessert")}>
                <Text style={styles.tag_text}>Dessert🍮</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("drink")}>
                <Text style={styles.tag_text}>Drink🍷</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
    gap: 10,
  },
  container_header: {
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
  },
  container_tag: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    height: "90%",
    gap: 10
  },
  container_tag_row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  search_input: {
    height: 60,
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  img_search_wrapper: {
    height: "30%",
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  img_search_icon_bkg: {
    height: "85%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  img_search_icon: {
    height: 96,
    width: 96,
  },
  tag: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40
  },
  tag_text: {
    fontSize: 13,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
});
