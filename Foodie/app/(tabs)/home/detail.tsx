import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Pressable,
  GestureResponderEvent,
  ScrollView,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Tab() {
  const ingredient_num = 1;
  const window_width = Dimensions.get("window").width;
  const window_height = Dimensions.get("window").height;
  const recipe_difficulty = "Easy";
  const cook_time = 10;
  const intake = 150;
  const fat = 6;
  const cholesterol = 0;
  const sodium = 3;
  const carbs = 2;
  const protein = 1;

  function onPressAddToShoplist(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  function onPressAddToDailyIntake(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_img}>
          <Text style={styles.title_h1}>Recipe Detail</Text>
          <ImageBackground
            source={require("../../../assets/sample_recipe_img.png")}
            style={styles.img_wrapper}
            resizeMode="cover"
          />
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Ingredients</Text>
          <Text style={styles.subtitle}>{`${ingredient_num} Item`}</Text>
        </View>
        <View style={styles.container_ingredient}>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Apple</Text>
          </View>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Pear</Text>
          </View>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Apple</Text>
          </View>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Pear</Text>
          </View>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Apple</Text>
          </View>
          <View style={styles.container_ingredient_item}>
            <Text style={styles.title_h3}>Pear</Text>
          </View>
        </View>
        <Pressable style={styles.btn} onPress={onPressAddToShoplist}>
          <Text style={styles.btn_text}>Add To Shoplist</Text>
        </Pressable>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Directions</Text>
          <Text
            style={styles.subtitle}
          >{`${recipe_difficulty} ${cook_time}mins`}</Text>
        </View>
        <View style={styles.container_ingredient}>
          <Text style={styles.text_paragraph}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. The standard chunk of
            Lorem Ipsum used since the 1500s is reproduced below for those
            interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
            Malorum" by Cicero are also reproduced in their exact original form,
            accompanied by English versions from the 1914 translation by H.
            Rackham.
          </Text>
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Nutrition Facts</Text>
          <Text style={styles.subtitle}>{`${intake} calories`}</Text>
        </View>
        <View style={styles.container_nutrition}>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"water"} size={30} />
              <Text style={styles.title_h4}>Fat</Text>
              <Text style={styles.subtitle}>{`${fat}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"hamburger-minus"} size={30} />
              <Text style={styles.title_h4}>Cholesterol</Text>
              <Text style={styles.subtitle}>{`${cholesterol}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"shaker"} size={30} />
              <Text style={styles.title_h4}>Sodium</Text>
              <Text style={styles.subtitle}>{`${sodium}g`}</Text>
            </View>
          </View>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"cube-outline"} size={30} />
              <Text style={styles.title_h4}>Carbs</Text>
              <Text style={styles.subtitle}>{`${carbs}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"pizza"} size={30} />
              <Text style={styles.title_h4}>Protein</Text>
              <Text style={styles.subtitle}>{`${protein}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item_hide}></View>
          </View>
        </View>

        <Pressable style={styles.btn} onPress={onPressAddToDailyIntake}>
          <Text style={styles.btn_text}>Add To Today's Diet Analysis</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
  },
  container_img: {
    width: "90%",
    height: 260,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
  },
  container_title: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
    marginTop: 20,
  },
  container_ingredient: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
  },
  container_nutrition: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    gap: 15,
    padding: 15,
  },
  container_nutrition_row: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
  },
  container_nutrition_item: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  container_nutrition_item_hide: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  container_ingredient_item: {
    width: "90%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 10,
  },
  title_h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title_h2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title_h3: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    paddingLeft: 20,
  },
  title_h4: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#999999",
  },
  text_paragraph: {
    fontSize: 16,
    padding: 20,
  },
  img_wrapper: {
    width: "100%",
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  btn: {
    height: 55,
    width: "90%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  btn_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
