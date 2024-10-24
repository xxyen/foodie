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
