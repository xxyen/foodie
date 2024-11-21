import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "@/context/contexts";
import { getProfile } from "@/utils";
import * as Linking from "expo-linking";

export default function LoginScreen() {
  const { username, onChangeUsername, onChangeId } = useAppContext();

  // variables
  const img_path = "../assets/rasberry.png";
  const google_icon_path = "../assets/google_icon.png";
  // const baseUrl = Platform.OS === "android"
  //               ? "http://67.159.75.53:4123"
  //               : "http://67.159.75.53:4123"
  const baseUrl = "https://foodie.zeus.wang";

  // navigation
  const router = useRouter();

  // states

  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isChecked, setChecked] = useState(false);

  // functions
  function onPressLater(event: GestureResponderEvent): void {
    console.log("user: press later");
    router.dismissAll();
    router.push("/home");
  }
  // function onChangeUserName(text: string): void {
  //   // throw new Error("Function not implemented.");
  //   setUsername(text);
  // }

  function onChangePassword(text: string): void {
    // throw new Error("Function not implemented.");
    setPassword(text);
  }

  function onChangePasswordVisibility(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
    setPasswordVisibility(!isPasswordVisible);
  }

  function onPressForgotPassword(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  async function onPressLogin(event: GestureResponderEvent): Promise<void> {
    console.log("user: press login btn");
    // throw new Error("Function not implemented.");
    const res = await loginHelper();
    if (res) {
      const user = await getProfile(res);
      router.dismissAll();
      router.push("/home");
      Alert.alert("Congratulate!", user?.username+", you have logged in successfully."); 
    }
  }

  const loginHelper = async () => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    try {
      const response = await fetch(`${baseUrl}/users/login`, config);
      const body = await response.json();
      if (response.status != 200) {
        alert(body.message);
        return null;
      } else {
        onChangeId(body.id);
        return body.id;
      }
    } catch (err) {
      alert(err);
      return null;
    }
  };

  function onPressSignUp(event: GestureResponderEvent): void {
    console.log("user: press sign up btn");
    router.push("./signup");
  }


  return (
    <>
      <SafeAreaView style={styles.safearea}>
        <Pressable onPress={onPressLater}>
          <Text style={styles.later}>Later</Text>
        </Pressable>
        <View style={styles.container}>
          <Text style={styles.title_welcome}>Welcome!</Text>
          <View style={styles.container_header}>
            <View style={styles.container_header_col}>
              <Text style={styles.title_login}>Login to</Text>
              <Text style={styles.login_text}>Echos is simply</Text>
            </View>
            <Image source={require(img_path)} style={styles.img} />
          </View>
          <View style={styles.container_input}>
            <Text style={styles.text}>User Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeUsername}
              value={username}
              placeholder="Enter your user name"
            />
          </View>
          <View style={styles.container_input}>
            <Text style={styles.text}>Password</Text>
            <View style={styles.container_password}>
              <TextInput
                onChangeText={onChangePassword}
                value={password}
                secureTextEntry={!isPasswordVisible}
                placeholder="Enter your password"
                style={{ flex: 1 }}
              />
              <Pressable onPress={onChangePasswordVisibility}>
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.container_footer}>
            <View style={styles.container_remember}>
              <Pressable
                onPress={() => {
                  setChecked(!isChecked);
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <MaterialIcons
                  name={isChecked ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="black"
                />
                <Text style={styles.rememberme}>Remember me</Text>
              </Pressable>
            </View>
            <Pressable onPress={()=>router.push("/forget")}>
              <Text>Forgot Password?</Text>
            </Pressable>
          </View>
          <Pressable style={styles.btn_login} onPress={onPressLogin}>
            <Text style={styles.btn_login_text}>Login</Text>
          </Pressable>
          <View style={styles.container_register}>
            <Text style={styles.text}>Don’t have an Account? </Text>
            <Pressable onPress={onPressSignUp}>
              <Text style={styles.register}>Register</Text>
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 50,
    gap: 20,
  },
  container_header: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    height: 130,
  },
  container_header_col: {
    justifyContent: "center",
    width: "50%",
  },
  container_input: {
    width: "100%",
    gap: 10,
  },
  container_password: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  container_footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  container_remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  container_register: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title_welcome: {
    fontSize: 25,
  },
  title_login: {
    fontSize: 31,
    fontWeight: "bold",
  },
  login_text: {
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  img: {
    height: 126,
    width: 159,
  },
  input: {
    height: 60,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  rememberme: {
    marginLeft: 8,
  },
  register: {
    fontWeight: "bold",
    fontSize: 16,
  },
  btn_login: {
    height: 55,
    width: "100%",
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
  later: {
    color: "#042628",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: "10%",
    marginTop: "15%",
  },
  btn_google: {
    height: 55,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    borderWidth: 1
  },
  btn_google_text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon_google: {
    height: 16,
    width: 16
  }
});
