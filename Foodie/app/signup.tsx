import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const img_path = "../assets/chickenleg.png";

  // navigation
  const router = useRouter();

  function onChangeUserName(text: string): void {
    throw new Error("Function not implemented.");
  }

  function onChangeEmail(text: string): void {
    throw new Error("Function not implemented.");
  }

  function onChangePassword(text: string): void {
    throw new Error("Function not implemented.");
  }

  function onChangePasswordVisibility(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }


  function onPressLogin(event: GestureResponderEvent): void {
    console.log("user: press login btn");
    router.push("./login");
  }

  function onPressRegister(event: GestureResponderEvent): void {
    console.log("user: press sign up btn");
    throw new Error("Function not implemented.");
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isChecked, setChecked] = useState(false);

  return (
    <>
      <SafeAreaView style={styles.safearea}>
        <View style={styles.container}>
          <Text style={styles.title_welcome}>Welcome!</Text>
          <View style={styles.container_header}>
            <View style={styles.container_header_col}>
              <Text style={styles.title_login}>Sign Up to</Text>
              <Text style={styles.login_text}>Echos is simply</Text>
            </View>
            <Image source={require(img_path)} style={styles.img} />
          </View>
          <View style={styles.container_input}>
            <Text style={styles.text}>User Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeUserName}
              value={username}
              placeholder="Enter your user name"
            />
          </View>
          <View style={styles.container_input}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter your email"
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
              />
              <Pressable onPress={onChangePasswordVisibility}>
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                />
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.btn_login} onPress={onPressRegister}>
            <Text style={styles.btn_login_text}>Register</Text>
          </Pressable>
          <View style={styles.container_login}>
            <Text style={styles.text}>Already have an Account? </Text>
            <Pressable onPress={onPressLogin}>
              <Text style={styles.register}>Login</Text>
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
  container_login: {
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
    height: 171,
    width: 147,
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
    marginVertical: 20,
  },
  btn_login_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
