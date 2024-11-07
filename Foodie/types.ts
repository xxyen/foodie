interface IApiDrinkIdData {
  drinks: {
    strDrink: string;
    strDrinkThumb: string;
    idDrink: string;
  }[];
}
interface IApiFoodRecipeData {
  recipes: IFoodRecipe[];
}

interface IFoodRecipe {
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
  preparationMinutes?: number | null;
  cookingMinutes?: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: IFoodIngredient[];
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  nutrition: INutrition;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions: string;
  analyzedInstructions: {
    name: string;
    steps: IFoodStep[];
  }[];
  originalId?: number | null;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}
interface INutrition {
  nutrients: Nutrient[];
  properties: Property[];
  flavonoids: Flavonoid[];
  ingredients: Ingredient[];
  caloricBreakdown: CaloricBreakdown;
  weightPerServing: WeightPerServing;
}

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface Property {
  name: string;
  amount: number;
  unit: string;
}

interface Flavonoid {
  name: string;
  amount: number;
  unit: string;
}

interface IngredientNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: IngredientNutrient[];
}

interface CaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

interface WeightPerServing {
  amount: number;
  unit: string;
}
interface IFoodStep {
  number: number;
  step: string;
  ingredients: {
    id: number;
    name: string;
    localizedName: string;
    image: string;
  }[];
  equipment: {
    id: number;
    name: string;
    localizedName: string;
    image: string;
  }[];
  length?: {
    number: number;
    unit: string;
  };
}
interface IFoodIngredient {
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
}
interface IUserInfo {
  id: string;
  googleId: string;
  username: string;
  email: string;
  allergies: string[];
  favFoods: number[];
  favDrinks: number[];
  weeklyCalories: number[];
  ingredients: string[];
  icon: Buffer;
}
interface IAppContextType {
  username: string | undefined;
  email: string | undefined;
  id: string | undefined;
  allergies: string[];
  favFoods: number[];
  favDrinks: number[];
  weeklyCalories: number[];
  ingredients: string[];
  icon: Buffer | undefined;
  onChangeUsername: (username: string | undefined) => void;
  onChangeEmail: (email: string | undefined) => void;
  onChangeId: (id: string | undefined) => void;
  onChangeAllergies: (allergies: string[]) => void;
  onChangeFavFoods: (favFoods: number[]) => void;
  onChangeFavDrinks: (favDrinks: number[]) => void;
  onChangeWeeklyCalories: (weeklyCalories: number[]) => void;
  onChangeIngredients: (ingredients: string[]) => void;
  onChangeBuffer: (icon: Buffer | undefined) => void;
}
