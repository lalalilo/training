import { CameraCapturedPicture } from "expo-camera";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PictureProps {
  picture: CameraCapturedPicture | null;
  onClickBackButton: () => void;
}

export const Picture: React.FC<PictureProps> = ({
  picture,
  onClickBackButton,
}) => {
  if (!picture) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={picture} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onClickBackButton}>
          <Text style={styles.text}>Back to camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  image: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 100,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
