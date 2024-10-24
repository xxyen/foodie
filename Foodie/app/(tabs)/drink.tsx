import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { getRandomCocktailRecipe } from "../../utils";

export default function Home() {
  // states
  const [isSelected, setIsSelected] = useState<number>(0);
  const [tag, setTag] = useState<string>("Gin");
  const [data, setData] = useState<IApiDrinkIdData | undefined>(undefined);

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
              <Image
                source={{ uri: data && data?.drinks[0]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
              {/* <Text style={styles.text}>
                {data && data?.drinks[0]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <Image
                source={{ uri: data && data?.drinks[1]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
              {/* <Text style={styles.text}>
                {data && data?.drinks[1]?.strDrink}
              </Text> */}
            </Pressable>
          </View>
          <View style={styles.container_drinkrow}>
            <Pressable style={styles.container_recipes_img}>
              <Image
                source={{ uri: data && data?.drinks[2]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
              {/* <Text style={styles.text}>
                {data && data?.drinks[2]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <Image
                source={{ uri: data && data?.drinks[3]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
              {/* <Text style={styles.text}>
                {data && data?.drinks[3]?.strDrink}
              </Text> */}
            </Pressable>
          </View>
          <View style={styles.container_drinkrow}>
            <Pressable style={styles.container_recipes_img}>
              <Image
                source={{ uri: data && data?.drinks[4]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
              {/* <Text style={styles.text}>
                {data && data?.drinks[4]?.strDrink}
              </Text> */}
            </Pressable>
            <Pressable style={styles.container_recipes_img}>
              <Image
                source={{ uri: data && data?.drinks[5]?.strDrinkThumb }}
                style={styles.img}
                resizeMode="cover"
              />
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
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
