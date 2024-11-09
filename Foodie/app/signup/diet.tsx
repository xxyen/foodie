import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  GestureResponderEvent,
  Alert
} from "react-native";
import FoodTag from "./FoodTag";
import { useState } from "react";
import { registerHelper } from "@/utils";
import { useAppContext } from "@/context/contexts";

export default function AllergyScreen() {

  function onPressLater(event: GestureResponderEvent): void {
    router.push("home");
  }

  const { username, email,password,allergies } = useLocalSearchParams();
  const {onChangeId} = useAppContext();

  const img_path = "../../assets/chief.png";
  const diets:string[] = ['Ketogenic🥑','Vegetarian🌱','Lacto-Vegetarian🌿','Ovo-Vegetarian🥦',
    'Vegan🥒','Gluten Free🌾','Paleo🥩','Primal🥛','Low FODMAP🍞','Whole30🥚' ];


  const [statues, setStatues] = useState<boolean[]>(Array(diets.length).fill(false));
  
  async function onPressNext(event: GestureResponderEvent): Promise<void> {
    const diet = diets.filter((f:string,index:number)=>statues[index]===true);
    console.log(diet);

    const allergiesArray = typeof allergies==='string' ? allergies.split(',') : [];

    router.push({
      pathname:"signup/diet",
      params:{
        email:email,
        username:username,
        password:password,
        allergies: allergiesArray,
        diets:diet,
      },
    });
    console.log(allergies);
    if(typeof username === "string" && typeof email==='string' 
      && typeof password==='string' && Array.isArray(allergiesArray)){
        const res = await registerHelper(username,email,password,allergiesArray,onChangeId);
        if (res) {
          router.dismissAll();
          router.push("/home");
          Alert.alert("Congratulate!",username+", you have resgistered successfully."); 
        }
      }
    router.dismissAll();
    router.push("home");
  }

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safearea}>
      <Pressable onPress={onPressLater}>
        <Text style={styles.later}>Later</Text>
      </Pressable>
      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.title}>Before we start</Text>
          <Text style={styles.text}>We'd like to know more about you...</Text>
        </View>
        <Image source={require(img_path)} style={styles.img} />

        <View style={styles.container_tag}>
          <Text style={styles.title2}>Any Diet...?</Text>
          <View style={styles.container_tag_row}>
          
            {diets.map((f:string,index:number)=> <FoodTag key={index} food={f} index={index} statues={statues} onChangeStatus={setStatues}/>)}
          </View>
        </View>

        <Pressable style={styles.btn} onPress={onPressNext}>
          <Text style={styles.btn_text}>Finish</Text>
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
    alignItems: "flex-start",
    margin: 30,
    gap: 40,
  },
  container_header: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  container_tag: {
    width: "100%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
  },
  container_tag_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    gap: 10,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 31,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  title_welcome: {
    fontSize: 25,
  },
  img: {
    height: "30%",
    width: "100%",
    borderRadius: 20,
  },
  later: {
    color: "#042628",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: "10%",
    marginTop: "15%",
  },
  tag: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40,
  },
  tag_text: {
    fontSize: 14,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
  btn: {
    height: 55,
    width: "100%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
