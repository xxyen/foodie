import {Buffer} from 'buffer';
import { Alert,Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from 'react';
import OpenAI from "openai";
import { Linking } from 'react-native';
import { API_CONFIG, OPENAI_API_KEY } from "./config";

// Search by Image
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const validateEmail = (input:string) => {
  const regex = /^\w+@(\w+.)+[a-zA-Z]+$/;
  return regex.test(input);
}

export const validPassword = (input:string) => {
  const cap = /[A-Z]+/;
  const dgt = /[0-9]+/;
  const low = /[a-z]+/;
  const spc = /[^A-Za-z0-9]+/;
  if(input.length>=8 && cap.test(input) && dgt.test(input) && low.test(input) && spc.test(input)){
    return true;
  }
  else{
    return false;
  }

}

// Search by Image: Image Recognition
async function OpenAIRecogByBase64(b64:string|undefined|null) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image? Give one ingredient name, without punctuations." },
          {
            type: "image_url",
            image_url: {
              "url":  `data:image/*;base64,${b64}`
            },
          },
        ],
      },
    ],
  });
  return response.choices[0]["message"]["content"];
}

export const galleryImage = async() =>{
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0,
    base64: true,
  });
  return result;
}

// Search by Image: Pick a Image from Gallery
export const pickImage = async () => {
  //Reference: https://gist.github.com/Balaagha/9b080d984d5b99e916293d24b4dfa01e
  const result = await galleryImage();

  if (!result.canceled) {
    let newFile = {
      uri:result.assets[0].uri,
      base64: result.assets[0].base64,
      type:`test/${result.assets[0].uri.split(".")[1]}`,
      name:`test.${result.assets[0].uri.split(".")[1]}`};
    //Can choose between using URL or Base64

    // const url = await handleUpload(newFile);
    // const categ = await classifyImage(url);
    // const categ = await OpenAIRecogByUrl(url);
    const categ = await OpenAIRecogByBase64(newFile.base64);
    // console.log(categ);
    return categ;
  }
};

export const updateIconByGallery = async(id:any) => {
  const result = await galleryImage();
  if (!result.canceled) {
      const uri = await fetch(result.assets[0].uri);
      const arrayBufferUri = await uri.arrayBuffer();
      const bufferUri = Buffer.from(arrayBufferUri);
      const res = await updateImage(id,bufferUri);
      if(res===200){
          return bufferUri;
      }

  }
  return undefined;
}

export const existingAccount = async (email:string) => {
    
    const config = {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        'email' : email,
      })
    };
    try{
      const response = await fetch(`${baseUrl}/validate`, config);
      const body = await response.json();
      if(response.status!=201){
        alert(body.message);
        return false;
      }
      else{
        return true;
      }
    } catch(err){
      alert(err);
      return false;
    }
    
  }

export const registerHelper = async (username:string,email:string,password:string,
allergies:string[],diets: string[], onChangeId:(id:string)=>void) => {
  
  const config = {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      'username' : username,
      'email' : email.toLowerCase(),
      'password' : password,
      'allergies': allergies,
      'diets' : diets,
    })
  };
  try{
    const response = await fetch(`${API_CONFIG.localServer.baseURL}/register`, config);
    const body = await response.json();
    if(response.status!=201){
      alert(body.message);
      return false;
    }
    else{
      onChangeId(body.userId);
      return true;
    }
  } catch(err){
    alert(err);
    return false;
  }
  
}

