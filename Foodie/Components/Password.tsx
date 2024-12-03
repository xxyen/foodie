import { View, StyleSheet, TextInput,Pressable,Text,GestureResponderEvent, } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function PasswordInput({password,onChangePassword}:
    {password:string; onChangePassword:(password:string)=>void}
){
    const [isPasswordVisible, setPasswordVisibility] = useState(false);

    function onChangePasswordVisibility(event: GestureResponderEvent): void {
        setPasswordVisibility(!isPasswordVisible);
    }
    
    return (
        <View style={styles.container_input}>
            <Text style={styles.text}>New Password</Text>
            <View style={styles.container_password}>
            <TextInput
                onChangeText={onChangePassword}
                value={password}
                secureTextEntry={!isPasswordVisible}
                placeholder="Enter your new password"
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
    );
    
}


const styles = StyleSheet.create({
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
