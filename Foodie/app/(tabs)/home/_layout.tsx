import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Food",
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          headerShown: false,
          title: "Recipe Detail",
        }}
      />
    </Stack>
  );
}
