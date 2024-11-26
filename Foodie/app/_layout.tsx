import { ContextProvider} from "@/context/contexts";
import { CodeContextProvider } from "@/context/codeContexts";
import { Stack } from "expo-router/stack";

export default function DrawerLayout() {
  return (
    <ContextProvider>
      <CodeContextProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen 
            name="welcome" 
            options={{ headerShown: false}} />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="signup"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="forget"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="newPassword"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack>
      </CodeContextProvider>
    </ContextProvider>

  );
}
