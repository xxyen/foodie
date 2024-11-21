import { useRouter, useNavigation } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import * as Linking from "expo-linking";

export default function WelcomeScreen() {
  // navigation
  const router = useRouter();
  const navigation = useNavigation();

  // hardcode variables
  const img_path_1 = "../assets/cone.png";
  const img_path_2 = "../assets/burger.png";
  const img_path_3 = "../assets/orange.png";
  const google_icon_path = "../assets/google_icon.png";

  // functions
  function onPressLater(event: GestureResponderEvent): void {
    console.log("user: press later");
    router.push("/home");
  }

  function onPressLogin(event: GestureResponderEvent): void {
    console.log("user: press login btn");
    router.push("/login");
  }

  function onPressSignUp(event: GestureResponderEvent): void {
    console.log("user: press sign up btn");
    router.push("/signup");
  }

  async function onPressGoogleLogin(
    event: GestureResponderEvent
  ): Promise<void> {
    console.log("user: press continue with google");
    await Linking.openURL("https://foodie.zeus.wang/auth/google");
  }

  return (
    <>
      <SafeAreaView style={styles.safearea}>
        <View style={styles.container}>
          <View style={styles.container_later}>
            <Pressable onPress={onPressLater} style={styles.later_wrapper}>
              <Text style={styles.later}>Later</Text>
            </Pressable>
          </View>
          <View style={styles.container_img}>
            <Image source={require(img_path_1)} style={styles.img1} />
            <Image source={require(img_path_2)} style={styles.img2} />
            <Image source={require(img_path_3)} style={styles.img3} />
          </View>
          <View style={styles.container_below_img}>
            <Text style={styles.text}>Start your foodie journey</Text>
            <View style={styles.container_btn}>
              <Pressable style={styles.btn_login} onPress={onPressLogin}>
                <Text style={styles.btn_login_text}>Login</Text>
              </Pressable>
              <Pressable style={styles.btn_signup} onPress={onPressSignUp}>
                <Text style={styles.btn_signup_text}>Sign Up</Text>
              </Pressable>
              <Pressable style={styles.btn_google} onPress={onPressGoogleLogin}>
                <Image
                  source={require(google_icon_path)}
                  style={styles.icon_google}
                  resizeMode="contain"
                />
                <Text style={styles.btn_google_text}>Continue with Google</Text>
              </Pressable>
            </View>
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
  container_below_img: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container_btn: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 100,
  },
  container_img: {
    position: "relative",
    height: "60%",
    width: "80%",
  },
  img1: {
    width: 118,
    height: 166,
    position: "absolute",
    top: 0,
    left: "10%",
  },
  img2: {
    width: 124,
    height: 98,
    position: "absolute",
    top: "30%",
    left: "60%",
  },
  img3: {
    width: 137,
    height: 118,
    position: "absolute",
    top: "60%",
    left: "30%",
  },
  later: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
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
    backgroundColor: "#4285F4",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_signup_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  btn_google: {
    height: 55,
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  btn_google_text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon_google: {
    height: 16,
    width: 16,
  },
  later_wrapper: {
    width: 45,
    height: 20,
  },
  container_later: {
    width: "100%",
    height: 20,
    alignItems: "flex-end",
    marginRight: "15%",
    marginTop: "20%",
  },
});
