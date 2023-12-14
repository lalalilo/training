import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

export const useRotationGesture = () => {
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  return { rotationGesture, rotation };
};
