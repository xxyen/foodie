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
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getRecipeDetails } from "@/utils";

export default function Tab() {

  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<IApiFoodRecipeData["recipes"] | undefined>(undefined);
  const [nutrition, setNutrition] = useState<any | undefined>(undefined);


  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (id) {
        const recipeData = await getRecipeDetails(Number(id));

        if (recipeData) {
          setRecipe(recipeData);
  
          const nutritionData = recipeData?.nutrition?.nutrients;
          setNutrition(nutritionData);
        }
      }
    };
    fetchRecipeDetails();
  }, [id]);
  

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safearea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }


  function onPressAddToShoplist(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
  }

  function onPressAddToDailyIntake(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
  }

  // const nutrition = recipe.recipes[0].nutrition?.nutrients;
  const getNutritionValue = (name: string) =>
    nutrition?.find((nutrient) => nutrient.name === name)?.amount || 0;

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_img}>
          <Text style={styles.title_h1}>Recipe Detail</Text>
          <ImageBackground
            source={{ uri: recipe?.image }}
            style={styles.img_wrapper}
            resizeMode="cover"
          />
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Ingredients</Text>
          <Text style={styles.subtitle}>{`${recipe?.extendedIngredients.length} Items`}</Text>
        </View>
        <View style={styles.container_ingredient}>
        {recipe?.extendedIngredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.container_ingredient_item}>
              <Text style={styles.title_h3}>{ingredient.name}</Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.btn} onPress={onPressAddToShoplist}>
          <Text style={styles.btn_text}>Add To Shoplist</Text>
        </Pressable>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Directions</Text>
          <Text
            style={styles.subtitle}
          >{` ${recipe?.readyInMinutes} mins`}</Text>
        </View>
        <View style={styles.container_ingredient}>
          <Text style={styles.text_paragraph}>
          {recipe?.summary.replace(/<[^>]*>?/gm, "")}
          </Text>
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Nutrition Facts</Text>
          <Text style={styles.subtitle}>{`${getNutritionValue("Calories")} calories`}</Text>
        </View>
        <View style={styles.container_nutrition}>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"water"} size={30} />
              <Text style={styles.title_h4}>Fat</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue("Fat")}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"hamburger-minus"} size={30} />
              <Text style={styles.title_h4}>Cholesterol</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue("Cholesterol")}mg`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"shaker"} size={30} />
              <Text style={styles.title_h4}>Sodium</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue("Sodium")}mg`}</Text>
            </View>
          </View>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"cube-outline"} size={30} />
              <Text style={styles.title_h4}>Carbs</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue("Carbohydrates")}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"pizza"} size={30} />
              <Text style={styles.title_h4}>Protein</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue("Protein")}g`}</Text>
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
