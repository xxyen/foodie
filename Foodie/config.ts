import { Platform } from "react-native";

export const API_CONFIG = {
  spoonacular: {
    baseURL: "https://api.spoonacular.com",
    apiKEY: "81de5edb121a45b5844845a4c7f7441a",
  },
  cocktailDB: {
    baseURL: "https://www.thecocktaildb.com",
    apiKEY: "1",
  },
  localServer: {
    baseURL: Platform.OS === "android" ? "http://10.0.2.2:4000/users" : "http://localhost:4000/users",
  },
};

export const OPENAI_API_KEY = "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";