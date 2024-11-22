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
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  updateFavoriteFoods,
  updateIngredients,
  updateCalories,
  getProfile
} from "@/utils";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";
import { RecipeHeader } from "../../../Components/RecipeHeader";
import { IngredientList } from "../../../Components/IngredientList";
import { DirectionList } from "../../../Components/DirectionList";


export default function Tab() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { id, favFoods, onChangeFavFoods, ingredients, onChangeIngredients, weeklyCalories, onChangeWeeklyCalories } =
    useAppContext();

  const [recipe, setRecipe] = useState<IFoodRecipe | undefined>(undefined);
  const [nutrition, setNutrition] = useState<INutrition | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (data) {
      const parsedData: IFoodRecipe = JSON.parse(data as string);
      setRecipe(parsedData);
      setNutrition(parsedData.nutrition);
      setLoading(false);
    }
  }, [JSON.stringify(data)]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (id) {
  //       const userData = await getProfile(id);
  //       if (userData) {
  //         onChangeWeeklyCalories(userData.weeklyCalories);
  //       }
  //     }
  //   };
  //   fetchData();
  // });

  if (loading) {
    return (
      <SafeAreaView style={styles.safearea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#E1AEC1" />
          <Text style={styles.loadingText}>Loading Recipe...</Text>
        </View>
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
        <RecipeHeader
            title={recipe?.title}
            image={recipe?.image}
            isFavorite={favFoods.includes(recipe?.id)}
            onToggleFavorite={(event) => onPressAddFav(event)}
            recipeType="food"
        />
        <IngredientList ingredients={recipe?.extendedIngredients || []} recipeType="food"/>

        <Pressable style={styles.btn} onPress={onPressAddToShoplist}>
          <Text style={styles.btn_text}>Add To Shoplist</Text>
        </Pressable>
        <DirectionList
           steps={recipe?.analyzedInstructions[0]?.steps || []}
           readyInMinutes={recipe?.readyInMinutes}
        />
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
  container_title: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
    marginTop: 20,
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

  title_h2: {
    fontSize: 20,
    fontWeight: "bold",
  },

  title_h4: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#999999",
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

  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
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
      loader: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
});
