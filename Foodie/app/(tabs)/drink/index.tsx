import React, { useEffect, useState } from "react";
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
import { getRandomCocktailRecipe, updateFavoriteDrinks } from "../../../utils";
import { useAppContext } from "@/context/contexts";
import { router } from "expo-router";
import CategorySelector from "../../../Components/CategorySelector";
import DrinkItem from "../../../Components/DrinkItem";

export default function Home() {
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("Gin");
  const [data, setData] = useState<IApiDrinkIdData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { id, favDrinks, onChangeFavDrinks } = useAppContext();

  // Fetch drinks based on the selected category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const recipes = await getRandomCocktailRecipe(tag);
        setData(recipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tag]);

  const handleCategoryChange = (index: number, category: string) => {
    setIsSelected(index);
    setTag(category);
  };

  const handleToggleFavorite = (drinkId: number) => {
    if (!id) {
      console.log("User not logged in. Redirecting to Profile.");
      router.push("profile");
      return;
    }

    const newFavDrinks = favDrinks.includes(drinkId)
      ? favDrinks.filter((id) => id !== drinkId)
      : [...favDrinks, drinkId];

    updateFavoriteDrinks(id, newFavDrinks)
      .then(() => {
        onChangeFavDrinks(newFavDrinks);
        Alert.alert(
          "Success",
          favDrinks.includes(drinkId)
            ? "Drink removed from favorites."
            : "Drink added to favorites!"
        );
      })
      .catch((error) => console.error("Error updating favorites:", error));
  };

  const handlePressDetail = (drinkId: string) => {
    router.push({ pathname: "drink/detail", params: { id: drinkId } });
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#E1AEC1" />
        </View>
      ) : (
        <View style={styles.container}>
          {/* Category Selector */}
          <CategorySelector
            selectedIndex={isSelected}
            onSelect={handleCategoryChange}
            categories={["Gin", "Vodka", "Rum", "Tequila"]}
          />

          {/* Drinks Grid */}
          <ScrollView style={styles.container_recipes}>
             {data?.drinks?.slice(0, 6).map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.container_drinkrow}>
                          {data.drinks.slice(rowIndex * 2, rowIndex * 2 + 2).map((drink, colIndex) => (
              <DrinkItem
                key={drink.idDrink}
                drink={drink}
                favDrinks={favDrinks}
                onToggleFavorite={() => handleToggleFavorite(Number(drink.idDrink))}
                onPressDetail={() => handlePressDetail(drink.idDrink)}
              />
              ))}
                        </View>
                      ))}
          </ScrollView>
        </View>
      )}
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
    height: "100%",
  },
   container_drinkrow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
});
