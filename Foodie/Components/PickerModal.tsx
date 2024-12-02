import { openCamera, pickImage, updateImage, updateIconByGallery, updateIconByCamera } from "@/utils";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Modal, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import PermissionRequest from "./PermissionRequest";
import { useAppContext } from "@/context/contexts";

export default function PickerModal({visible, onChangeVisible, action}:
    {visible:boolean, action:number, onChangeVisible:(visible:boolean)=>void}){

    const {id, onChangeBuffer} = useAppContext();
    const [permission, requestPermission] = useCameraPermissions();
    const[gallery, setGallery] = useState(false);
    const[camera, setCamera] = useState(false);
    const[loading, setLoading] = useState(false);

    const onClickGallery = async () => {
        setGallery(true);
        setCamera(false);
        setLoading(true);
        if(action===1){
            await pickImage();
        }
        else{
            const buffer = await updateIconByGallery(id);
            if(buffer){
                onChangeBuffer(buffer);
            }
            else{
                Alert.alert("Upload Failure, please try again.");
            }
        }
        setLoading(false);
        onChangeVisible(false);
    }

    const onClickCamera = async() => {
        setGallery(false);
        setCamera(true);
        setLoading(true);
        if(action===1){
            await openCamera(null);
        }
        else{
            const buffer = await updateIconByCamera(id);
            if(buffer){
                onChangeBuffer(buffer);
            }
            else{
                Alert.alert("Upload Failure, please try again.");
            }
        }
        setLoading(false);
        onChangeVisible(false);
    }

    const onClose = async() => {
        onChangeVisible(false);
    }

      

    return (
        <View style={styles.container}>
            <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
                <View style={styles.modalBackground}>
                    <View style={styles.innerContainer}>
                        {loading && (
                            <ActivityIndicator style={styles.container}/>
                        )}
                        <Button onPress={onClickGallery} title="Choose From Photo Library" />
                        <Button onPress={onClickCamera} title="Take a Picture" />
                        <Button onPress={onClose} color={"red"} title="Close"/>
                    {/* {(camera && permission && !permission?.granted) && (
                        <PermissionRequest />
                    )} */}
                    </View>
                    </View>
            </Modal>
        </View>
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

})