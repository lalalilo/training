import { StyleSheet, View, ImageSourcePropType } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { usePanGesture } from "./usePanGesture";
import { usePinchGesture } from "./usePinchGesture";
import { useRotationGesture } from "./useRotatationGesture";
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
  const { panGesture, positionX, positionY } = usePanGesture();
  const { pinchGesture, scale } = usePinchGesture();
  const { rotationGesture, rotation } = useRotationGesture();

  const composed = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    rotationGesture,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: positionX.value },
      { translateY: positionY.value },
      { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
    ],
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
