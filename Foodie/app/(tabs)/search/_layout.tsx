import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "search",
        }}
      />
      
      <Stack.Screen
        name="search-details"
        options={{
          title: "Search Details",
        }}
      />

      <Stack.Screen
              name="search-by-text"
              options={{
                title: "Search By Text",
                presentation: "modal",
              }}
            />

    </Stack>
  );
}
