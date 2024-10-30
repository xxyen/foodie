import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import { useAppContext } from "@/context/contexts";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { getProfile, parseImage } from "@/utils";

export default function Tab() {
  const { username, id } = useAppContext();
  const router = useRouter();

  // variables
  const img_path = "../../assets/peanut.png";
  const img_path1 = "../../assets/smile.png";
  const window_width = Dimensions.get('window').width;
  const window_height = Dimensions.get('window').height;

  // intake demo data
  const barData = [
    { value: 800, label: "Mon"},
    { value: 1300, label: "Tue"},
    { value: 1300, label: "Wed"},
    { value: 400, label: "Thu"},
    { value: 1200, label: "Fri"},
    { value: 1800, label: "Sat"},
    { value: 1300, label: "Sun"},
  ];

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
          <View style={styles.intake}>
            <View style={{justifyContent: "flex-start"}}>
              <Text style={styles.title}>Calorie intake</Text>
            </View>
            
            <View>
              <BarChart
                  barWidth={10}
                  noOfSections={1}
                  barBorderRadius={4}
                  frontColor="lightgray"
                  data={barData}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  height={window_height * 0.05}
                  width={window_width * 0.8}
                  spacing={window_width * 0.08}
                  initialSpacing={10}
                  hideAxesAndRules
                  isAnimated
              />
            </View>
            
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
          <Text style={styles.title}>
            Login or sign up to track your favorites and daily intake!
          </Text>
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
  title_name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  title_intake: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "left"
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
    gap: 15,
    alignItems: "center",
  },
  intake: {
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    height: "20%",
    width: "90%",
    padding: 20,
    gap: 15,
    alignItems: "center",
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
    borderWidth: 1,
  },
  btn_signup_text: {
    color: "#042628",
    fontSize: 16,
    fontWeight: "bold",
  },
  bar_wrapper: {
    width: "100%"
  }
});
