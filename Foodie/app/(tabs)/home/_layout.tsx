import { Stack, useRouter  } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FoodTabLayout() {

  const router = useRouter();
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
              options={({ navigation, route }) => {
                return {
                  headerShown: true,
                  title: "Recipe Detail",
                  headerTintColor: "#007AFF",
                  headerBackTitle: route.params?.fromSearch ? "Search" : "Food",
                  headerBackTitleVisible: true,
                  headerStyle: { backgroundColor: "#ffffff" },
                  headerLeft: () => (
                    <Pressable
                      style={styles.backButton}
                      onPress={() => {
                        if (route.params?.fromSearch) {
                          router.push("/search/search-details");
                        } else {
                           navigation.goBack();
                        }
                      }}
                    >
                      <Text style={styles.backButtonText}>
                        {route.params?.fromSearch ? "Search" : "Food"}
                      </Text>
                    </Pressable>
                  ),
                };
              }}
            />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 18,
    marginLeft: 5,
  },
});
