import { openCamera, pickImage } from "@/utils";
import { useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import Camera from "./Camera";
import PermissionRequest from "./PermissionRequest";

export default function PickerModal({visible, onChangeVisible}:
    {visible:boolean, onChangeVisible:(visible:boolean)=>void}){

    const [permission, requestPermission] = useCameraPermissions();
    const[gallery, setGallery] = useState(false);
    const[camera, setCamera] = useState(false);

    const onClickGallery = async () => {
        setGallery(true);
        setCamera(false);
        await pickImage();
        onChangeVisible(false);
    }

    const onClickCamera = async() => {
        setGallery(false);
        setCamera(true);
        await openCamera(null);
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
                        <Pressable onPress={onClickGallery}>
                            <View style={styles.option}>
                                <Text>Choose from Photo Library</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={onClickCamera}>
                            <View style={styles.option}>
                                <Text>Take a picture</Text>
                            </View>
                        </Pressable>
                        <Button onPress={onClose} title="Close"/>
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
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dimmed background to see underlying page
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 300,
        width: '80%',
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
        padding: 10,
        fontSize: 18,
        marginVertical: 10,
      },

})