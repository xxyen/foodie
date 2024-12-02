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
  Modal,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { pickImage, openCamera } from "@/utils";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import PickerModal from "@/Components/PickerModal";

export default function Tab() {
  // variables
  const img = "../../../assets/img_search.png";

  // router
  const router = useRouter();

  // states
  const [isSelected, setIsSelected] = useState<number | undefined>(undefined);
  const [modal, setModal] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [gallery, setGallery] = useState(false);
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // functions
  function onChangeSearchText(text: string): void {
    setSearchText(text);
  }

  const openModal = () => {
      router.push({
        pathname: "/search/search-by-text",
        params: { searchText },
      });
  };

  const closeModal = () => {
    router.back();
  };


  function onPressSearchByImage(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
    setModal(true);
  }

  function changeTag(tag: string): void {
    router.push({
      pathname: "search/search-details",
      params: { pressedTag: tag, type: "byTag" },
    });
  }

  // Search by Image
  const onClickGallery = async () => {
    setLoading(true);

    setGallery(true);
    setCamera(false);
    const tag = await pickImage();

    setLoading(false);

    setModal(false);
    if (tag != undefined) {
      router.push({
        pathname: "search/search-details",
        params: { pressedTag: tag, type: "byIngredient" },
      });
    }
  };

  const onClickCamera = async () => {
    setLoading(true);

    setGallery(false);
    setCamera(true);
    const tag = await openCamera(null);

    setLoading(false);

    setModal(false);
    if (tag != undefined) {
      router.push({
        pathname: "search/search-details",
        params: { pressedTag: tag, type: "byIngredient" },
      });
    }
  };

  const onClose = async () => {
    setModal(false);
  };

  const closeGrantPermission = async () => {
    console.log("Closing...");
    setGallery(false);
    setCamera(false);
  };

  return (
    <SafeAreaView style={styles.safearea}>

      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.title}>Search</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Pressable onPress={openModal} style={styles.search_text_pressable}>
            <Text style={[styles.search_input,{color:"#808080"}]}>What would you like to eat today?</Text>
            {/* <TextInput
              style={styles.search_input}
              onChangeText={onChangeSearchText}
              placeholder="What would you like to eat today?"
              placeholderTextColor="rgba(128,128,128, 0.9)"
              pointerEvents="none"
            /> */}
          </Pressable>
        <View style={styles.container_header}>
          <Text style={styles.title2}>Search By Image</Text>
        </View>
        <View style={styles.img_search_wrapper}>
          {modal && (
            <View style={styles.container}>
              <Modal
                transparent
                visible={modal}
                animationType="slide"
                onRequestClose={onClose}
              >
                <View style={styles.modalBackground}>
                  {loading ? (
                    <ActivityIndicator size="large" />
                  ) : (
                    <View style={styles.innerContainer}>
                      <Button
                        onPress={onClickGallery}
                        title="Choose from Photo Library"
                      />
                      <Button onPress={onClickCamera} title="Take a picture" />
                      <Button onPress={onClose} color={"red"} title="Close" />
                    </View>
                  )}
                </View>
              </Modal>
            </View>
          )}
          {/* {modal && (<PickerModal visible={modal} onChangeVisible={setModal} action={1}/>)} */}
          {camera && permission && !permission?.granted && (
            <View style={styles.modalBackground}>
              <Modal transparent visible={camera && !permission?.granted}>
                <View style={styles.innerContainer}>
                  <Text>We need your permission to show the camera</Text>
                  <Button
                    onPress={requestPermission}
                    title="Grant Permission"
                  />
                  <Button onPress={closeGrantPermission} title="Close"></Button>
                </View>
              </Modal>
            </View>
          )}
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
        <View style={styles.img_search_wrapper_tags}>
          <View style={styles.container_tag}>
            <View style={styles.container_tag_row}>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("American")}
              >
                <Text style={styles.tag_text}>American🇺🇸</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Asian")}>
                <Text style={styles.tag_text}>Asian🏮</Text>
              </Pressable>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("Latin American")}
              >
                <Text style={styles.tag_text}>Latin American🌮</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("Gluten Free")}
              >
                <Text style={styles.tag_text}>Gluten Free🌾</Text>
              </Pressable>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("Vegetarian")}
              >
                <Text style={styles.tag_text}>Vegetarian🌱</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("Vegan")}>
                <Text style={styles.tag_text}>Vegan🌿</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("appetizer")}
              >
                <Text style={styles.tag_text}>Appetizer🫒</Text>
              </Pressable>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("main course")}
              >
                <Text style={styles.tag_text}>Main Course🍽️</Text>
              </Pressable>
              <Pressable style={styles.tag} onPress={() => changeTag("salad")}>
                <Text style={styles.tag_text}>Salad🥗</Text>
              </Pressable>
            </View>
            <View style={styles.container_tag_row}>
              <Pressable
                style={styles.tag}
                onPress={() => changeTag("dessert")}
              >
                <Text style={styles.tag_text}>Dessert🍮</Text>
              </Pressable>
              {/* <Pressable style={styles.tag} onPress={() => changeTag("drink")}>
                <Text style={styles.tag_text}>Drink🍷</Text>
              </Pressable> */}
            </View>
          </View>
        </View>

        <Pressable
                  style={styles.start_chat_button}
                  onPress={() => (router.push("/search/chat-with-chatbot"))}
                >
                  <Text style={styles.start_chat_text}>Start Chat with Bot</Text>
                </Pressable>
        </ScrollView>
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
    gap: 10,


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
    marginLeft: 10,
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  search_input: {
    height: 60,
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    // alignItems: "center",
    // justifyContent:"center",
    // textAlign: "center",
    lineHeight: 60,
  },
  img_search_wrapper: {
    height: "28%",
    width: "90%",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
    img_search_wrapper_tags: {
      height: "33%",
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
    height: 40,
  },
  tag_text: {
    fontSize: 13,
    color: "#0A2533",
    padding: 10,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  innerContainer: {
    opacity: 0.95,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: 200,
    width: "80%",
    borderRadius: 20,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    borderRadius: 20,
    padding: 5,
    fontSize: 32,
    marginVertical: 10,
  },

  search_text_pressable:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
    start_chat_button:{
        backgroundColor: "#E1AEC1",
        borderRadius: 20,
        paddingVertical: 10,
        width: 300,
        marginTop:20,
    },

    start_chat_text:{
        textAlign: "center",
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
  scrollViewContent: {
       width: "100%",
       flexGrow: 1,
       justifyContent: "flex-start",
       alignItems:"center",
      },


});
