import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

export const usePanGesture = () => {
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      positionX.value += e.translationX - translationX.value;
      positionY.value += e.translationY - translationY.value;
      translationX.value = e.translationX;
      translationY.value = e.translationY;
    })
    .onEnd(() => {
      translationX.value = 0;
      translationY.value = 0;
    });

  return { panGesture, positionX, positionY };
};
