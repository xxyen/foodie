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
  Platform,
  ScrollView
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAppContext } from "@/context/contexts";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { getProfile, parseImage, getFoodIngredientImage, getIngredientImage, changeAllergies } from "@/utils";
import PickerModal from "@/Components/PickerModal";
import FoodTag from "@/app/signup/FoodTag";
import ExtraAllergies from "./ExtraAllergies";

export default function Tab() {
  const {
    username,
    id,
    icon,
    allergies,
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
  const img_path = "../../../assets/peanut.png";
  const img_path1 = "../../../assets/smile.png";
  const baseUrl = Platform.OS === "android"
  ? "http://10.0.2.2:4000"
  : "http://localhost:4000"
  const window_width = Dimensions.get("window").width;
  const window_height = Dimensions.get("window").height;

  // state
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
  const [ingredientImages, setIngredientImages] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [statues, setStatues] = useState<boolean[]>(Array(allergies.length).fill(false));
  const [allergyModal, setAllergyModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        const userData = await getProfile(id);
        if (userData) {
          setUserInfo(userData);

          if (userInfo?.ingredients && userInfo.ingredients.length > 0) {
              const imagePromises = userInfo.ingredients.slice(0, 3).map(async (ingredient) => {
                const imageUrl = await getIngredientImage(ingredient);
                return imageUrl;
              });
              const images = await Promise.all(imagePromises);
              console.log(images);
              setIngredientImages(images);
            } else {
              setIngredientImages([]); 
            }
        }
      }
    };
    fetchUserData();
  }, [id]); 

  useEffect(()=>{
    setStatues(Array(allergies.length).fill(false));
  },[allergies])

  // useEffect(() => {
  //   const fetchIngredientImages = async () => {
  //     if (userInfo?.ingredients && userInfo.ingredients.length > 0) {
  //       const imagePromises = userInfo.ingredients.slice(0, 3).map(async (ingredient) => {
  //         const imageUrl = await getIngredientImage(ingredient);
  //         return imageUrl;
  //       });
  //       const images = await Promise.all(imagePromises);
  //       setIngredientImages(images);
  //     } else {
  //       setIngredientImages([]); 
  //     }
  //   };
  //   fetchIngredientImages();
  // }, [id]);
  
  const barData = userInfo?.weeklyCalories.map((calories, index) => ({
    value: calories,
    label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index],
  })) || [];

  // functions
  async function onPressLoginOut(event: GestureResponderEvent): Promise<void> {
    if (userInfo?.googleId) {
      try {
        const response = await Linking.openURL(
          `http://localhost:4000/api/logout`
        );
      } catch (err) {
        console.log(err);
      }
    }

    logout();
    setUserInfo(undefined);
  }
  
  function onPressUpdateIcon(event: GestureResponderEvent): void{
    setModal(true);
  }

  async function onPressRemoveAllergy(event: GestureResponderEvent): Promise<void>{
    const chosen = allergies.filter((a,index)=>statues[index]===false);
    await changeAllergies(id,chosen);
    onChangeAllergies(chosen);
    setStatues(Array(chosen.length).fill(false));
  }

  async function onPressAddAllergy(event: GestureResponderEvent): Promise<void>{
    setAllergyModal((visible)=>!visible);
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
          <Pressable onPress={onPressUpdateIcon} >
            <Image
              source={{ uri: parseImage(icon) }}
              style={styles.avatar}
              resizeMode="contain"
            />
            <FontAwesome name={"plus-square"} size={15} color={"black"} 
            style={{gap:0, margin:0, paddingHorizontal:35}}/>
          </Pressable>
          <Text style={styles.title}>{userInfo?.username}</Text>
          {modal && (
            <PickerModal visible={modal} onChangeVisible={setModal} action={2}/>
          )}
          <Pressable
            style={styles.shopping_list}
            onPress={() => router.push("profile/shopping-list")}
          >
            <Text style={styles.title}>My Shopping List</Text>
            <View style={styles.container_row}>
            {/* {ingredientImages.length > 0 ? (
              ingredientImages.map((img, index) => (
                img ? (
                  <Image key={index} source={{ uri: img }} style={styles.img} resizeMode="contain" />
                ) : (
                  <Text key={index}>Image not available</Text>
                )
              ))
            ) : (
              <Text>No ingredients in shopping list</Text>
            )} */}
            {
              ingredientImages.map((img, index) => (
                img ? (
                  <Image key={index} source={{ uri: img }} style={styles.img} resizeMode="contain" />
                ) : (
                  <Text key={index}>Image not available</Text>
                )
              ))
}
          </View>

            <View style={styles.more}>
              <Text>➕</Text>
            </View>
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
            <View style={styles.container_row}>
              <Pressable onPress={onPressRemoveAllergy}>
                <FontAwesome name="minus" size={15} color={"blue"}/>
              </Pressable>
              <Text style={styles.title}>My Food Allergies</Text>
              <Pressable onPress={onPressAddAllergy}>
                <FontAwesome name="plus" size={15} color={"red"}/>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.container_tag_row}>
              {allergies.map((a:string, index:number)=> <FoodTag key={index} food={a} index={index} statues={statues} onChangeStatus={setStatues}/>)}
            </ScrollView>
            {allergyModal && (
              <ExtraAllergies visible={allergyModal} onChangeVisible={setAllergyModal}/>
            )}
            {/* <View style={styles.container_row}>
              <Image
                source={require(img_path)}
                style={styles.img}
                resizeMode="contain"
              />
            </View> */}
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
    justifyContent: "space-around",
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
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    gap: 10,
    flexWrap: "wrap",
  },
});
