import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import Camera from "./components/Camera";

export default function App() {
  return (
    <View style={styles.container}>
      <Camera />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
