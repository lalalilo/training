import { Pressable, StyleSheet, Text } from "react-native";

type CameraButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const CameraButton = ({ onPress, disabled }: CameraButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        { backgroundColor: pressed ? "rgb(210, 230, 255)" : "white" },
        styles.circleButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Text style={styles.text}>{pressed ? "📸" : "📷"}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 36,
  },
});
