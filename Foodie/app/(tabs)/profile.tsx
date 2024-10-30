import { View, Text, StyleSheet, SafeAreaView, Image, Pressable, GestureResponderEvent } from "react-native";
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
  const img_path = "../../assets/18.png";
  const img_path1 = "../../assets/burger.png";
  const img_path2 = "../../assets/rasberry.png";
  const img_path3 = "../../assets/peanut.png";

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

  function onPressLoginOut(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  // functions

  return (
    <SafeAreaView style={styles.safearea}>
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
              source={require(img_path3)}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
        </View>
        <Pressable style={styles.btn} onPress={onPressLoginOut}>
            <Text style={styles.btn_text}>Log Out</Text>
          </Pressable>
      </View>
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
  btn: {
    height: 55,
    width: "90%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  btn_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
