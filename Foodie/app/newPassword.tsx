import { Pressable, Text, TextInput, View, Alert, StyleSheet,ScrollView, Platform,
  KeyboardAvoidingView, Keyboard,TouchableWithoutFeedback, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { setNewPassword, validPassword } from "@/utils";
import PasswordInput from "@/Components/Password";


export default function newPasswordScreen(){

    const {email} = useLocalSearchParams();
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onPressLater = ()=>{
        // router.dismissAll();
        // router.back();
        router.back();
        router.replace("/login");
    }

    const onPressSubmit = async () => {
        if(validPassword(password)){
            setLoading(true);
            if(typeof email==='string' && await setNewPassword(email,password)){
                Alert.alert("Success", "Update Your Password Successfully!");
                setLoading(false);
                // router.back();
                router.replace("/login");
            }
            else{
              setLoading(false);
            }
            setLoading(false);
        }
        else{
            alert("Invalid Password, please contain at least 8 characters including one lower/upper letter, one digit and one special character.");
        }

       
    };


    return(
        <SafeAreaView style={styles.safearea}>
            <KeyboardAvoidingView
            style={styles.safearea}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
              >
            <Pressable onPress={onPressLater}>
                <Text style={styles.later}>Later</Text>
            </Pressable>
            <View style={styles.container}>
                <View style={styles.container_header_col}>
                  <Text style={styles.title_login}>Reset Password</Text>
                  <Text style={styles.login_text}>in Echos is simply</Text>
                </View>
                <PasswordInput password={password} onChangePassword={setPassword}/>
                <View style={[styles.btn_login ,{backgroundColor: loading ? "grey" : "#042628"}]}>
                    <Pressable onPress={onPressSubmit} disabled={loading}>
                        <Text style={styles.btn_login_text}>Submit</Text>
                    </Pressable>
                </View>
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
      justifyContent: "flex-start",
      width: "100%",
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
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  