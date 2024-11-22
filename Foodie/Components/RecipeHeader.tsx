import React from "react";
import { View, Text, ImageBackground, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { food_place_holder } from "../config";

export function RecipeHeader({ title, image, isFavorite, onToggleFavorite, recipeType }) {

  const headerHeight = recipeType === "drink" ? 400 : 260;

  return (
    <View style={[styles.headerContainer, { height: headerHeight }]}>
      <ImageBackground source={{ uri: image || food_place_holder }} style={styles.imageBackground}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "transparent", "rgba(0, 0, 0, 0.4)"]}
          style={styles.gradient}
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onToggleFavorite}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-plus"}
                size={20}
                color={isFavorite ? "red" : "grey"}
              />
            </View>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "90%",
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
  iconWrapper: {
    height: 30,
    width: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
