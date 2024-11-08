import { Stack } from "expo-router";

export default function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="diet"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="allergy"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
