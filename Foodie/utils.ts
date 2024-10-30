import {Buffer} from 'buffer';

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
      const mimeType = 'image/png';
      const uri = `data:${mimeType};base64,${b64}`;
      return uri;
    }
   
  }
