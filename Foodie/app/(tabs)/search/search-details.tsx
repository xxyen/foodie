import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  getFoodRecipeByIngredients,
  getRecipeById,
  getRandomFoodRecipe,
  updateFavoriteFoods,
  getFoodRecipeAutoComplete,
} from "../../../utils";
import { useAppContext } from "@/context/contexts";
import { useLocalSearchParams, useRouter } from "expo-router";
import FoodItem from "../../../Components/FoodItem";

export default function Home() {
  const { id, favFoods, onChangeFavFoods } = useAppContext();
  const { pressedTag, type } = useLocalSearchParams();

  const [tag, setTag] = useState<string>("");
  const [data, setData] = useState<IApiFoodRecipeData | undefined | any>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (pressedTag) {
      const tag = pressedTag as string;
      setTag(tag.toLowerCase());
    }
  }, [pressedTag]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading spinner
      try {
        if (type === "byTag") {
          const recipes = await getRandomFoodRecipe(tag);
          if (recipes) {
            setData(recipes.recipes);
          }
        }
        if (type === "byIngredient") {
          const recipes = await getFoodRecipeByIngredients(tag);
          if (recipes) {
            setData(recipes.results);
          }
        }

        if (type === "text") {
          const recipes = await getFoodRecipeAutoComplete(pressedTag);
          if (recipes && recipes.length > 0) {
            const topFiveRecipes = recipes.slice(0, 5);
            const recipeDetails = await Promise.all(
              topFiveRecipes.map(async (recipe) => {
                const recipeDetail = await getRecipeById(recipe.id);
                return recipeDetail;
              })
            );

            setData(recipeDetails);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };
    fetchData();
  }, [tag]);

  const handleToggleFavorite = (foodId: number) => {
    if (!id) {
      router.push("profile");
      return;
    }

    const newFavFoods = favFoods.includes(foodId)
      ? favFoods.filter((id) => id !== foodId)
      : [...favFoods, foodId];

    updateFavoriteFoods(id, newFavFoods)
      .then(() => {
        onChangeFavFoods(newFavFoods);
        Alert.alert(
          "Success",
          favFoods.includes(foodId)
            ? "Recipe removed from favorites."
            : "Recipe added to favorites!"
        );
      })
      .catch((error) => console.error("Error updating favorites:", error));
  };

  const handlePressDetail = (recipe: IFoodRecipe) => {
    router.push({
      pathname: "home/detail",
      params: { data: JSON.stringify(recipe) },
    });
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Search Results</Text>
      <View style={styles.container}>
        <ScrollView style={styles.container_recipes}>
          {data?.map((recipe) => (
            <FoodItem
              key={recipe.id}
              food={recipe}
              favFoods={favFoods}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              onPressDetail={() => handlePressDetail(recipe)}
            />
          ))}
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
  container_recipes: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: Platform.OS === "android" ? 50 : 20,
    marginBottom: 10,
  },
});
