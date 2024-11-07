import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Pressable,
  GestureResponderEvent,
  ScrollView,
  Image
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getIngredientImage } from "@/utils";

export default function Tab() {

  const { data } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<IFoodRecipe | undefined>(undefined);
  const [nutrition, setNutrition] = useState< INutrition| undefined>(undefined);
  const [steps, setSteps] = useState<IFoodStep[]| undefined>(undefined);


  useEffect(() => {
    if (data) {
      const parsedData: IFoodRecipe = JSON.parse(data as string);
      setRecipe(parsedData);
      setNutrition(parsedData.nutrition);
      setSteps(parsedData.analyzedInstructions[0]?.steps);
    }
  }, [data]);
  

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
    nutrition?.nutrients?.find((nutrient: Nutrient) => nutrient.name === name)?.amount || 0;

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
              <Text style={styles.text_paragraph}>{ingredient.name}</Text>
              <Image style={styles.ingredient_image} resizeMode="contain" source={{ uri: getIngredientImage(ingredient.image)}} />
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
        <View style={styles.container_direction}>
          {steps?.map((step: IFoodStep) => (
            <Text key={step.number} style={styles.text_paragraph}>
              {`${step.number}. ${step.step}`}
            </Text>
          ))}
          
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
  },
  container_direction: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    paddingVertical: 10
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
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    flexDirection: "row"
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
    paddingHorizontal: 20,
    paddingVertical: 10
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
  ingredient_image: {
    width: 50,
    height: 50,
  }
});
