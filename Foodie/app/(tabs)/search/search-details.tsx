import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  ImageBackground,
  GestureResponderEvent,
  Alert,
} from "react-native";
import {
  getFoodRecipeByIngredients,
  getRandomFoodRecipe,
  updateFavoriteFoods,
} from "../../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Home() {
  const { id, onChangeId, favFoods, onChangeFavFoods} = useAppContext();
  
  const { pressedTag, type } = useLocalSearchParams();

  // states
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("");
  const [data, setData] = useState<IApiFoodRecipeData | undefined | any>(
    undefined
  );

  // navigation
  const router = useRouter();

  useEffect(() => {
    if (pressedTag) {
      const tag = pressedTag as string;
      console.log(tag.toLowerCase());
      setTag(tag.toLowerCase());
    }
  }, [pressedTag]);

  useEffect(() => {
    const fetchData = async () => {
      if (type === "byTag") {
        const recipes = await getRandomFoodRecipe(tag);
        if (recipes) {
          setData(recipes.recipes);
        }
      }
      if (type === "byIngredient"){
        const recipes = await getFoodRecipeByIngredients(tag);
        if (recipes) {
          setData(recipes.results);
        }
      }
    };
    fetchData();
  }, [tag]);

  useEffect(() => {
    if (id) {
      console.log("Updated userId: ", id);
    }
  }, [id]);

  // functions
  function changeTag(num: number, tag: string): void {
    setIsSelected(num);
    setTag(tag);
  }

  function onPressAddFav(event: GestureResponderEvent, index: number): void {
    // check if login
    if (!id) {
      console.log("User not logged in. Redirecting to Profile.");
      router.push("profile");
      return;
    }

    const selectedRecipeId = data?.recipes[index]?.id;
    if (!selectedRecipeId) {
      console.error("Invalid recipe ID");
      return;
    }

    let newFavFoods;
    let alertMessage;

    if (favFoods.includes(selectedRecipeId)) {
      // remove favorite
      newFavFoods = favFoods.filter((foodId) => foodId !== selectedRecipeId);
      console.log("remove:", newFavFoods);
      alertMessage = "Recipe removed from favorites.";
    } else {
      // add new favorite
      newFavFoods = [...favFoods, selectedRecipeId];
      console.log("add:", newFavFoods);
      alertMessage = "Recipe added to favorites!";
    }

    updateFavoriteFoods(id, newFavFoods).then(() => {
      onChangeFavFoods(newFavFoods);
      Alert.alert("Success", alertMessage);
    });
  }

  function onPressDetail(
    event: GestureResponderEvent,
    recipe: IFoodRecipe
  ): void {
    console.log("user press check detail");
    // console.log(recipe);
    router.push({
      pathname: "home/detail",
      params: { data: JSON.stringify(recipe) },
    });
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Search Results</Text>
      <View style={styles.container}>
        <ScrollView style={styles.container_recipes}>
          {data?.map((recipe, index) => (
            <Pressable
              key={recipe.id}
              style={styles.container_recipes_img}
              onPress={(event) => onPressDetail(event, recipe)}
            >
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: recipe.image }}
                  style={styles.img}
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
                    <Pressable onPress={(event) => onPressAddFav(event, index)}>
                      <View style={styles.circle}>
                        <MaterialCommunityIcons
                          name={
                            favFoods.includes(recipe.id)
                              ? "heart"
                              : "heart-plus"
                          }
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
            </Pressable>
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
  container_recipes_img: {
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
    marginVertical: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,

    elevation: 20, // TODO: seems like not work
  },
  container_text_and_btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: Platform.OS == "android" ? 50 : 20,
    marginBottom: 10,
  },
  img: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
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
  img_wrapper: {
    borderRadius: 20,
    overflow: "hidden",
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
});
