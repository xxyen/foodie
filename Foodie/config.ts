import { Platform } from "react-native";

//Android original server addr: http://10.0.2.2:4000/users
export const API_CONFIG = {
  spoonacular: {
    baseURL: "https://api.spoonacular.com",
    apiKEY: "5764fe09cc624a12adee3886b3226a29",
  },
  cocktailDB: {
    baseURL: "https://www.thecocktaildb.com",
    apiKEY: "1",
  },
  localServer: {
    baseURL:  "https://foodie.zeus.wang/users",
  },
};

export const OPENAI_API_KEY = "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";