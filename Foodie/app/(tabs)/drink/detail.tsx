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
import { getIngredientImage, getRandomCocktailRecipe, getRecipeDetails } from "@/utils";

export default function Tab() {

  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<ICocktailRecipe | undefined>(undefined);
  const [ingredients, setIngredients] = useState<string[] | undefined>(undefined);


  useEffect(() => {
    if (id) {
      const fetchRecipeDetails = async () => {
        if (id) {
          const recipeData = await getRecipeDetails(id.toString());
          if (recipeData) {
            setRecipe(recipeData.drinks[0]);
          }
        }
      }
      fetchRecipeDetails();
      console.log(recipe);
    }
  }, [id]);

  useEffect(() => {
    if(recipe){ 
      const ingredients: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof ICocktailRecipe];
        if (ingredient) {
          ingredients.push(`${ingredient}`);
        }
      }
      setIngredients(ingredients);
    }
  }, [recipe]);
  

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

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_img}>
          <Text style={styles.title_h1}>Recipe Detail</Text>
          <ImageBackground
            source={{ uri: recipe?.strDrinkThumb }}
            style={styles.img_wrapper}
            resizeMode="cover"
          />
        </View>

        <View style={styles.container_title}>
          <Text style={styles.title_h2}>Ingredients</Text>
          <Text style={styles.subtitle}>{`${ingredients?.length || 0} Items`}</Text>
        </View>
        <View style={styles.container_ingredient}>
        {ingredients && ingredients.map((ingredient, i) => (
            <View key={i} style={styles.container_ingredient_item}>
              <Text style={styles.text_paragraph}>{ingredient}</Text>
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
          <Text style={styles.text_paragraph}>
            {recipe.strInstructions}
          </Text>
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
    marginBottom: 20
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
