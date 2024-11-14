import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Pressable,
  GestureResponderEvent,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  getFoodIngredientImage,
  updateFavoriteFoods,
  updateIngredients,
  updateCalories
} from "@/utils";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";

export default function Tab() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { id, favFoods, onChangeFavFoods, ingredients, onChangeIngredients, weeklyCalories, onChangeWeeklyCalories } =
    useAppContext();

  const [recipe, setRecipe] = useState<IFoodRecipe | undefined>(undefined);
  const [nutrition, setNutrition] = useState<INutrition | undefined>(undefined);
  const [steps, setSteps] = useState<IFoodStep[] | undefined>(undefined);

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

  function onPressAddFav(event: GestureResponderEvent): void {
    if (!id) {
      console.log("User not logged in. Redirecting to Profile.");
      router.push("profile");
      return;
    }

    let newFavFoods: number[] = [];
    let alertMessage: string;

    if (recipe && favFoods.includes(recipe.id)) {
      // Remove favorite
      newFavFoods = favFoods.filter((foodId) => foodId !== recipe.id);
      alertMessage = "Recipe removed from favorites.";
    } else if (recipe) {
      // Add to favorites
      newFavFoods = [...favFoods, recipe.id];
      alertMessage = "Recipe added to favorites!";
    }

    updateFavoriteFoods(id, newFavFoods).then(() => {
      onChangeFavFoods(newFavFoods);
      Alert.alert("Success", alertMessage);
    });
  }

  function onPressAddToShoplist(event: GestureResponderEvent): void {
    if (recipe) {
      const newIngredients = recipe.extendedIngredients.map(
        (ingredient) => ingredient.name
      );
      const existingIngredients = newIngredients.filter((ingredient) =>
        ingredients.includes(ingredient)
      );
      const ingredientsToAdd = newIngredients.filter(
        (ingredient) => !ingredients.includes(ingredient)
      );

      if (ingredientsToAdd.length > 0) {
        const allIngredients = [...ingredients, ...ingredientsToAdd];

        updateIngredients(id, allIngredients).then(() => {
          onChangeIngredients(allIngredients);
          const successMessage =
            existingIngredients.length > 0
              ? `Added new ingredients to the shopping list. Already had: ${existingIngredients.join(
                  ", "
                )}.`
              : "Ingredients added to shopping list!";
          Alert.alert("Success", successMessage);
        });
      } else {
        Alert.alert("Info", `All ingredients already in the shopping list.`);
      }
    }
  }

  function onPressAddToDailyIntake(event: GestureResponderEvent): void {
    if (!id || !recipe) {
      Alert.alert("Error", "Unable to add to daily intake. Please log in.");
      return;
    }
  
    const calories = Number(getNutritionValue("Calories").toFixed(0));
    const today = new Date().getDay();
    
    const isNewWeek = today === 0 && (weeklyCalories.length !== 7 || weeklyCalories.some((cal) => cal !== 0));
    const updatedCalories = isNewWeek ? Array(7).fill(0) : [...weeklyCalories];
    
    updatedCalories[today] = (updatedCalories[today] || 0) + calories;
  
    updateCalories(id, updatedCalories).then(() => {
      onChangeWeeklyCalories(updatedCalories);
      Alert.alert("Success", "Added to today's diet analysis.");
    });
  }  
  

  // const nutrition = recipe.recipes[0].nutrition?.nutrients;
  const getNutritionValue = (name: string) =>
    nutrition?.nutrients?.find((nutrient: Nutrient) => nutrient.name === name)
      ?.amount || 0;

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_img}>
          {/* <Text style={styles.title_h1}>Recipe Detail</Text> */}
          <ImageBackground
            source={{ uri: recipe?.image }}
            style={styles.img_wrapper}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                "rgba(0, 0, 0, 0.4)",
                "rgba(0, 0, 0, 0)",
                "rgba(0, 0, 0, 0)",
                "rgba(0, 0, 0, 0.4)",
              ]}
              style={styles.gradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View style={styles.container_text_and_btn}>
              <Text style={styles.text}>{recipe.title}</Text>
              <Pressable onPress={(event) => onPressAddFav(event)}>
                <View style={styles.circle}>
                  <MaterialCommunityIcons
                    name={favFoods.includes(recipe.id) ? "heart" : "heart-plus"}
                    size={20}
                    style={
                      favFoods.includes(recipe.id)
                        ? styles.fav_icon_selected
                        : styles.fav_icon_unselected
                    }
                  />
                </View>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Ingredients</Text>
          <Text
            style={styles.subtitle}
          >{`${recipe?.extendedIngredients.length} Items`}</Text>
        </View>
        <View style={styles.container_ingredient}>
          {recipe?.extendedIngredients.map((ingredient, index) => (
            <View
              key={`${ingredient.id}-${index}`}
              style={styles.container_ingredient_item}
            >
              <Text style={styles.text_paragraph}>{ingredient.name}</Text>
              <Image
                style={styles.ingredient_image}
                resizeMode="contain"
                source={{ uri: getFoodIngredientImage(ingredient.image) }}
              />
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
          <Text style={styles.subtitle}>{`${getNutritionValue(
            "Calories"
          ).toFixed(0)} calories`}</Text>
        </View>
        <View style={styles.container_nutrition}>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"water"} size={30} />
              <Text style={styles.title_h4}>Fat</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue(
                "Fat"
              ).toFixed(0)}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"hamburger-minus"} size={30} />
              <Text style={styles.title_h4}>Cholesterol</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue(
                "Cholesterol"
              ).toFixed(0)}mg`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"shaker"} size={30} />
              <Text style={styles.title_h4}>Sodium</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue(
                "Sodium"
              ).toFixed(0)}mg`}</Text>
            </View>
          </View>
          <View style={styles.container_nutrition_row}>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"cube-outline"} size={30} />
              <Text style={styles.title_h4}>Carbs</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue(
                "Carbohydrates"
              ).toFixed(0)}g`}</Text>
            </View>
            <View style={styles.container_nutrition_item}>
              <MaterialCommunityIcons name={"pizza"} size={30} />
              <Text style={styles.title_h4}>Protein</Text>
              <Text style={styles.subtitle}>{`${getNutritionValue(
                "Protein"
              ).toFixed(0)}g`}</Text>
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
    marginTop: 20,
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
    paddingVertical: 10,
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
    flexDirection: "row",
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
    fontSize: 14,
    color: "#999999",
  },
  text_paragraph: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  img_wrapper: {
    width: "100%",
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center"
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
  },
  favorite_icon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  fav_icon_selected: {
    color: "red",
  },
  fav_icon_unselected: {
    color: "grey",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  circle: {
    height: 25,
    width: 25,
    backgroundColor: "white",
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  container_text_and_btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    paddingBottom: 10
  },
  text: {
    flex: 8,
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 3,
  },
});
