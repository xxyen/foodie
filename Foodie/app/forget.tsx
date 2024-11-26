import { Pressable, Text, TextInput, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { existingAccount, sendEmail } from "@/utils";
import { useRouter } from "expo-router";
import { useCodeContext } from "@/context/codeContexts";


export default function forgetScreen(){

    const {code, disabled, freeze, attempt, time,
        onChangeCode, onChangeDisabled, onChangeAttempt, onChangeTime} = useCodeContext();

    const [email, setEmail] = useState<string>('');
    // const [code, setCode] = useState<string>('');
    const [verifyCode, setVerifyCode] = useState<string>('');
    // const [disabled, setDisabled] = useState(false);
    const router = useRouter();

    useEffect(()=>{},[disabled]);

    const onPressLater = ()=>{
        // router.dismissAll();
        // router.push("/login");
        router.back();
        router.replace("/login");
    }
    const randomCode = ()=>{
        let code = '';
        for(let i =0;i<6;i++){
            const char = Math.floor(Math.random() * 10);
            code+=char;
        }
        return code;
    }

    const onPressSubmit = async () => {
        const exitstAccount = await existingAccount(email);
        if(!exitstAccount){
          return;
        }
        else{
          await sendVerfiyCode();
        }
        

    };

    const sendVerfiyCode = async() => {
      const code = randomCode();
        onChangeCode(code);
        onChangeDisabled(true);
        const freezeTime = attempt >= freeze.length ? freeze[freeze.length - 1] : freeze[attempt] ;

        // setTimeout(() => onChangeDisabled(false),freezeTime);
        setTimeout(() => onChangeCode(''),180000);
        await sendEmail(email,"Foodie: Validation Code",
            "Your code is : "+code+". It will expire in 3 minutes.\n\nBest Regards,\nFoodie");
        
        onChangeAttempt(attempt+1);
        let countdown = freezeTime / 1000;
        const interval = setInterval(() => {
            countdown -= 1;
            onChangeTime(countdown);
            if (countdown <= 0) {
                clearInterval(interval);
                onChangeDisabled(false);
            }
        }, 1000);
    }

    const onPressVerify = ()=>{
        console.log(verifyCode,code);
        if(code!=='' && verifyCode===code){
            onChangeAttempt(0);
            onChangeCode('');
            router.replace({
                pathname:"/newPassword",
                params:{
                  email:email,
                },
              });
        }
        else{
            Alert.alert("Failure","Incorrect Code, Please Try Again")
        }
    }


    return(
        <SafeAreaView style={styles.safearea}>
            <Pressable onPress={onPressLater}>
                <Text style={styles.later}>Later</Text>
            </Pressable>
            <View style={styles.container}>
                <Text style={styles.title_welcome}>Verify your Email</Text>
                <View style={styles.container_input}>
                    <Text style={styles.text}>What is your Email Address</Text>
                    <TextInput style={styles.input}
                    onChangeText={setEmail} value={email}></TextInput>
                </View>
                <View style={styles.container_input}>
                    <Text style={styles.text}>Verify Your Received Code</Text>
                    <TextInput style={styles.input}
                    onChangeText={setVerifyCode} value={verifyCode}></TextInput>
                </View>
                <View style={[styles.btn_login ,{backgroundColor: disabled ? "grey" : "#042628"}]}>
                    <Pressable onPress={onPressSubmit} disabled={disabled}>
                        <Text style={styles.btn_login_text}>{time<=0 ? 'Send Verification Code':'Send Again After ('+time+')'}</Text>
                    </Pressable>
                </View>
                <View style={[styles.btn_login ,{backgroundColor:  "#042628"}]}>
                    <Pressable onPress={onPressVerify}>
                        <Text style={styles.btn_login_text}>Verify</Text>
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
  