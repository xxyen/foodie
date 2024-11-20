import { Platform } from "react-native";

export const API_CONFIG = {
  spoonacular: {
    baseURL: "https://api.spoonacular.com",
    apiKEY: "369bec8fd4ac4cb48d6871f67f635722",
  },
  cocktailDB: {
    baseURL: "https://www.thecocktaildb.com",
    apiKEY: "1",
  },
  localServer: {
    baseURL: Platform.OS === "android" ? "http://10.0.2.2:4000/users" : "http://67.159.75.53:4123/users",
  },
};

export const OPENAI_API_KEY = "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";