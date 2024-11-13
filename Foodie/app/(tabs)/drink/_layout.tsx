import { Stack } from "expo-router";

export default function DrinkTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Drink",
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          // headerShown: false,
          title: "Recipe Detail",
        }}
      />
    </Stack>
  );
}
