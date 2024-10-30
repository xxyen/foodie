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
import { getRandomFoodRecipe } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useAppContext } from "@/context/contexts";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const { id, onChangeId } = useAppContext();

  // states
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("breakfast");
  const [data, setData] = useState<IApiFoodRecipeData | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  // const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserIdFromUrl = async () => {
      const url = await Linking.getInitialURL();
      console.log("url: ", url);
      if (url) {
        const { queryParams } = Linking.parse(url);
        console.log("queryParams.userId: ", queryParams?.userId);
        if (queryParams?.userId) {
          if (typeof queryParams.userId === "string") {
            onChangeId(queryParams.userId);
          }
        }
      }
    };

    // Initial check for the deep link URL when the component mounts
    getUserIdFromUrl();

    // Listener for any incoming links while the app is open
    const urlListener = Linking.addEventListener("url", (event) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.userId) {
        if (typeof queryParams.userId === "string") {
          onChangeId(queryParams.userId);
        }
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      urlListener.remove();
    };
  }, []);

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

  function onPressAddFav(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  // render
  useEffect(() => {
    const fetchData = async () => {
      const recipes = await getRandomFoodRecipe(tag);
      setData(recipes);
    };
    fetchData();
  }, [tag]);

  return (
    <SafeAreaView style={styles.safearea}>
      <Text style={styles.title}>Today's Pick</Text>
      <View style={styles.container}>
        <ScrollView horizontal={true} style={{ width: "90%" }}>
          <View style={styles.container_topbar}>
            <Pressable
              style={
                isSelected === 0 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(0, "breakfast")}
            >
              <Text
                style={
                  isSelected === 0
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Breakfast
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 1 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(1, "lunch")}
            >
              <Text
                style={
                  isSelected === 1
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Lunch
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 2 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(2, "dinner")}
            >
              <Text
                style={
                  isSelected === 2
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Dinner
              </Text>
            </Pressable>
            <Pressable
              style={
                isSelected === 3 ? styles.tag_selected : styles.tag_unselected
              }
              onPress={() => changeTag(3, "snack")}
            >
              <Text
                style={
                  isSelected === 3
                    ? styles.tagtext_selected
                    : styles.tagtext_unselected
                }
              >
                Snacks
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <ScrollView style={styles.container_recipes}>
          <Pressable style={styles.container_recipes_img}>
            <View style={styles.img_wrapper}>
              <ImageBackground
                source={{ uri: data && data?.recipes[0]?.image }}
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
                  <Text style={styles.text}>
                    {data && data?.recipes[0]?.title}
                  </Text>
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
                </View>
              </ImageBackground>
            </View>
          </Pressable>
          <Pressable style={styles.container_recipes_img}>
            <View style={styles.img_wrapper}>
              <ImageBackground
                source={{ uri: data && data?.recipes[1]?.image }}
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
                  <Text style={styles.text}>
                    {data && data?.recipes[1]?.title}
                  </Text>
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
                </View>
              </ImageBackground>
            </View>
          </Pressable>
          <Pressable style={styles.container_recipes_img}>
            <View style={styles.img_wrapper}>
              <ImageBackground
                source={{ uri: data && data?.recipes[2]?.image }}
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
                  <Text style={styles.text}>
                    {data && data?.recipes[2]?.title}
                  </Text>
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
                </View>
              </ImageBackground>
            </View>
          </Pressable>
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
    alignItems: "center",
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
    width: "90%",
    marginVertical: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

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
  tag_selected: {
    backgroundColor: "#E1AEC1",
    opacity: 0.8,
    borderRadius: 20,
    width: 100,
  },
  tagtext_selected: {
    fontSize: 16,
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
    fontSize: 16,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
  img: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
