import React from "react";
import { View, Text, Pressable, ImageBackground, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { food_place_holder } from "../config";

export default function FoodItem({ food, favFoods, onToggleFavorite, onPressDetail }) {
  return (
    <Pressable style={styles.container} onPress={onPressDetail}>
      <View style={styles.img_wrapper}>
        <ImageBackground source={{ uri: food.image || food_place_holder }} style={styles.img} resizeMode="cover">
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]}
            style={styles.gradient}
          />
          <View style={styles.container_text_and_btn}>
            <Text style={styles.text}>{food.title}</Text>
            <Pressable onPress={onToggleFavorite}>
              <View style={styles.circle}>
                <MaterialCommunityIcons
                  name={favFoods.includes(food.id) ? "heart" : "heart-plus"}
                  size={20}
                  style={favFoods.includes(food.id) ? styles.fav_icon_selected : styles.fav_icon_unselected}
                />
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  img_wrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  img: {
    height: 180,
    width: "100%",
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  container_text_and_btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  text: {
    flex: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 3,
  },
  circle: {
    height: 30,
    width: 30,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  fav_icon_selected: {
    color: "red",
  },
  fav_icon_unselected: {
    color: "grey",
  },
});
