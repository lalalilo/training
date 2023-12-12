import { CameraCapturedPicture } from "expo-camera";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

interface PictureProps {
  picture: CameraCapturedPicture | null;
}

export const Picture: React.FC<PictureProps> = ({ picture }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!picture) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Image style={styles.image} source={picture} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
  },
  image: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginBottom: 30,
    flex: 1,
    justifyContent: "center",
  },
});
