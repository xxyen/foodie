import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  GestureResponderEvent,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AllergyFood from "./FoodTag";

export default function AllergyScreen({ }) {

  const allergyFoods:string[] = ['Dairy🥛','Peanut🥜','Soy🫘','Seafood🦞','Egg🥚','Gluten🌾',
    'Sesame🧂','Tree Nut🌰','Grain🍚','Shellfish🐚','Wheat🍞','Sulfite🪨'
  ];

  const { username, email,password } = useLocalSearchParams();
  const [statues, setStatues] = useState<boolean[]>(Array(allergyFoods.length).fill(false));


  const img_path = "../../assets/dinner.png";

  function onPressNext(event: GestureResponderEvent): void {
    const choices = allergyFoods.filter((f:string,index:number)=>statues[index]===true);
    
    router.push({
      pathname:"signup/diet",
      params:{
        email:email,
        username:username,
        password:password,
        allergies:choices,
      },
    });
  }

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.title}>Before we start</Text>
          <Text style={styles.text}>We'd like to know more about you...</Text>
        </View>
        <Image source={require(img_path)} style={styles.img} />

        <View style={styles.container_tag}>
          <Text style={styles.title2}>Any Allergy...?</Text>
          <SafeAreaView style={styles.container_tag_row}>
          {allergyFoods.map((f:string,index:number)=> <AllergyFood key={index} food={f} index={index} statues={statues} onChangeStatus={setStatues}/>)}
          </SafeAreaView>
        </View>

        <Pressable style={styles.btn} onPress={onPressNext}>
          <Text style={styles.btn_text}>Next</Text>
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
    paddingVertical: 20,
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
    marginBottom: 5
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
    width: 90,
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
  // container_tag_row:{
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   justifyContent: "flex-start",
  //   width: "90%",
  //   flexWrap: "wrap",
  // },
});
