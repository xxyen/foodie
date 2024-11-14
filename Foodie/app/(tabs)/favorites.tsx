import { View, Text, StyleSheet, SafeAreaView, Platform, Alert,ScrollView,Pressable,ImageBackground } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "@/context/contexts";
import { useRouter } from "expo-router";
import { updateFavoriteFoods, updateFavoriteDrinks,getRecipeById, searchCocktailById } from "../../utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function Tab() {
    const [favFoodObjects, setFavFoodObjects] = useState([]);
    const [favDrinkObjects, setFavDrinkObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Food');
    const { id, favDrinks, favFoods, onChangeFavDrinks, onChangeFavFoods } = useAppContext();
    const router = useRouter();
    const [isSelected, setIsSelected] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchRecipes();
      await fetchDrinks();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
  console.log(favFoods);
  console.log(favDrinks);
}, [favFoods, favDrinks]);


const fetchRecipes = useCallback(async () => {
  try {
    const promises = favFoods.map(id => getRecipeById(id));
    const recipes = await Promise.all(promises);
    setFavFoodObjects(recipes);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
  }
}, [favFoods]);

const fetchDrinks = useCallback(async () => {
  try {
    const promises = favDrinks.map(id => searchCocktailById(id));
    const drinks = await Promise.all(promises);
    setFavDrinkObjects(drinks);
    console.log(drinks);
  } catch (error) {
    console.error("Failed to fetch drinks:", error);
  }
}, [favDrinks]);

     const renderFoodItem = (recipe: IFoodRecipe, index: number) => (
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
                              <Pressable
                                onPress={(event) => onPressAddFavFood(recipe.id)}
                              >
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
      );

        function onPressAddFav(selectedRecipeId: number): void {

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
        router.push({ pathname: "home/detail", params: { data: JSON.stringify(recipe)} });
      }

      function onPressAddFavDrink(idDrink: number): void {
          let newFavDrinks: number[] = [];
          let alertMessage: string;


          if (favDrinks.includes(Number(idDrink))) {
              newFavDrinks = favDrinks.filter(
                (drinkId) => drinkId !== Number(idDrink)
              );
              alertMessage = "Drink removed from favorites.";
            } else {
              newFavDrinks = [...favDrinks, Number(idDrink)];
              alertMessage = "Drink added to favorites!";
            }


          updateFavoriteDrinks(id, newFavDrinks).then(() => {
            onChangeFavDrinks(newFavDrinks);
            Alert.alert("Success", alertMessage);
          });
      }
        function onPressDetail(event: GestureResponderEvent, recipeId: string): void {
          router.push({ pathname: "drink/detail", params: { id: recipeId } });
        }

        const renderDrinkItem = (drink,colIndex) => (
         <Pressable key={ drink.idDrink} style={styles.container_drink_img} onPress={(event) => onPressDetail(event, drink.idDrink)}>
                          <View style={styles.img_wrapper}>
                            <ImageBackground
                              source={{ uri: drink.strDrinkThumb }}
                              style={styles.img}
                              resizeMode="cover"
                            >
                              <LinearGradient
                                colors={[
                                  "rgba(0, 0, 0, 0.3)",
                                  "rgba(0, 0, 0, 0)",
                                  "rgba(0, 0, 0, 0)",
                                  "rgba(0, 0, 0, 0.3)",
                                ]}
                                style={styles.gradient}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                              />
                              <Pressable onPress={() => onPressAddFavDrink(drink.idDrink)}>
                                <View style={styles.circle_drink}>
                                  <MaterialCommunityIcons
                                    name={favDrinks.includes(Number(drink.idDrink)) ? "heart" : "heart-plus"}
                                    size={20}
                                    style={
                                      favDrinks.includes(Number(drink.idDrink))
                                        ? styles.fav_icon_selected
                                        : styles.fav_icon_unselected
                                    }
                                  />
                                </View>
                              </Pressable>
                            </ImageBackground>
                          </View>
                        </Pressable>
        );


    const changeCategory = (index) => setIsSelected(index);

    const toggleFavoriteFood = async (id) => {
        const updatedFavFoods = favFoods.includes(id) ? favFoods.filter(foodId => foodId !== id) : [...favFoods, id];
        try {
          await updateFavoriteFoods(id, updatedFavFoods);
          onChangeFavFoods(updatedFavFoods);
          Alert.alert("Success", favFoods.includes(id) ? "Removed from favorites" : "Added to favorites");
        } catch (error) {
          Alert.alert("Error", "Failed to update favorite foods.");
          console.error(error);
        }
      };

   const toggleFavoriteDrink = async (id) => {
       const updatedFavDrinks = favDrinks.includes(id) ? favDrinks.filter(drinkId => drinkId !== id) : [...favDrinks, id];
       try {
         await updateFavoriteDrinks(id, updatedFavDrinks);
         onChangeFavDrinks(updatedFavDrinks);
         Alert.alert("Success", favDrinks.includes(id) ? "Removed from favorites" : "Added to favorites");
       } catch (error) {
         Alert.alert("Error", "Failed to update favorite drinks.");
         console.error(error);
       }
     };

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>My Favorites</Text>
      <View style={styles.categoryContainer}>
              <Pressable onPress={() => changeCategory(0)} style={isSelected === 0 ? styles.selected : styles.unselected}>
                <Text style={isSelected === 0 ? styles.tagtext_selected : styles.tagtext_unselected}>Food</Text>
              </Pressable>
              <Pressable onPress={() => changeCategory(1)} style={isSelected === 1 ? styles.selected : styles.unselected}>
                <Text style={isSelected === 1 ? styles.tagtext_selected : styles.tagtext_unselected}>Drinks</Text>
              </Pressable>
            </View>
      <ScrollView style={styles.container}>
        {isSelected === 0 ? (
          favFoodObjects.length > 0 ? (
            favFoodObjects.map(renderFoodItem)
          ) : (
            <Text style={styles.emptyMessage}>No favorite food items added.</Text>
          )
        ) : (

          favDrinkObjects.length > 0 ? (
          <View>
          {Array.from({ length: Math.ceil(favDrinkObjects.length / 2) }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.container_drinkrow}>
              {favDrinkObjects.slice(rowIndex * 2, rowIndex * 2 + 2).map((drinkObj, colIndex) => (
                drinkObj.drinks[0] ? renderDrinkItem(drinkObj.drinks[0], rowIndex * 2 + colIndex) : null
              ))}
            </View>
          ))}

           </View>


          ) : (
            <Text style={styles.emptyMessage}>No favorite drinks added.</Text>
          )

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

  categoryContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 10,
      gap: 30,
    },
selected: {
       backgroundColor: "#E1AEC1",
       opacity: 0.8,
       borderRadius: 20,
       width: 100,
  },
  unselected: {
    backgroundColor: "#F1F5F5",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  tagtext_unselected: {
    fontSize: 16,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
    tagtext_selected: {
      fontSize: 16,
      color: "#FFFFFF",
      padding: 10,
      textAlign: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginLeft: "5%",
      marginTop: Platform.OS == "android" ? 50 : 20,
      marginBottom: 10,
    },

  container: {
    flex: 1,
    width: "100%",
    height:"100%",
//     paddingHorizontal: "5%",

  },
    img_wrapper: {
      borderRadius: 20,
      overflow: "hidden",
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
    container_drink_img: {
      alignContent: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "40%",
      marginVertical: 20,

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
      container_drinkrow: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 20,
        marginLeft:"8%",
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
    circle_drink: {
      height: 25,
      width: 25,
      backgroundColor: "white",
      borderRadius: 25 / 2,
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
      marginLeft:"80%",
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
  img: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  fav_icon_selected: {
      color: "red",
    },
    fav_icon_unselected: {
      color: "grey",
    },

emptyMessage: {
       flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         alignSelf: 'center',
      },
        gradient: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 10,
        },
});
