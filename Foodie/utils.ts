import {Buffer} from 'buffer';
import { Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from 'react';

export async function getRandomFoodRecipe(
  tag: string
): Promise<undefined | IApiFoodRecipeData> {
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "5764fe09cc624a12adee3886b3226a29";

  // TODO: assume no error here
  const response = await fetch(
    `${baseURL}/recipes/random?apiKey=${apiKEY}&limitLicense=true&tags=${tag}&number=3`
  );
  const data: IApiFoodRecipeData = await response.json();
  return data;
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

    // TODO: Random choose 4 drink if data has more than 4drinks

    return data;
  }

export const pickImage = async () => {
  //Reference: https://gist.github.com/Balaagha/9b080d984d5b99e916293d24b4dfa01e
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0,
  });

  console.log(result);

  if (!result.canceled) {
    let newFile = {
      uri:result.assets[0].uri,
      type:`test/${result.assets[0].uri.split(".")[1]}`,
      name:`test.${result.assets[0].uri.split(".")[1]}`};
    const url = await handleUpload(newFile);
    const categ = await classifyImage(url);
    console.log(categ);
  }
};

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
  });

  if (!res.canceled) {
    const { assets } = res;
    if (assets && assets.length > 0) {
      let newFile = {
        uri:res.assets[0].uri,
        type:`test/${res.assets[0].uri.split(".")[1]}`,
        name:`test.${res.assets[0].uri.split(".")[1]}`};
      const url = await handleUpload(newFile);
      const categ = await classifyImage(url);
      console.log(categ);
    }
  }
};



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