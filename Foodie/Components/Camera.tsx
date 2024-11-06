import { openCamera } from "@/utils";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Camera() {
  const cameraView = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [picture, setPicture] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    console.log("toggling camera facing...");
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function handleTakePicture() {
    // Take a picture
    console.log("taking picture...");
    const result = await cameraView.current?.takePictureAsync();

    if (result && result.uri) {
      console.log("took picture ", result.uri);
      await openCamera(result);
    }
  }

  // if we took a picture, just return that
  if (picture) {
    return (
      <ImageBackground source={{ uri: picture }} style={styles.image}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => setPicture(null)}>
            <Text style={styles.text}>Back to Camera</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraView} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </Pressable>
        </View>
      </CameraView>
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
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    flex: 1,
  },
});
