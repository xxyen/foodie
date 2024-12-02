import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, useRouter  } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#E1AEC1", headerShown: false, animationEnabled: false,}}>
      <Tabs.Screen
        name="home"
        options={{
          title: "food",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} name="home" color={color} />,
          headerShown: false,
        }}
       listeners={{
              tabPress: (e) => {
                e.preventDefault();
                router.replace("/home", {}, { animation: "none" });
              },
            }}
      />
      <Tabs.Screen
        name="drink"
        options={{
          title: "drink",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} name="glass-cocktail" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} name="magnify-expand" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "favorites",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} name="heart-outline" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} name="account-circle-outline" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
