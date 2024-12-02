import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  getFoodIngredientImage,
  getDrinkIngredientImage,
} from "@/utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function IngredientList({ ingredients,recipeType  }) {

  const [ingredientImages, setIngredientImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const cacheIngredientImages = async () => {
      const imageMap: Record<string, string> = { ...ingredientImages };

      for (const ingredient of ingredients) {
        const name = recipeType === "drink" ? ingredient : ingredient.name;
        const imageKey = `${name}`;

        if (imageMap[name]) continue;

        const cachedImage = await AsyncStorage.getItem(imageKey);
        if (cachedImage) {
          imageMap[name] = cachedImage;
        } else {
          const imageUrl =
            recipeType === "drink"
              ? getDrinkIngredientImage(ingredient)
              : getFoodIngredientImage(ingredient.image);

          if (imageUrl) {
            imageMap[name] = imageUrl;
            await AsyncStorage.setItem(imageKey, imageUrl);
          }
        }
      }

      setIngredientImages(imageMap);
    };

    cacheIngredientImages();
  }, [ingredients]);

  return (
    <View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Ingredients</Text>
        <Text style={styles.subtitle}>{`${ingredients.length} Items`}</Text>
      </View>
      <View style={styles.container}>
        {ingredients.map((ingredient, index) => (
          <View key={`${ingredient.id}-${index}`} style={styles.item}>
            <Text style={styles.text}>{recipeType === "drink"?ingredient:ingredient.name}</Text>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                              uri: recipeType === "drink"
                                ? getDrinkIngredientImage(ingredient)
                                : getFoodIngredientImage(ingredient.image),
                            }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    padding: 10,
  },
  item: {
    width: "90%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
  },
});
