import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ViewShot, { captureScreen } from "react-native-view-shot";

const Picture = ({
  picture,
  onDelete,
  onSave,
}: {
  picture: string;
  onDelete: () => void;
  onSave: (uri: string) => void;
}) => {
  const scale = useSharedValue(1);

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const r = useSharedValue(0);

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    scale.value = e.scale;
  });

  const panGesture = Gesture.Pan().onUpdate((e) => {
    x.value = e.translationX;
    y.value = e.translationY;
  });

  const rotateGesture = Gesture.Rotation().onUpdate((e) => {
    r.value = e.rotation;
  });

  const composed = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    rotateGesture,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotateZ: `${(r.value * 180) / Math.PI}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <>
      <GestureDetector gesture={composed}>
        <ViewShot>
          <View style={[styles.camera, styles.container]}>
            <Animated.Image
              source={{ uri: picture }}
              style={[styles.camera, animatedStyle]}
            />
          </View>
        </ViewShot>
      </GestureDetector>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onDelete}>
          <Text style={styles.text}>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            captureScreen({
              format: "jpg",
              quality: 0.8,
            }).then(
              (uri) => onSave(uri),
              (error) => console.error("Oops, snapshot failed", error),
            );
          }}
        >
          <Text style={styles.text}>💾</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picture, setPicture] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  let camera: Camera | null = null;

  if (!permission) {
    requestPermission();
    return null;
  }

  if (!permission.granted) {
    return <Text>Accept camera, moron!</Text>;
  }

  if (picture && !isSaved) {
    return (
      <GestureHandlerRootView style={styles.gestureHandlerContainer}>
        <View style={styles.container}>
          <Picture
            picture={picture}
            onDelete={() => {
              setPicture(null);
            }}
            onSave={(uri: string) => {
              setPicture(uri);
              setIsSaved(true);
              console.log("foo");
            }}
          />
          <StatusBar style="auto" />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (picture && isSaved) {
    return (
      <View style={styles.container}>
        <Image style={styles.camera} source={{ uri: picture }} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPicture(null);
              setIsSaved(false);
            }}
          >
            <Text style={styles.text}>✉️</Text>
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
          onPress={() => {
            camera
              ?.takePictureAsync()
              .then((picture) => setPicture(picture.uri ?? null));
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
  gestureHandlerContainer: {
    flex: 1,
  },
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
    flexDirection: "row",
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
