import { useRouter } from "expo-router";
import {
    View,
    Text,
    Image,
    SafeAreaView,
    StyleSheet,
    GestureResponderEvent,
    Pressable,
    Platform,
  } from "react-native";
  
  
  export default function LoginScreen() {
    // navigation
    const router = useRouter();

    // hardcode variables
    const img_path_1 = "../assets/cone.png";
    const img_path_2 = "../assets/burger.png";
    const img_path_3 = "../assets/orange.png";
  
    // onPress Functions
    function onPressLater(event: GestureResponderEvent): void {
      console.log("user: press later");
    }
  
    function onPressLogin(event: GestureResponderEvent): void {
      console.log("user: press login btn");
      router.push("./login")
    }
  
    function onPressSignUp(event: GestureResponderEvent): void {
      console.log("user: press sign up btn");
      router.push("./signup")
    }
  
    return (
      <>
        <SafeAreaView style={styles.safearea}>
          <Pressable onPress={onPressLater}>
            <Text style={styles.later}>Later</Text>
          </Pressable>
          <View style={styles.container_img}>
            <Image source={require(img_path_1)} style={styles.img1} />
            <Image source={require(img_path_2)} style={styles.img2} />
            <Image source={require(img_path_3)} style={styles.img3} />
          </View>
          <View style={styles.container}>
            <Text style={styles.text}>Start your foodie journey</Text>
            <View style={styles.container_btn}>
              <Pressable style={styles.btn_login} onPress={onPressLogin}>
                <Text style={styles.btn_login_text}>Login</Text>
              </Pressable>
              <Pressable style={styles.btn_signup} onPress={onPressSignUp}>
                <Text style={styles.btn_signup_text}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    safearea: {
      flex: 1,
      backgroundColor: "#E1AEC1",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    container_btn: {
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    container_img: {
      position: "relative",
      height: "40%"
    },
    img1: {
      width: 118,
      height: 166,
      position: "absolute",
      left: 90
    },
    img2: {
      width: 124,
      height: 98,
      position: "absolute",
      top: 150,
      right: 40,
    },
    img3: {
      width: 137,
      height: 118,
      position: "absolute",
      top: 280,
      left: 140,
    },
    later: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "right",
      marginRight: 20,
      marginTop: Platform.OS === 'ios' ? 30: 80,
    },
    text: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 40,
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
    },
    btn_signup_text: {
      color: "#042628",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  