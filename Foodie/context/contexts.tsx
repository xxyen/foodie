import { createContext } from "react";
import { useContext, useState } from "react";


const AppContext = createContext<IAppContextType|undefined>(undefined);

export const ContextProvider = ({ children }: { children: any }) => {
    const [email, setEmail] = useState<string|undefined>(undefined);
    const [username, setUsername] = useState<string|undefined>(undefined);
    const [id, setId] = useState<string|undefined>(undefined);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [favFoods, setFavFoods] = useState<number[]>([]);
    const [favDrinks, setFavDrinks] = useState<number[]>([]);
    const [weeklyCalories, setCalories] = useState<number[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [icon, setIcon] = useState<Buffer|undefined>(undefined);


    const value = {
        username:username,
        email:email,
        id: id,
        allergies:allergies,
        favFoods:favFoods,
        favDrinks:favDrinks,
        weeklyCalories:weeklyCalories,
        ingredients:ingredients,
        icon:icon,
        onChangeUsername: setUsername,
        onChangeEmail: setEmail,
        onChangeAllergies: setAllergies,
        onChangeFavFoods: setFavFoods,
        onChangeFavDrinks: setFavDrinks,
        onChangeWeeklyCalories: setCalories,
        onChangeIngredients: setIngredients,
        onChangeBuffer: setIcon,
        onChangeId: setId
    };
  
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  };
  
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext must be used within an Provider');
    }
    return context;
};
