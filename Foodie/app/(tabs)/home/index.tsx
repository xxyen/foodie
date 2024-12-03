import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { getProfile, getRandomFoodRecipe, updateFavoriteFoods } from "../../../utils";
import { useAppContext } from "@/context/contexts";
import { useRouter } from "expo-router";
import CategorySelector from "../../../Components/CategorySelector"; // Abstracted Category Selector
import FoodItem from "../../../Components/FoodItem"; // Abstracted Food Item

export default function Home() {
  const {
    id,
    favFoods,
    allergies,
    onChangeFavFoods,
    onChangeId,
    onChangeAllergies,
    onChangeBuffer,
    onChangeFavDrinks,
    onChangeIngredients,
    onChangeWeeklyCalories,
  } = useAppContext();

  // States
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("breakfast");
  const [data, setData] = useState<IApiFoodRecipeData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  // Navigation
  const router = useRouter();

  // Fetch data based on category
  useEffect(() => {
    const fetchData = async () => {
      if (allergies !== undefined) {
        setLoading(true);
        try {
            const recipes = await getRandomFoodRecipe(tag, allergies);
            setData(recipes);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [allergies, tag]);

  // Fetch user profile on mount
  useEffect(() => {
    const userDataInitialization = async () => {
      if (id) {
        const user = await getProfile(id);
        fetchUserInfo(user);
      }
    };
    userDataInitialization();
  }, [id]);

  const fetchUserInfo = (user: IUserInfo) => {
    onChangeAllergies(user.allergies);
    onChangeBuffer(user.icon);
    onChangeFavDrinks(user.favDrinks);
    onChangeFavFoods(user.favFoods);
    onChangeIngredients(user.ingredients);
    onChangeWeeklyCalories(user.weeklyCalories);
  };

  const handleToggleFavorite = (recipeId: number) => {
    if (!id) {
      Alert.alert("Error", "Please log in to manage favorites.");
      router.push("profile");
      return;
    }

    let updatedFavFoods;
    let alertMessage;

    if (favFoods.includes(recipeId)) {
      // Remove from favorites
      updatedFavFoods = favFoods.filter((id) => id !== recipeId);
      alertMessage = "Recipe removed from favorites.";
    } else {
      // Add to favorites
      updatedFavFoods = [...favFoods, recipeId];
      alertMessage = "Recipe added to favorites!";
    }

    updateFavoriteFoods(id, updatedFavFoods)
      .then(() => {
        onChangeFavFoods(updatedFavFoods);
        Alert.alert("Success", alertMessage); 
      })
      .catch(() => Alert.alert("Error", "Failed to update favorites."));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E1AEC1" />
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>
      <View style={styles.container}>
        {/* Category Selector */}
        <CategorySelector
          categories={["breakfast", "lunch", "dinner", "snack"]}
          selectedIndex={isSelected}
          onSelect={(index, category) => {
            setIsSelected(index);
            setTag(category);
          }}
        />

        {/* Recipe List */}
        <ScrollView style={styles.container_recipes}>
          {data?.recipes.map((recipe) => (
            <FoodItem
              key={recipe.id}
              food={recipe}
              favFoods={favFoods}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              onPressDetail={() =>
                router.push({
                  pathname: "home/detail",
                  params: { data: JSON.stringify(recipe) },
                })
              }
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
   loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});
