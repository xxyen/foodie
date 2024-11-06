
import { View , Text, Button, StyleSheet, Modal} from "react-native";
import { CameraView, CameraType, useCameraPermissions, PermissionResponse } from "expo-camera";

export  default function PermissionRequest({permission,requestPermission}:
    {permission:PermissionResponse|null, requestPermission :(() => Promise<PermissionResponse>)}
){

    return (
        <View style={styles.container}>
            <Modal visible={!permission?.granted}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    message: {
      textAlign: "center",
      paddingBottom: 10,
    },
  });
  