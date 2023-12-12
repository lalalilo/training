import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { HelloWorld } from "./components/HelloWorld";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useState } from "react";

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);

  let camera: Camera | null = null;

  if (!permission) {
    requestPermission();
    return null;
  }

  if (!permission.granted) {
    return <Text>Accept camera, moron!</Text>;
  }

  if (picture) {
    return (
      <View style={styles.container}>
        <Image source={picture} style={styles.camera} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setPicture(null);
            }}
          >
            <Text style={styles.text}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ratio="16:9"
        ref={(ref) => (camera = ref)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const picture = await camera?.takePictureAsync();
            console.log(picture);
            setPicture(picture ?? null);
          }}
        >
          <Text style={styles.text}>📷</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  camera: {
    top: 0,
    height: Dimensions.get("screen").height - 100,
    width: (9 / 16) * Dimensions.get("screen").height,
  },
  button: {
    height: Dimensions.get("screen").width / 5,
    width: Dimensions.get("screen").width / 5,
  },
  buttonContainer: {
    height: 100,
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 50,
    textAlign: "center",
  },
});
