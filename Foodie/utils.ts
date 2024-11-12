import {Buffer} from 'buffer';
import { Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from 'react';
import OpenAI from "openai";

// Search by Image
const openai = new OpenAI({
  apiKey: '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',
});

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

// Search by Image: Pick a Image from Gallery
export const pickImage = async () => {
  //Reference: https://gist.github.com/Balaagha/9b080d984d5b99e916293d24b4dfa01e
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0,
    base64: true,
  });

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

export const registerHelper = async (username:string,email:string,password:string,
allergies:string[],diets: string[], onChangeId:(id:string)=>void) => {
  
  const config = {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      'username' : username,
      'email' : email,
      'password' : password,
      'allergies': allergies,
      'diets' : diets,
    })
  };
  try{
    const response = await fetch(`http://localhost:4000/users/register`, config);
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
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "a391c51a20ac4e878b52c3778f616389";


  // TODO: assume no error here
  const response = await fetch(
    `${baseURL}/recipes/random?apiKey=${apiKEY}&limitLicense=true&tags=${tag}&number=3&includeNutrition=true`
  );
  const data: IApiFoodRecipeData = await response.json();
  return data;
}

export async function getFoodRecipeByIngredients(
  tag: string
) {
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "a391c51a20ac4e878b52c3778f616389";

  // TODO: assume no error here
  const response = await fetch(
    `${baseURL}/recipes/complexSearch?includeIngredients=${tag}&number=3&instructionsRequired=true&addRecipeInformation=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&apiKey=${apiKEY}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

export async function getRecipeById(id: number): Promise<undefined | IApiFoodRecipeData> {
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "a391c51a20ac4e878b52c3778f616389";

  try {
    const response = await fetch(`${baseURL}/recipes/${id}/information?apiKey=${apiKEY}`);
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
    const baseURL = "https://www.thecocktaildb.com";
    const apiKEY = "1";
  
    // TODO: assume no error here
    const response = await fetch(
      `${baseURL}/api/json/v1/${apiKEY}/filter.php?i=${tag}`
    );
    const data: IApiDrinkIdData = await response.json();

    if (data?.drinks) {
      data.drinks = data.drinks.sort(() => Math.random() - 0.5);
    }
  
    return data;
  }

  export async function searchCocktailById(id: string): Promise<undefined | IApiDrinkIdData> {
    const baseURL = "https://www.thecocktaildb.com";
    const apiKEY = "1";

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



export const openCamera = async (result:any) => {
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

  if (!res.canceled) {
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
      console.log(categ);
      return categ;
    }
  }
};

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
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "9fc2dee7142a457b9faae9e34afc8087";

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

  const config = {
    method : 'GET',
    headers : {
      'Content-Type': 'application/json'
    }
  };
  try{
    const response = await fetch(`http://localhost:4000/users/${id}`, config);
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
  try{
    const response = await fetch(`http://localhost:4000/users/${id}`, config);
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

export async function updateFavoriteFoods(id:any, newFavFoods:any
) {
    try {
        const response = await fetch(`http://localhost:4000/users/${id}`, {
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

export async function updateFavoriteDrinks(id:any, newFavDrinks:any) {
    try {
        const response = await fetch(`http://localhost:4000/users/${id}`, {
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

export function getIngredientImage(name: string){
  const url = "https://img.spoonacular.com/ingredients_100x100/" + name;
  // console.log(url);
  return url;
}

export async function getRecipeDetails(id: string) {
  const baseURL = "https://www.thecocktaildb.com";
    const apiKEY = "1";
  
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
  try {
      const updateResponse = await fetch(`http://localhost:4000/users/${id}`, {
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


