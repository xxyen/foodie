import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { useAppContext } from "@/context/contexts";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
} from "react-native-chart-kit";
import { getProfile, parseImage } from "@/utils";

export default function Tab() {
  const { username, id } = useAppContext();
  const router = useRouter();

  // variables
  const img_path = "../../assets/peanut.png";
  const img_path1 = "../../assets/smile.png";

  // intake demo data
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        // color: (opacity = 1) => `rgba(2, 65, 244, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#D9D9D9",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#D9D9D9",
    color: (opacity = 1) => `rgba(217, 217, 217, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // state
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);

  // Render
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const userData = await getProfile(id);
        if (userData) {
          setUserInfo(userData);
        }
      }
    };
    fetchData();
  }, [userInfo]);

  // functions
  function onPressLoginOut(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  function onPressLogin(event: GestureResponderEvent): void {
    console.log("user: press login btn");
    router.push("/login");
  }

  function onPressSignUp(event: GestureResponderEvent): void {
    console.log("user: press sign up btn");
    router.push("/signup");
  }

  return (
    <SafeAreaView style={styles.safearea}>
      {id ? (
        <View style={styles.container}>
          <Image
            source={{ uri: parseImage(userInfo?.icon) }}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.title}>{userInfo?.username}</Text>
          <View style={styles.shopping_list}>
            <Text style={styles.title}>My Shopping List</Text>
            <View style={styles.container_row}></View>
          </View>
          <View style={styles.shopping_list}>
            <Text style={styles.title}>Calorie intake</Text>
            <LineChart
              data={data}
              width={300}
              height={100}
              chartConfig={chartConfig}
            />
          </View>
          <View style={styles.shopping_list}>
            <Text style={styles.title}>My Food allergies</Text>
            <View style={styles.container_row}>
              <Image
                source={require(img_path)}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable style={styles.btn_logout} onPress={onPressLoginOut}>
            <Text style={styles.btn_text}>Log Out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            source={require(img_path1)}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.title}>Login or sign up to track your favorites and daily intake!</Text>
          <Pressable style={styles.btn_login} onPress={onPressLogin}>
            <Text style={styles.btn_login_text}>Login</Text>
          </Pressable>
          <Pressable style={styles.btn_signup} onPress={onPressSignUp}>
            <Text style={styles.btn_signup_text}>Sign Up</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  container_row: {
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  shopping_list: {
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    height: "20%",
    width: "90%",
    padding: 20,
  },
  btn_logout: {
    height: 55,
    width: "90%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  btn_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  btn_login: {
    height: 55,
    width: "80%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_login_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  btn_signup: {
    height: 55,
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1
  },
  btn_signup_text: {
    color: "#042628",
    fontSize: 16,
    fontWeight: "bold",
  },
});
