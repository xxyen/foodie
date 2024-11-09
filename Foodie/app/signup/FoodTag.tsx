import { useEffect } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";


export default function FoodTag({food,index,statues, onChangeStatus}:
    {food:string,index:number,statues: boolean[],onChangeStatus:(status:boolean[])=>void}){
    
    const onPressTag = (index:number, statues: boolean[],onChangeStatus:(status:boolean[])=>void) => {
        const newStatues = [...statues];
        newStatues[index] = !statues[index];
        onChangeStatus(newStatues);
    };
    
    return (
        <View style={styles.container_tag_row}>
            <Pressable style={[styles.tag, {backgroundColor: statues[index]? "#050000":"#FFFFFF"}]}
                onPress={()=>onPressTag(index,statues,onChangeStatus)}>
                <Text style={[styles.tag_text, {color:statues[index] ? "#FFFFFF": "#0A2533" }]}>{food}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container_tag_row: {
        //margin:4,
    },
    tag: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        height: 40,
        // width: 90,
    },
    tag_text: {
        fontSize: 14,
        color: "#0A2533",
        padding: 10,
        textAlign: "center",
    },
});


