import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { useAppContext } from "@/context/contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { getProfile } from "@/utils";
import { updateIngredients, getIngredientImage } from "@/utils";

export default function ShoppingList() {
  const { id, ingredients, onChangeIngredients } = useAppContext();
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
  // const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [ingredientImages, setIngredientImages] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const userData = await getProfile(id);
        if (userData) {
          setUserInfo(userData);

          setTimeout(async () => {
            if (userData.ingredients && userData.ingredients.length > 0) {
              await fetchAndCacheIngredientImages(userData.ingredients);
            }
          }, 1000);
        }
      }
    };
    fetchData();
  }, [id]);

  const fetchAndCacheIngredientImages = async (ingredients: string[]) => {
    const imageMap: Record<string, string> = { ...ingredientImages };

    for (const ingredient of ingredients) {
      if (imageMap[ingredient]) continue;

      const cachedImage = await AsyncStorage.getItem(`${ingredient}`);
      if (cachedImage) {
        imageMap[ingredient] = cachedImage;
      } else {
        const imageUrl = await getIngredientImage(ingredient);
        if (imageUrl) {
          imageMap[ingredient] = imageUrl;
          await AsyncStorage.setItem(`${ingredient}`, imageUrl);
        }
      }
    }

    setIngredientImages(imageMap);
  };

  const toggleSelection = (item: string) => {
    const updatedSelection = new Set(selectedItems);
    if (updatedSelection.has(item)) {
      updatedSelection.delete(item);
    } else {
      updatedSelection.add(item);
    }
    setSelectedItems(updatedSelection);
  };

  const confirmAndRemoveSelectedItems = () => {
    if (selectedItems.size === 0) {
      Alert.alert("No Items Selected", "Please select items to remove.");
      return;
    }

    Alert.alert(
      "Confirm Remove",
      `Are you sure you want to remove selected items?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: removeSelectedItems,
        },
      ]
    );
  };

  const removeSelectedItems = () => {
    const updatedList = ingredients.filter(
      (ingredient) => !selectedItems.has(ingredient)
    );
    updateIngredients(id, updatedList)
      .then(() => {
        onChangeIngredients(updatedList);
        setSelectedItems(new Set());
        Alert.alert(
          "Items Removed",
          "Selected items have been successfully removed."
        );
      })
      .catch((error) => {
        console.error("Failed to update ingredients:", error);
        Alert.alert("Error", "Failed to update the shopping list.");
      });
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.test}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>{`${ingredients.length} Items`}</Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.item,
              selectedItems.has(item) && styles.itemSelected,
            ]}
            onPress={() => toggleSelection(item)}
          >
            <Text
              style={[
                styles.text,
                selectedItems.has(item) && styles.textSelected,
              ]}
            >
              {item}
            </Text>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                uri: ingredientImages[item],
              }}
            />
          </Pressable>
        )}
      />
      <Pressable
        style={styles.deleteButton}
        onPress={confirmAndRemoveSelectedItems}
      >
        <Text style={styles.deleteButtonText}>Remove Selected</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  test: {
    marginTop: 20,
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
  },
  safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  containerTitle: {
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginLeft: 10,
  },
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: "5%",
  },
  item: {
    width: "95%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  itemSelected: {
    backgroundColor: "#000000",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  textSelected: {
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#E84234",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
