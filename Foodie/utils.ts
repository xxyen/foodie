import {Buffer} from 'buffer';
import { Alert } from 'react-native';

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
      }
    }catch(err){
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      }
    }
  }

  function base64ToBinary(base64 : any) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
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