export async function getRandomFoodRecipe(
  tag: string
): Promise<undefined | IApiFoodRecipeData> {
  // TODO: assume no error here
  try{
    const response = await fetch(
      `${API_CONFIG.spoonacular.baseURL}/recipes/random?apiKey=${API_CONFIG.spoonacular.apiKEY}&limitLicense=true&tags=${tag}&number=3&includeNutrition=true`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: IApiFoodRecipeData = await response.json();
    return data;
  }
  catch(err){
    console.error("Error fetching recipe information:", err);
    return undefined;
  }
}

export const fetchBotResponse = async (userMessage: string, contextId: string) => {
  const { baseURL, apiKEY } = API_CONFIG.spoonacular;
  try {
    const response = await fetch(
      `${baseURL}/food/converse?text=${encodeURIComponent(userMessage)}&contextId=${contextId}&apiKey=${apiKEY}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return {
      success: true,
      answerText: data.answerText || "I'm sorry, I couldn't find an answer to that.",
      media: data.media || [],
    };
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return {
      success: false,
      answerText: "Sorry, I encountered an error while fetching the data. Please try again.",
      media: [],
    };
  }
};


export async function getFoodRecipeAutoComplete(
  searchText: string
) {
  const { baseURL, apiKEY } = API_CONFIG.spoonacular;
  // TODO: assume no error here
  const response = await fetch(
    `${baseURL}/recipes/autocomplete?query=${searchText}&number=10&apiKey=${apiKEY}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

export async function getFoodRecipeByIngredients(
  tag: string
) {
  // TODO: assume no error here
  try{
    const response = await fetch(
       `${API_CONFIG.spoonacular.baseURL}/recipes/complexSearch?includeIngredients=${tag}&number=3&instructionsRequired=true&addRecipeInformation=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&apiKey=${API_CONFIG.spoonacular.apiKEY}`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  }
  catch(err){
    console.error("Error fetching recipe information:", err);
    return undefined;
  }
}


export async function getRecipeById(id: number): Promise<undefined | IApiFoodRecipeData> {
  try {
    const response = await fetch(`${API_CONFIG.spoonacular.baseURL}/recipes/${id}/information?apiKey=${API_CONFIG.spoonacular.apiKEY}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: IApiFoodRecipeData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe information:", error);
    return undefined;
  }
}

export async function getRandomCocktailRecipe(
    tag: string
  ): Promise<undefined | IApiDrinkIdData> {
  
    // TODO: assume no error here
    const response = await fetch(
      `${API_CONFIG.cocktailDB.baseURL}/api/json/v1/${API_CONFIG.cocktailDB.apiKEY}/filter.php?i=${tag}`
    );
    const data: IApiDrinkIdData = await response.json();

    if (data?.drinks) {
      data.drinks = data.drinks.sort(() => Math.random() - 0.5);
    }
  
    return data;
  }

  export async function searchCocktailById(id: number): Promise<undefined | IApiDrinkIdData> {
    const { baseURL, apiKEY } = API_CONFIG.cocktailDB;

    // TODO: assume no error here
    const response = await fetch(`${baseURL}/api/json/v1/${apiKEY}/lookup.php?i=${id}`);
    const data: IApiDrinkIdData = await response.json();

    // Check if data.drinks exists and has at least one element
    if (!data?.drinks || data.drinks.length === 0) {
      console.warn(`No cocktail found with ID: ${id}`);
      return undefined;
    }

    return data;
  }


export const openCamerHelper = async() => {
    // ref = 'https://stackoverflow.com/questions/74452419/error-call-to-function-exponentimagepicker-launchcameraasync-has-been-rejecte'

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted === false) {
      return;
    }
  
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    return res;
}

export const openCamera = async (result:any) => {
  const res = await openCamerHelper();

  if (res && !res.canceled) {
    const { assets } = res;
    if (assets && assets.length > 0) {
      let newFile = {
        uri:res.assets[0].uri,
        base64: res.assets[0].base64,
        type:`test/${res.assets[0].uri.split(".")[1]}`,
        name:`test.${res.assets[0].uri.split(".")[1]}`};
      // const url = await handleUpload(newFile);
      // const categ = await classifyImage(url);
      const categ = await OpenAIRecogByBase64(newFile.base64);
      return categ;
    }
  }
};


export const updateIconByCamera = async(id:any) => {
  const result = await openCamerHelper();

  if (result && !result.canceled) {
    const { assets } = result;
    if (assets && assets.length > 0) {
      const uri = result.assets[0].uri;
      const fetchUri = await fetch(uri);
      const arrayBufferUri = await fetchUri.arrayBuffer();
      const bufferUri = Buffer.from(arrayBufferUri);
      const res = await updateImage(id,bufferUri);
      if(res===200){
          return bufferUri;
      }
    }
  }
  return undefined;
}

async function OpenAIRecogByUrl(url:string) {
  //Ref: https://platform.openai.com/docs/guides/vision?lang=node
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image? Give a phrase less than 3 words, without punctuations." },
          {
            type: "image_url",
            image_url: {
              "url": url,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0]["message"]["content"];
}



const handleUpload = async (image:any)=>{
  const data = new FormData(); 
  data.append('file',image);  
  data.append('upload_preset','unsigned_preset');
  data.append('cloud_name','dg2ht2fvn'); 
  try{
    const res = await fetch("https://api.cloudinary.com/v1_1/dg2ht2fvn/image/upload",{  method:'post',body:data})
    const json = await res.json()
    return json.secure_url;
  }
  catch(err){
    console.log(err)
  }
}

export async function classifyImage(url:any){
  const { baseURL, apiKEY } = API_CONFIG.spoonacular;

  const config = {
    method : 'GET',
    headers: {
      // "Content-Type": 'multipart/form-data',
      "Content-Type": 'application/json',
    },
  };

  try{
    const response = await fetch(`${baseURL}/food/images/classify?imageUrl=${url}&apiKey=${apiKEY}`,config);
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.log(errorData);
        console.error('Error:', errorData.message || 'Unknown error occurred');
      } else {
        const errorText = await response.text();
        console.error('Server returned an error page:', errorText);
      }
    }
    else{
      const data = await response.json();
      return data.category;
    }} catch(err){
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      }
    }
  }


export const getProfile = async (id:string) => {
 const { localServer } = API_CONFIG;
  const config = {
    method : 'GET',
    headers : {
      'Content-Type': 'application/json'
    }
  };
  try{
    const response = await fetch(`${localServer.baseURL}/${id}`, config);
    const body = await response.json();
    if(response.status!=200){
      alert(body.message);
      return null;
    }
    else{
      const user: IUserInfo = body.user;//TODO: set everything
      return user;
    }
  } catch(err){
    alert(err);
  }
}

export const parseImage = (buffer: Buffer| undefined) => {
  // refer: https://stackoverflow.com/questions/62708802/how-to-convert-buffer-into-image-using-nodejs
  if (buffer){
    const b64 = Buffer.from(buffer).toString('base64');
    const str8 = Buffer.from(buffer).toString('utf8');
    if(str8.includes('googleusercontent.com')){
      return str8;
    }
    else{
      const mimeType = 'image/*';
      const uri = `data:${mimeType};base64,${b64}`;
      return uri;
    }
  }
  
}

const updateHelper = async(id: string|undefined, config:RequestInit, success: string) => {
  const { localServer } = API_CONFIG;
  try{
    const response = await fetch(`${localServer.baseURL}/${id}`, config);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1){
      const body = await response.json();
      if(response.status!=200){
        alert("Update failure: "+body.message);
      }
      else{
        Alert.alert("Congratulations", success);
      }
      return response.status;
    }
    else{
      alert("Update failure: network error");
      return 400;
    }
  } catch(err){
    alert(err);
    return 400;
  }
}

export const updateImage = async (id: string|undefined , buffer: Buffer) => {
  const config = {
    method : 'PUT',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      'icon' : buffer
    })
  };
  const jsonPayloadSize = new Blob([config.body]).size; // Size in bytes
  console.log(`Payload size: ${jsonPayloadSize} bytes`);
  return updateHelper(id,config,"Successfully update your profile photo!");
}

async function handleTakePicture() {
  const cameraView = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  // Take a picture
  console.log("taking picture...");
  const result = await cameraView.current?.takePictureAsync();

  if (result && result.uri) {
    console.log("took picture ", result.uri);
    return result.uri;
  }else{
    return null;
  }
}

export async function updateFavoriteFoods(id:any, newFavFoods:number[]
) {
    try {
        const response = await fetch(`${API_CONFIG.localServer.baseURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favFoods: newFavFoods }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Update failed:", errorData.message);
            alert(errorData);
        } else {
            const data = await response.json();
            console.log(data.message);
        }
    } catch (error) {
        console.error("Request error:", error);
        alert(error);
    }
}

export async function updateFavoriteDrinks(id:any, newFavDrinks:number[]) {
    try {
        console.log("newFavDrinks: ", newFavDrinks);
        const response = await fetch(`${API_CONFIG.localServer.baseURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favDrinks: newFavDrinks }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Update failed:", errorData.message);
            alert(errorData.message);
        } else {
            const data = await response.json();
            console.log(data.message);
        }
    } catch (error) {
        console.error("Request error:", error);
        alert(error);
    }
}

export function getFoodIngredientImage(name: string){
  const url = "https://img.spoonacular.com/ingredients_100x100/" + name;
  // console.log(url);
  return url;
}
export function getDrinkIngredientImage(name: string){
  const url = `https://www.thecocktaildb.com/images/ingredients/${name}-Small.png`
  // console.log(url);
  return url;
}

export async function getRecipeDetails(id: string) {
  const { baseURL, apiKEY } = API_CONFIG.cocktailDB;
  
    // TODO: assume no error here
    const response = await fetch(
      `${baseURL}/api/json/v1/${apiKEY}/lookup.php?i=${id}`
    );
    const data = await response.json();
    // console.log(data);

    // TODO: Random choose 4 drink if data has more than 4drinks

    return data;
}

export async function updateIngredients(id: any, newIngredients: string[]) {
  const { localServer } = API_CONFIG;
  try {
      const updateResponse = await fetch(`${localServer.baseURL}/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredients: newIngredients }),
      });

      if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error("Update failed:", errorData.message);
          alert(errorData.message);
      } else {
          const data = await updateResponse.json();
          console.log(data.message);
      }
  } catch (error) {
      console.error("Request error:", error);
      alert(error);
  }
}

export async function updateCalories(id: string, weeklyCalories: number[]) {
  const { localServer } = API_CONFIG;
  try {
    const response = await fetch(`${localServer.baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weeklyCalories: weeklyCalories }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error updating calories:", error);
    alert("Failed to update daily intake.");
  }
}


export async function getIngredientImage(name: string): Promise<string> {
  const url = `https://api.spoonacular.com/food/ingredients/search?query=${name}&number=1&apiKey=${API_CONFIG.spoonacular.apiKEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results && data.results.length > 0) {
      const imagePath = `https://spoonacular.com/cdn/ingredients_100x100/${data.results[0].image}`;
      return imagePath;
    } else {
      return `https://www.thecocktaildb.com/images/ingredients/${name.toLowerCase()}-Small.png`;
    }
  } catch (error) {
    console.error("Error fetching ingredient image:", error);
    return "";
  }
}

export async function changeAllergies(id:string|undefined, allergies:string[]){
  const { localServer } = API_CONFIG;
  try {
    const updateResponse = await fetch(`${localServer.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allergies: allergies }),
    });

    if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Update failed:", errorData.message);
        alert(errorData.message);
        return false;
    } else {
        const data = await updateResponse.json();
        console.log(data.message);
        return true;
    }
  } catch (error) {
      console.error("Request error:", error);
      alert(error);
      return false;
  }
}

export function extractEmoji(inputs:string[]){
  return inputs.map((a)=>a.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, '').replace(/\u{1FAD8}/u,'').replace(/\u{1FAA8}/u,'')
  .toLowerCase().replace(' ','_'));
}

export async function sendEmail(to:string, subject:string, content:string) {
  const { localServer } = API_CONFIG;
  try {
    const sendResponse = await fetch(`${localServer.baseURL}/sendEmail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': to,
          'subject': subject,
          'content': content
        })
    });

    if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        console.error("send email failed:", errorData.message);
        alert(errorData.message);
        return false;
    } else {
        const data = await sendResponse.json();
        console.log(data.message);
        return true;
    }
  } catch (error) {
      console.error("Request error:", error);
      alert(error);
      return false;
  }
}

export async function setNewPassword(email:string,password:string){
  const { localServer } = API_CONFIG;
  try {
    const updateResponse = await fetch(`${localServer.baseURL}/${email}/newPassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password }),
    });

    if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Update failed:", errorData.message);
        alert(errorData.message);
        return false;
    } else {
        const data = await updateResponse.json();
        console.log(data.message);
        return true;
    }
  } catch (error) {
      console.error("Request error:", error);
      alert(error);
      return false;
  }
}


// export async function getRecipeDetails(id: number): Promise<IApiFoodRecipeData["recipes"] | undefined> {
//   const baseURL = "https://api.spoonacular.com";
//   const apiKEY = "af648e0c5ba441cdbb8dcdec0e2b3a1d";

//   const response = await fetch(
//     `${baseURL}/recipes/${id}/information?includeNutrition=true&apiKey=${apiKEY}`
//   );
//   if (!response.ok) {
//     console.error("Failed to fetch recipe details:", response.statusText);
//     return undefined;
//   }

//   const data: IApiFoodRecipeData["recipes"] = await response.json();
//   return data;
// }


