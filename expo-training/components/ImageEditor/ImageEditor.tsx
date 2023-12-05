import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { usePinchGesture } from "./usePinchGesture";
import Button from "../Button";

type ImageEditorProps = {
  source: ImageSourcePropType;
  imageStyle: object;
  removeImage: () => void;
};

export const ImageEditor = ({
  source,
  imageStyle,
  removeImage,
}: ImageEditorProps) => {
  const { pinchGesture, scale } = usePinchGesture();

  const composed = Gesture.Simultaneous(pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <GestureDetector gesture={composed}>
        <View style={[imageStyle, styles.container]}>
          <Animated.Image source={source} style={[imageStyle, animatedStyle]} />
        </View>
      </GestureDetector>
      <View style={styles.buttonsContainer}>
        <Button label="🗑️" onPress={removeImage} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
