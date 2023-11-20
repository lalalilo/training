import { Camera, CameraCapturedPicture } from "expo-camera";
import { useState } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";

import Button from "./Button";
import { CameraButton } from "./Camera/CameraButton";
import { CameraDenied } from "./Camera/CameraDenied";
import { CameraPermission } from "./Camera/CameraPermission";

export const IssueCreator = () => {
  const [permission, requestPermissionCamera] = Camera.useCameraPermissions();
  let camera: Camera | null | undefined;

  const [ready, setReady] = useState(false);

  const [picture, setPicture] = useState<CameraCapturedPicture | undefined>();
  const takePicture = async () => {
    const picture = await camera?.takePictureAsync();
    setPicture(picture);
  };

  if (!permission) {
    return <CameraDenied />;
  }

  if (!permission.granted) {
    return <CameraPermission grant={requestPermissionCamera} />;
  }

  return (
    <View style={styles.container}>
      {picture ? (
        <Image source={picture} style={styles.picture} />
      ) : (
        <Camera
          style={styles.picture}
          ratio="16:9"
          ref={(ref) => (camera = ref)}
          onCameraReady={() => setReady(true)}
        />
      )}
      {picture ? (
        <Button label="🗑️" onPress={() => setPicture(undefined)} />
      ) : (
        <CameraButton onPress={takePicture} disabled={!ready} />
      )}
    </View>
  );
};

const dimensions = Dimensions.get("window");
const targetHeight = dimensions.height - 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    height: targetHeight,
    width: Math.round(targetHeight * (9 / 16)),
  },
});
