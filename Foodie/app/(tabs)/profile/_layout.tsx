import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
      
      <Stack.Screen
        name="shopping-list"
        options={{
          title: "Shopping List",
        }}
      />

    </Stack>
  );
}
