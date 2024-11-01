import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import { Blob } from "buffer";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { classifyImage } from "@/utils";
import ReactNativeBlobUtil from "react-native-blob-util";
import {decode, encode} from 'base-64';
import axios from "axios";

export default function Tab() {
  // variables
  const img = "../../assets/img_search.png";

  // functions
  function onChangeSearchText(text: string): void {
    throw new Error("Function not implemented.");
  }

  function onPressSearchByImage(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
    pickImage();
  }

  // states
  const [isSelected, setIsSelected] = useState<number | undefined>(undefined);

  function changeTag(tag: string): void {
    throw new Error("Function not implemented.");
  }

  const pickImage = async () => {
    //Reference: https://gist.github.com/Balaagha/9b080d984d5b99e916293d24b4dfa01e
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
    });

    console.log(result);

    if (!result.canceled) {
      let newFile = {
        uri:result.assets[0].uri,
        type:`test/${result.assets[0].uri.split(".")[1]}`,
        name:`test.${result.assets[0].uri.split(".")[1]}`};
      const url = await handleUpload(newFile);
      const categ = await classifyImage(url);
      console.log(categ);
    }
  };

 const handleUpload = async (image:any)=>{
    const data = new FormData(); 
    data.append('file',image);  
    data.append('upload_preset','unsigned_preset');
    data.append('cloud_name','dg2ht2fvn'); 
    try{
      const res = await fetch("https://api.cloudinary.com/v1_1/dg2ht2fvn/image/upload",{  method:'post',body:data})
      const json = await res.json()
      return json.secure_url;
    }
    catch(err){
      console.log(err)
    }
  }


  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.title}>Search</Text>
        </View>
        <TextInput
          style={styles.search_input}
          onChangeText={onChangeSearchText}
          placeholder="What would you like to eat today?"
          placeholderTextColor="rgba(128,128,128, 0.9)"
        />
        <View style={styles.container_header}>
          <Text style={styles.title2}>Search By Image</Text>
        </View>
        <View style={styles.img_search_wrapper}>
          <Pressable
            style={styles.img_search_icon_bkg}
            onPress={onPressSearchByImage}
          >
            <Image
              source={require(img)}
              style={styles.img_search_icon}
              resizeMode="cover"
            />
          </Pressable>
        </View>
        <View style={styles.container_header}>
          <Text style={styles.title2}>Search By Type</Text>
        </View>
        <View style={styles.img_search_wrapper}>
          <View style={styles.container_tag}>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("American")}>
                <Text style={styles.tag_text}>American🇺🇸</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Asain")}>
                <Text style={styles.tag_text}>Asain🏮</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Latin American")}>
                <Text style={styles.tag_text}>Latin American🌮</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("Gluten Free")}>
                <Text style={styles.tag_text}>Gluten Free🌾</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Vegetarian")}>
                <Text style={styles.tag_text}>Vegetarian🌱</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Vegan")}>
                <Text style={styles.tag_text}>Vegan🌿</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("appetizer")}>
                <Text style={styles.tag_text}>Appetizer🫒</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("main course")}>
                <Text style={styles.tag_text}>Main Course🍽️</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("salad")}>
                <Text style={styles.tag_text}>Salad🥗</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable style={styles.tag} onPress={() => changeTag("dessert")}>
                <Text style={styles.tag_text}>Dessert🍮</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("drink")}>
                <Text style={styles.tag_text}>Drink🍷</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
    gap: 10,
  },
  container_header: {
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
  },
  container_tag: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    height: "90%",
    gap: 10
  },
  container_tag_row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  search_input: {
    height: 60,
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  img_search_wrapper: {
    height: "30%",
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  img_search_icon_bkg: {
    height: "85%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  img_search_icon: {
    height: 96,
    width: 96,
  },
  tag: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40
  },
  tag_text: {
    fontSize: 13,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
});
