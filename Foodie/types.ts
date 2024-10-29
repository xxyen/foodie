interface IApiDrinkIdData {
  drinks: {
    strDrink: string; 
    strDrinkThumb: string; 
    idDrink: string; 
  }[];
}
interface IApiFoodRecipeData {
  recipes: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    cheap: boolean;
    veryPopular: boolean;
    sustainable: boolean;
    lowFodmap: boolean;
    weightWatcherSmartPoints: number;
    gaps: string;
    preparationMinutes: number | null;
    cookingMinutes: number | null;
    aggregateLikes: number;
    healthScore: number;
    creditsText: string;
    sourceName: string;
    pricePerServing: number;
    extendedIngredients: {
      id: number;
      aisle: string;
      image: string;
      consistency: string;
      name: string;
      nameClean: string;
      original: string;
      originalName: string;
      amount: number;
      unit: string;
      meta: string[];
      measures: {
        us: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
        metric: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
      };
    }[];
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
    image: string;
    imageType: string;
    summary: string;
    cuisines: string[];
    dishTypes: string[];
    diets: string[];
    occasions: string[];
    instructions: string;
    analyzedInstructions: {
      name: string;
      steps: {
        number: number;
        step: string;
        ingredients: {
          id: number;
          name: string;
          image: string;
        }[];
        equipment: {
          id: number;
          name: string;
          localizedName: string;
          image: string;
          temperature?: {
            number: number;
            unit: string;
          };
        }[];
        length?: {
          number: number;
          unit: string;
        };
      }[];
    }[];
    spoonacularScore: number;
    spoonacularSourceUrl: string;
  }[];
}
interface IUserInfo{
  id: string,
  username: string,
  email: string,
  allergies: string[],
  favFoods: number[],
  favDrinks: number[],
  weeklyCalories: number[],
  ingredients: string[],
  icon: Buffer
}
interface IAppContextType{
  username: string|undefined;
  email: string|undefined;
  id: string|undefined;
  allergies: string[];
  favFoods: number[];
  favDrinks: number[];
  weeklyCalories: number[];
  ingredients: string[];
  icon: Buffer|undefined;
  onChangeUsername: (username: string) => void;
  onChangeEmail: (email:string) =>void;
  onChangeId: (id: string|undefined) =>void;
  onChangeAllergies: (allergies: string[]) => void;
  onChangeFavFoods: (favFoods: number[]) => void;
  onChangeFavDrinks: (favDrinks: number[]) => void;
  onChangeWeeklyCalories: (weeklyCalories: number[]) => void;
  onChangeIngredients: (ingredients: string[]) => void;
  onChangeBuffer: (icon:Buffer|undefined) => void;
}