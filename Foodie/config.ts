import { Platform } from "react-native";

//Android original server addr: http://10.0.2.2:4000/users
export const API_CONFIG = {
  spoonacular: {
    baseURL: "https://api.spoonacular.com",
    apiKEY: ["af648e0c5ba441cdbb8dcdec0e2b3a1d","a391c51a20ac4e878b52c3778f616389","369bec8fd4ac4cb48d6871f67f635722",
      "5764fe09cc624a12adee3886b3226a29","fc2dee7142a457b9faae9e34afc8087","9fc2dee7142a457b9faae9e34afc8087","ee108ed19fcd41469c7bf25878746b1e", "f3893f4c0f2f42899121a9574fdb9aa0"
    ],
    apiTerm : 0,
  },
  cocktailDB: {
    baseURL: "https://www.thecocktaildb.com",
    apiKEY: "1",
  },
  localServer: {
    // baseURL:  "https://foodie.zeus.wang/users",
    baseURL: "http://localhost:4000/users",
  },
};

export const OPENAI_API_KEY = "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";

export const food_place_holder = "https://theme-assets.getbento.com/sensei/b202d6f.sensei/assets/images/catering-item-placeholder-704x520.png";
// Backup Spoonacular API KEY:
// a391c51a20ac4e878b52c3778f616389
// 369bec8fd4ac4cb48d6871f67f635722
// af648e0c5ba441cdbb8dcdec0e2b3a1d -
// 5764fe09cc624a12adee3886b3226a29 -
// 9fc2dee7142a457b9faae9e34afc8087