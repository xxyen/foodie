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
      const str8 = Buffer.from(buffer).toString('utf8');
      if(str8.includes('googleusercontent.com')){
        return str8;
      }
      else{
        const mimeType = 'image/png';
        const uri = `data:${mimeType};base64,${b64}`;
        return uri;
      }
    }
   
  }

export async function updateFavoriteFoods(id, newFavFoods) {
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
        console.error("Request error:", error.message);
        alert(error);
    }
}

export async function updateFavoriteDrinks(id, newFavDrinks) {
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
        console.error("Request error:", error.message);
        alert(error);
    }
}

export async function getRecipeDetails(id: number): Promise<IApiFoodRecipeData["recipes"] | undefined> {
  const baseURL = "https://api.spoonacular.com";
  const apiKEY = "af648e0c5ba441cdbb8dcdec0e2b3a1d";

  const response = await fetch(
    `${baseURL}/recipes/${id}/information?includeNutrition=true&apiKey=${apiKEY}`
  );
  if (!response.ok) {
    console.error("Failed to fetch recipe details:", response.statusText);
    return undefined;
  }

  const data: IApiFoodRecipeData["recipes"] = await response.json();
  return data;
}
