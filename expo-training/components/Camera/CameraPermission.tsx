import { StyleSheet, Text, View } from "react-native";

import Button from "../Button";

export const CameraPermission = ({ grant }: { grant: () => void }) => (
  <View style={styles.container}>
    <Text style={{ textAlign: "center", color: "white" }}>
      We need your permission to show the camera
    </Text>
    <Button onPress={grant} label="grant permission" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
