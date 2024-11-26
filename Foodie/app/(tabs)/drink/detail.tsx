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
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  getRecipeDetails,
  updateFavoriteDrinks,
  updateIngredients,
} from "@/utils";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";
import { RecipeHeader } from "../../../Components/RecipeHeader";
import { IngredientList } from "../../../Components/IngredientList";



export default function Tab() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    id: userId,
    favDrinks,
    onChangeFavDrinks,
    ingredients,
    onChangeIngredients,
  } = useAppContext();
  const [recipe, setRecipe] = useState<ICocktailRecipe | undefined>(undefined);
  const [drinkIngredients, setDrinkIngredients] = useState<
    string[] | undefined
  >(undefined);
  const [steps, setSteps] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchRecipeDetails = async () => {
        if (id) {
          const recipeData = await getRecipeDetails(id.toString());
          if (recipeData) {
            setRecipe(recipeData.drinks[0]);
          }
        }
      };
      fetchRecipeDetails();
      // console.log(recipe);
    }
  }, [id]);

  useEffect(() => {
    if (recipe) {
      const ingredientsList: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof ICocktailRecipe];
        if (ingredient) {
          ingredientsList.push(`${ingredient}`);
        }
      }
      setDrinkIngredients(ingredientsList);

      if (recipe.strInstructions) {
        const parsedStep = recipe.strInstructions.split(".").slice(0, -1);
        setSteps(parsedStep);
        setLoading(false);
      }
    }
  }, [recipe]);

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
    if (!userId) {
      console.log("User not logged in. Redirecting to Profile.");
      router.push("profile");
      return;
    }

    let newFavDrinks: number[] = [];
    let alertMessage: string;

    if (recipe) {
      if (favDrinks.includes(Number(recipe.idDrink))) {
        newFavDrinks = favDrinks.filter(
          (drinkId) => drinkId !== Number(recipe.idDrink)
        );
        alertMessage = "Drink removed from favorites.";
      } else {
        newFavDrinks = [...favDrinks, Number(recipe.idDrink)];
        alertMessage = "Drink added to favorites!";
      }
    }

    updateFavoriteDrinks(userId, newFavDrinks).then(() => {
      onChangeFavDrinks(newFavDrinks);
      Alert.alert("Success", alertMessage);
    });
  }

  function onPressAddToShoplist(event: GestureResponderEvent): void {
     if (!userId) {
         console.log("User not logged in. Redirecting to Profile.");
         router.push("profile");
         return;
     }
    if (drinkIngredients) {
      const existingIngredients = drinkIngredients.filter((ingredient) =>
        ingredients.includes(ingredient)
      );
      const ingredientsToAdd = drinkIngredients.filter(
        (ingredient) => !ingredients.includes(ingredient)
      );

      if (ingredientsToAdd.length > 0) {
        const allIngredients = [...ingredients, ...ingredientsToAdd];
        updateIngredients(userId, allIngredients).then(() => {
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
        Alert.alert(
          "Info",
          "All ingredients are already in the shopping list."
        );
      }
    }
  }

  function onPressAddToDailyIntake(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <RecipeHeader
             title={recipe?.strDrink}
             image={recipe?.strDrinkThumb}
             isFavorite={favDrinks.includes(Number(recipe?.idDrink))}
             onToggleFavorite={(event) => onPressAddFav(event)}
             recipeType="drink"
        />
        <IngredientList ingredients={drinkIngredients || []} recipeType="drink" />

        <Pressable style={styles.btn} onPress={onPressAddToShoplist}>
          <Text style={styles.btn_text}>Add To Shoplist</Text>
        </Pressable>
        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Directions</Text>
        </View>
        <View style={styles.container_direction}>
          {steps?.map((step, index) => (
            <Text key={index} style={styles.text_paragraph}>
              {`${index + 1}. ${step}`}
            </Text>
          ))}
        </View>
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

  container_direction: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
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
  subtitle: {
    fontSize: 16,
    color: "#999999",
  },
  text_paragraph: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
