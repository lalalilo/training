import { CameraCapturedPicture } from "expo-camera";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Picture } from "./Picture";

interface PictureProps {
  picture: CameraCapturedPicture | null;
  onClickBackButton: () => void;
}

export const PictureEditor: React.FC<PictureProps> = ({
  picture,
  onClickBackButton,
}) => {
  if (!picture) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onClickBackButton}>
        <Text style={styles.text}>⬅</Text>
      </TouchableOpacity>
      <Picture picture={picture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    paddingTop: 20,
  },

  button: {
    flex: 1,
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 999999,
  },
  text: {
    fontSize: 34,
    fontWeight: "bold",
    color: "black",
  },
});
