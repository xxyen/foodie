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
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  getDrinkIngredientImage,
  getRecipeDetails,
  updateFavoriteDrinks,
  updateIngredients,
} from "@/utils";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";

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
      }
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safearea}>
        <Text>Loading...</Text>
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
        <View style={styles.container_img}>
          {/* <Text style={styles.title_h1}>Recipe Detail</Text> */}
          <ImageBackground
            source={{ uri: recipe?.strDrinkThumb }}
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
              <Text style={styles.text}>{recipe.strDrink}</Text>
              <Pressable onPress={onPressAddFav}>
                <View style={styles.circle}>
                  <MaterialCommunityIcons
                    name={
                      favDrinks.includes(Number(recipe.idDrink))
                        ? "heart"
                        : "heart-plus"
                    }
                    size={20}
                    style={
                      favDrinks.includes(Number(recipe.idDrink))
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
          <Text style={styles.subtitle}>{`${
            drinkIngredients?.length || 0
          } Items`}</Text>
        </View>
        <View style={styles.container_ingredient}>
          {drinkIngredients &&
            drinkIngredients.map((ingredient, i) => (
              <View key={i} style={styles.container_ingredient_item}>
                <Text style={styles.text_paragraph}>{ingredient}</Text>
                <Image
                style={styles.ingredient_image}
                resizeMode="contain"
                source={{ uri: getDrinkIngredientImage(ingredient) }}
              />
              </View>
            ))}
        </View>
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
  container_img: {
    width: "90%",
    height: 400,
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
    fontSize: 16,
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
    alignItems: "center",
    justifyContent: "flex-end"
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
  container_text_and_btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    padding: 10
  },
});
