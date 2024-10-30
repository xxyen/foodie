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
} from "react-native";
import { getRandomCocktailRecipe } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  // states
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("Gin");
  const [data, setData] = useState<IApiDrinkIdData | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // functions
  function changeTag(num: number, tag: string): void {
    setIsSelected(num);
    setTag(tag);
  }

  // render
  useEffect(() => {
    const fetchData = async () => {
      const recipes = await getRandomCocktailRecipe(tag);
      setData(recipes);
    };
    fetchData();
  }, [tag]);

  function onPressAddFav(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>
      <View style={styles.container}>
        <ScrollView horizontal={true} style={{ width: "90%" }} showsHorizontalScrollIndicator={false}>
          <View style={styles.container_topbar}>
            <Pressable
              style={
                isSelected === 0 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(0, "Gin")}
            >
              <Text
                style={
                  isSelected === 0
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Gin
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 1 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(1, "Vodka")}
            >
              <Text
                style={
                  isSelected === 1
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Vodka
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 2 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(2, "Rum")}
            >
              <Text
                style={
                  isSelected === 2
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Rum
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 3 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(3, "Tequila")}
            >
              <Text
                style={
                  isSelected === 3
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Tequila
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <ScrollView style={styles.container_recipes}>
          <View style={styles.container_drinkrow}>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[0]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[0]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[1]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[1]?.strDrink}
              </Text> */}
            </Pressable>
          </View>
          <View style={styles.container_drinkrow}>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[2]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[2]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[3]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[3]?.strDrink}
              </Text> */}
            </Pressable>
          </View>
          <View style={styles.container_drinkrow}>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[4]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[4]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <View style={styles.img_wrapper}>
                <ImageBackground
                  source={{ uri: data && data?.drinks[5]?.strDrinkThumb }}
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
                  <Pressable onPress={onPressAddFav}>
                    <View style={styles.circle}>
                      <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-plus"}
                        size={20}
                        style={
                          isFavorite
                            ? styles.fav_icon_selected
                            : styles.fav_icon_unselected
                        }
                      />
                    </View>
                  </Pressable>
                </ImageBackground>
              </View>
              {/* <Text style={styles.text}>
                {data && data?.drinks[5]?.strDrink}
              </Text> */}
            </Pressable>
          </View>
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
  container_topbar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
    gap: 10,
  },
  container_recipes: {
    width: "100%",
  },
  container_recipes_img: {
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
  container_drinkrow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: Platform.OS == "android" ? 50 : 20,
    marginBottom: 10,
  },
  tag_selected: {
    backgroundColor: "#67A5A9",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  tagtext_selected: {
    fontSize: 14,
    color: "#FFFFFF",
    padding: 10,
    textAlign: "center",
  },
  tag_unselected: {
    backgroundColor: "#F1F5F5",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  tagtext_unselected: {
    fontSize: 14,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
  img: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
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
