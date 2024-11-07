import { ContextProvider} from "@/context/contexts";
import { Stack } from "expo-router/stack";

export default function DrawerLayout() {
  return (
    <ContextProvider>
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="welcome" 
        options={{ headerShown: false, presentation: "modal"}} />
      <Stack.Screen
        name="login"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
    </ContextProvider>

  );
}
