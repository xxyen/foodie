import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  GestureResponderEvent,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAppContext } from "@/context/contexts";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import {
  getProfile,
  parseImage,
  changeAllergies,
} from "@/utils";
import PickerModal from "@/Components/PickerModal";
import FoodTag from "@/app/signup/FoodTag";
import ExtraAllergies from "./ExtraAllergies";
import AsyncStorage from '@react-native-async-storage/async-storage';
import StaticFoodTag from "@/Components/StaticFoodTag";


export default function Tab() {
  const {
    id,
    icon,
    allergies,
    ingredients,
    weeklyCalories,
    onChangeUsername,
    onChangeEmail,
    onChangeAllergies,
    onChangeFavFoods,
    onChangeFavDrinks,
    onChangeWeeklyCalories,
    onChangeIngredients,
    onChangeBuffer,
    onChangeId,
  } = useAppContext();
  const router = useRouter();

  // variables
  const img_path1 = "../../../assets/smile.png";
  const window_width = Dimensions.get("window").width;
  const window_height = Dimensions.get("window").height;

  // state
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
  const [modal, setModal] = useState(false);
  // const [statues, setStatues] = useState<boolean[]>(
  //   Array(allergies.length).fill(false)
  // );
  // const [shoppingStatues, setShoppingStatues] = useState<boolean[]>(
  //   Array(ingredients.length).fill(false)
  // );
  const [allergyModal, setAllergyModal] = useState(false);
  const [barData, setBarData] = useState<
    { value: number; label: string; topLabelComponent: () => JSX.Element }[]
  >([]);

  useEffect(() => {
    const generateBarData = () => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const currentDayIndex = today.getDay();

      const last7DaysLabels = Array(7)
        .fill(0)
        .map((_, index) => daysOfWeek[(currentDayIndex - (6 - index) + 7) % 7]);

      const data = last7DaysLabels.map((label, index) => ({
        value: weeklyCalories[(currentDayIndex - (6 - index) + 7) % 7] ?? 0,
        label,
        topLabelComponent: () => (
          <Text>{weeklyCalories[(currentDayIndex - (6 - index) + 7) % 7]}</Text>
        ),
      }));
      return data;
    };

    const fetchUserData = async () => {
      if (id) {
        const userData = await getProfile(id);
        if (userData) {
          setUserInfo(userData);

          setTimeout(() => {
            setBarData(generateBarData());
          }, 50);
        }
      }
    };

    fetchUserData();
  }, [id, ingredients, weeklyCalories]);

  // useEffect(() => {
  //   setStatues(Array(allergies.length).fill(false));
  // }, [allergies]);

  // useEffect(() => {
  //   setShoppingStatues(Array(ingredients.length).fill(false));
  // }, [ingredients]);

  // functions
  async function clearMessages() {
    try {
      await AsyncStorage.removeItem("CHAT_MESSAGES");
      console.log("Messages cleared.");
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  }

  async function onPressLoginOut(event: GestureResponderEvent): Promise<void> {
    if (userInfo?.googleId) {
      try {
        const response = await Linking.openURL(
          `https://foodie.zeus.wang/api/logout`
        );
      } catch (err) {
        console.log(err);
      }
    }

    await clearMessages();
    logout();
    setUserInfo(undefined);
  }

  function onPressUpdateIcon(event: GestureResponderEvent): void {
    setModal(true);
  }

  // async function onPressRemoveAllergy(
  //   event: GestureResponderEvent
  // ): Promise<void> {
  //   const chosen = allergies.filter((a, index) => statues[index] === false);
  //   await changeAllergies(id, chosen);
  //   onChangeAllergies(chosen);
  //   setStatues(Array(chosen.length).fill(false));
  // }

  async function onPressAddAllergy(
    event: GestureResponderEvent
  ): Promise<void> {
    setAllergyModal((visible) => !visible);
  }

  function onPressLogin(event: GestureResponderEvent): void {
    console.log("user: press login btn");
    router.push("/login");
  }

  function onPressSignUp(event: GestureResponderEvent): void {
    console.log("user: press sign up btn");
    router.push("/signup");
  }

  const logout = () => {
    onChangeUsername(undefined);
    onChangeEmail(undefined);
    onChangeAllergies([]);
    onChangeFavFoods([]);
    onChangeFavDrinks([]);
    onChangeWeeklyCalories([]);
    onChangeIngredients([]);
    onChangeBuffer(undefined);
    onChangeId(undefined);
  };

  return (
    <SafeAreaView style={styles.safearea}>
      {id ? (
        <View style={styles.container}>
          <Pressable onPress={onPressUpdateIcon}>
            <Image
              source={{ uri: parseImage(icon) }}
              style={styles.avatar}
              resizeMode="contain"
            />
            <FontAwesome
              name={"plus-square"}
              size={15}
              color={"black"}
              style={{ gap: 0, margin: 0, paddingHorizontal: 35 }}
            />
          </Pressable>
          <Text style={styles.title}>{userInfo?.username}</Text>
          {modal && (
            <PickerModal
              visible={modal}
              onChangeVisible={setModal}
              action={2}
            />
          )}
          <Pressable
            style={styles.shopping_list}
            onPress={() => router.push("profile/shopping-list")}
          >
            <Text style={styles.title}>My Shopping List</Text>
            <ScrollView contentContainerStyle={styles.container_tag_row}>
              {userInfo?.ingredients.map((a: string, index: number) => (
              //    <StaticFoodTag
              //    key={index}
              //    food={a.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              //  />
              <FoodTag
                  key={index}
                  food={a.split(" ") .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  index={index}
                  statues={[]}
                  onChangeStatus={() => {}}
                />

              ))}
            </ScrollView>

          </Pressable>
          <View style={styles.intake}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={styles.title}>Calorie Intake</Text>
            </View>

            <View>
              <BarChart
                barWidth={10}
                noOfSections={1}
                barBorderRadius={4}
                frontColor="lightblue"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                height={window_height * 0.05}
                width={window_width * 0.8}
                spacing={window_width * 0.08}
                initialSpacing={10}
                hideAxesAndRules
                isAnimated
                showValuesAsTopLabel
                barMarginBottom={10}
                topLabelTextStyle={{
                  fontSize: 10,
                  width: 25,
                  height: 20,
                  lineHeight: 20,
                  position: "relative",
                  top: 10,
                  textAlign: "center",
                }}
              />
            </View>
          </View>
          <Pressable
            style={styles.shopping_list}
            onPress={() => {
              router.push("profile/allergy-list");
            }}
          >
            <Text style={styles.title}>My Food Allergies</Text>
            <ScrollView contentContainerStyle={styles.container_tag_row}>
              {allergies.map((a: string, index: number) => (
                // <StaticFoodTag key={index} food={a} />
                <FoodTag
                key={index}
                food={a}
                index={index}
                statues={[]}
                onChangeStatus={() => {}}
              />

              ))}
            </ScrollView>
            {allergyModal && (
              <ExtraAllergies
                visible={allergyModal}
                onChangeVisible={setAllergyModal}
              />
            )}
          </Pressable>
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
          <Text style={styles.title_nonlog}>
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
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "90%",
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
  title_nonlog: {
    width: "90%",
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  title_intake: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
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
  shopping_item_container: {
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  shopping_item: {
    fontSize: 16,
    color: "black",
    marginHorizontal: 5,
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
    width: "100%",
  },
  more: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  container_tag_row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
    gap: 10,
    flexWrap: "wrap",
  },
});
