import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

export const usePinchGesture = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  return { pinchGesture, scale };
};
