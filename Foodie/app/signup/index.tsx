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
import * as Linking from "expo-linking";
import { useAppContext } from "@/context/contexts";
import { validateEmail, validPassword } from "@/utils";

export default function SignUpScreen() {

  const {onChangeId} = useAppContext();

  // variables
  const img_path = "../../assets/chickenleg.png";
  const google_icon_path = "../../assets/google_icon.png";
  const baseUrl = Platform.OS === "android"
  ? "http://10.0.2.2:4000"
  : "http://localhost:4000"


  // navigation
  const router = useRouter();

  // states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  // functions
  function onPressLater(event: GestureResponderEvent): void {
    console.log("user: press later");
    router.dismissAll();
    // router.back();
    router.push("/home");
    // router.push("signup/allergy");
  }

  function onChangeUserName(text: string): void {
    // throw new Error("Function not implemented.");
    setUsername(text);
  }

  function onChangeEmail(text: string): void {
    // throw new Error("Function not implemented.");
    setEmail(text);
  }

  function onChangePassword(text: string): void {
    // throw new Error("Function not implemented.");
    setPassword(text);
  }

  function onChangePasswordVisibility(event: GestureResponderEvent): void {
    // throw new Error("Function not implemented.");
    setPasswordVisibility(!isPasswordVisible);
  }

  function onPressLogin(event: GestureResponderEvent): void {
    console.log("user: press login btn");
    router.push("./login");
  }

  async function onPressRegister(event: GestureResponderEvent): Promise<void> {
    console.log("user: press sign up btn");

    if(validation()){
      // ref: https://stackoverflow.com/questions/77747019/how-can-i-pass-parameters-using-expo-router
      router.push({
        pathname:"signup/allergy",
        params:{
          email:email,
          username:username,
          password:password
        }
      });
    }

    // if(validation()){
    //   router.push("signup/allergy"+ "?" + createQueryString("username", username)
    //   +"&"+createQueryString("email", email)+"&"+createQueryString("password", password));
    // }
    
    // if(validateEmail(email)){
    //   if(validPassword(password)){
    //     const res = await registerHelper();
    //     if (res) {
    //       router.dismissAll();
    //       router.push("/home");
    //       Alert.alert("Congratulate!",username+", you have resgistered successfully."); 
    //     }
    //   }
    //   else{
    //     alert("Invalid Password, please contain at least 8 characters including one lower/upper letter, one digit and one special character.");
    //   }
    // }
    // else{
    //   alert("Invalid Email Address");
    // }
  }

  const validation = () => {
    if(validateEmail(email)){
      if(validPassword(password)){
        return true;
      }
      else{
        alert("Invalid Password, please contain at least 8 characters including one lower/upper letter, one digit and one special character.");
        return false;
      }
    }
    else{
      alert("Invalid Email Address");
      return false;
    }
  }

  async function onPressGoogleLogin(
    event: GestureResponderEvent
  ): Promise<void> {
    console.log("user: press continue with google");
    await Linking.openURL("http://localhost:4000/auth/google");
  }

  const registerHelper = async () => {
    const config = {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        'username' : username,
        'email' : email,
        'password' : password
      })
    };
    try{
      const response = await fetch(`${baseUrl}/register`, config);
      const body = await response.json();
      if(response.status!=201){
        alert(body.message);
        return false;
      }
      else{
        onChangeId(body.userId);
        return true;
      }
    } catch(err){
      alert(err);
      return false;
    }
    
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
                style={{flex:1}}
              />
              <Pressable onPress={onChangePasswordVisibility}>
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                />
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.btn_signup} onPress={onPressRegister}>
            <Text style={styles.btn_signup_text}>Register</Text>
          </Pressable>
          <Pressable style={styles.btn_google} onPress={onPressGoogleLogin}>
            <Image source={require(google_icon_path)} style={styles.icon_google} resizeMode="contain"/>
            <Text style={styles.btn_google_text}>Continue with Google</Text>
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
  btn_signup: {
    height: 55,
    width: "100%",
    backgroundColor: "#042628",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_signup_text: {
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
