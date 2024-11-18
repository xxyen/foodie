import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "@/context/contexts";
import { useRouter } from "expo-router";
import { updateFavoriteFoods, updateFavoriteDrinks, getRecipeById, searchCocktailById } from "../../utils";
import CategorySelector from "../../Components/CategorySelector";
import FoodItem from "../../Components/FoodItem";
import DrinkItem from "../../Components/DrinkItem";

export default function Tab() {
  const [favFoodObjects, setFavFoodObjects] = useState([]);
  const [favDrinkObjects, setFavDrinkObjects] = useState([]);
  const [isSelected, setIsSelected] = useState(0); // Food = 0, Drinks = 1
  const [isLoading, setIsLoading] = useState(false);
  const { id, favDrinks, favFoods, onChangeFavDrinks, onChangeFavFoods } = useAppContext();
  const router = useRouter();

  // Fetch favorite foods and drinks on mount
  useEffect(() => {
    const fetchData = async () => {
    setIsLoading(true);
      try {
        await fetchRecipes();
        await fetchDrinks();
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
       setIsLoading(false);
      }
    };
    fetchData();
  }, [favFoods, favDrinks]);

  const fetchRecipes = useCallback(async () => {
    try {
      const promises = favFoods.map((id) => getRecipeById(id));
      const recipes = await Promise.all(promises);
      setFavFoodObjects(recipes);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  }, [favFoods]);

  const fetchDrinks = useCallback(async () => {
    try {
      const promises = favDrinks.map((id) => searchCocktailById(id));
      const drinks = await Promise.all(promises);
      setFavDrinkObjects(drinks);
    } catch (error) {
      console.error("Failed to fetch drinks:", error);
    }
  }, [favDrinks]);

    if (isLoading) {
      return (
        <SafeAreaView style={styles.safearea}>
         <Text style={styles.title}>My Favorites</Text>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#E1AEC1" />
          </View>
        </SafeAreaView>
      );
    }

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>My Favorites</Text>

      {/* Category Selector */}
      <View style={{justifyContent: "center", alignItems: "center",marginVertical: 10,marginLeft: "20%"}}>
      <CategorySelector selectedIndex={isSelected} onSelect={setIsSelected} categories={["food", "drink"]}/>
      </View>

      <ScrollView style={styles.container}>
        {isSelected === 0 ? (
          favFoodObjects.length > 0 ? (
            favFoodObjects.map((food) => (
              <FoodItem
                key={food.id}
                food={food}
                favFoods={favFoods}
                onToggleFavorite={() => {
                  const updatedFavFoods = favFoods.includes(food.id)
                    ? favFoods.filter((id) => id !== food.id)
                    : [...favFoods, food.id];
                  updateFavoriteFoods(id, updatedFavFoods)
                    .then(() => onChangeFavFoods(updatedFavFoods))
                    .catch(() => Alert.alert("Error", "Failed to update favorite foods."));
                }}
                onPressDetail={() =>
                  router.push({ pathname: "home/detail", params: { data: JSON.stringify(food) } })
                }
              />
            ))
          ) : (
            <Text style={styles.emptyMessage}>No favorite food items added.</Text>
          )
        ) : favDrinkObjects.length > 0 ? (
          <View>
            {Array.from({ length: Math.ceil(favDrinkObjects.length / 2) }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.container_drinkrow}>
                {favDrinkObjects
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((drinkObj) =>
                    drinkObj.drinks[0] ? (
                      <DrinkItem
                        key={drinkObj.drinks[0].idDrink}
                        drink={drinkObj.drinks[0]}
                        favDrinks={favDrinks}
                        onToggleFavorite={() => {
                          const updatedFavDrinks = favDrinks.includes(Number(drinkObj.drinks[0].idDrink))
                            ? favDrinks.filter((id) => id !== Number(drinkObj.drinks[0].idDrink))
                            : [...favDrinks, drinkObj.drinks[0].idDrink];
                          updateFavoriteDrinks(id, updatedFavDrinks)
                            .then(() => onChangeFavDrinks(updatedFavDrinks))
                            .catch(() => Alert.alert("Error", "Failed to update favorite drinks."));
                        }}
                        onPressDetail={() =>
                          router.push({
                            pathname: "drink/detail",
                            params: { id: drinkObj.drinks[0].idDrink },
                          })
                        }
                      />
                    ) : null
                  )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyMessage}>No favorite drinks added.</Text>
        )}
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
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: Platform.OS == "android" ? 50 : 20,
    marginBottom: 10,
  },
  container_drinkrow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 20,
    marginLeft: "8%",
  },
  emptyMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontSize: 16,
    color: "#999",
  },
    loadingText: {
    flex: 1,
         justifyContent: "center",
         alignItems: "center",
         height: "100%",
    },
      loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      },
});
