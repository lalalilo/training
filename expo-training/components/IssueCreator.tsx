import { Camera, CameraCapturedPicture } from "expo-camera";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import { CameraButton } from "./Camera/CameraButton";
import { CameraDenied } from "./Camera/CameraDenied";
import { CameraPermission } from "./Camera/CameraPermission";
import { ImageEditor } from "./ImageEditor/ImageEditor";

export const IssueCreator = () => {
  const [permission, requestPermissionCamera] = Camera.useCameraPermissions();
  let camera: Camera | null | undefined;

  const [ready, setReady] = useState(false);

  const [picture, setPicture] = useState<CameraCapturedPicture | undefined>();
  const [finalImageUri, setFinalImageUri] = useState<string | undefined>();

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

  if (finalImageUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: finalImageUri }} style={styles.picture} />
        <Text style={styles.success}>
          Your issue has been succesfully posted, our support team will get back
          to you as soon as possible 👍
        </Text>
        <Button
          label="New issue"
          onPress={() => {
            setFinalImageUri(undefined);
            setPicture(undefined);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {picture ? (
        <ImageEditor
          source={picture}
          imageStyle={styles.picture}
          removeImage={() => setPicture(undefined)}
          setFinalImageUri={setFinalImageUri}
        />
      ) : (
        <>
          <Camera
            style={styles.picture}
            ratio="16:9"
            ref={(ref) => (camera = ref)}
            onCameraReady={() => setReady(true)}
          />
          <CameraButton onPress={takePicture} disabled={!ready} />
        </>
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
  success: {
    position: "absolute",
    fontSize: 16,
    textAlign: "center",
    color: "white",
    padding: 50,
    backgroundColor: "rgba(33, 135, 33, 0.8)",
  },
});
