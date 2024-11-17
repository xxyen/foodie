import { Pressable, Text, TextInput, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { setNewPassword, validPassword } from "@/utils";
import PasswordInput from "@/Components/Password";


export default function newPasswordScreen(){

    const {email} = useLocalSearchParams();
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const onPressLater = ()=>{
        router.dismissAll();
        router.push("/login");
    }

    const onPressSubmit = async () => {
        if(validPassword(password)){
            if(typeof email==='string' && await setNewPassword(email,password)){
                Alert.alert("Success", "Update Your Password Successfully!");
                router.push("/login");
            }
        }
        else{
            alert("Invalid Password, please contain at least 8 characters including one lower/upper letter, one digit and one special character.");
        }

       
    };



    return(
        <SafeAreaView style={styles.safearea}>
            <Pressable onPress={onPressLater}>
                <Text style={styles.later}>Later</Text>
            </Pressable>
            <View style={styles.container}>
                <Text style={styles.title_welcome}>Enter Your New Password</Text>
                <PasswordInput password={password} onChangePassword={setPassword}/>
                <View style={[styles.btn_login ,{backgroundColor:  "#042628"}]}>
                    <Pressable onPress={onPressSubmit}>
                        <Text style={styles.btn_login_text}>Submit</Text>
                    </Pressable>
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
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    btn_verify: {
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
  