import { useCallback, useRef } from "react";
import { StyleSheet, View, ImageSourcePropType } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import ViewShot, { captureRef } from "react-native-view-shot";

import { usePanGesture } from "./usePanGesture";
import { usePinchGesture } from "./usePinchGesture";
import { useRotationGesture } from "./useRotatationGesture";
import Button from "../Button";

type ImageEditorProps = {
  source: ImageSourcePropType;
  imageStyle: object;
  removeImage: () => void;
  setFinalImageUri: (uri: string) => void;
};

export const ImageEditor = ({
  source,
  imageStyle,
  removeImage,
  setFinalImageUri,
}: ImageEditorProps) => {
  const ref = useRef<ViewShot | null>(null);
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

  const onCapture = useCallback(() => {
    captureRef(ref, {
      format: "jpg",
      quality: 1,
    }).then((uri) => setFinalImageUri(uri));
  }, []);

  return (
    <>
      <GestureDetector gesture={composed}>
        <ViewShot ref={ref} style={[imageStyle, styles.container]}>
          <Animated.Image source={source} style={[imageStyle, animatedStyle]} />
        </ViewShot>
      </GestureDetector>
      <View style={styles.buttonsContainer}>
        <Button label="🗑️" onPress={removeImage} />
        <Button label="✅" onPress={onCapture} />
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
