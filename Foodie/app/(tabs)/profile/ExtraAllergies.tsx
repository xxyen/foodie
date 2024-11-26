import { Button, Modal, ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import FoodTag from "@/app/signup/FoodTag";
import { changeAllergies } from "@/utils";
import { useAppContext } from "@/context/contexts";
import { SafeAreaView } from "react-native-safe-area-context";

const allergyFoods:string[] = ['Dairy🥛','Peanut🥜','Soy🫘','Seafood🦞','Egg🥚','Gluten🌾',
    'Sesame🧂','Tree Nut🌰','Grain🍚','Shellfish🐚','Wheat🍞','Sulfite🪨'
  ];

export default function ExtraAllergies({visible,onChangeVisible}:
    {visible:boolean,
    onChangeVisible: (visible:boolean)=>void}){

    const {id, allergies, onChangeAllergies} = useAppContext();
    const newAllergies = allergyFoods.filter((a:string,index:number)=>!allergies.includes(a));
    const [statues, setStatues] = useState<boolean[]>(Array(newAllergies.length).fill(false));


    const onPressAdd = async()=>{
        const chosen = newAllergies.filter((a:string,index:number)=>statues[index]===true);
        const combo = allergies.concat(chosen);
        const res = await changeAllergies(id,combo);
        if(res){
            onChangeAllergies(combo);
            onChangeVisible(!visible);
        }
        
    }

    const onPressClose = async()=>{
        onChangeVisible(!visible);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent visible={visible}>
                <View style={styles.modalBackground}>
                    <View style={styles.innerContainer}>
                        <ScrollView contentContainerStyle={styles.container_tag_row}>
                            {newAllergies.map((a:string,index:number)=> 
                            <FoodTag key={index} food={a} index={index} statues={statues} onChangeStatus={setStatues}/>)}
                        </ScrollView>
                        <View style={styles.container_tag_row}>
                            <Button onPress={onPressClose} title="Close" color={"red"}></Button>
                            <Button onPress={onPressAdd} title="Add"></Button>
                        </View>
                    </View> 
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
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
    container_tag_row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        gap: 10,
        flexWrap: "wrap",
    },

})