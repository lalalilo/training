import { Pressable, StyleSheet, Text, View } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
};

export default function Button({ label, onPress }: ButtonProps) {
  return (
    <View style={[styles.buttonContainer, {}]}>
      <Pressable style={[styles.button]} onPress={onPress}>
        <Text style={[styles.buttonLabel]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 120,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 18,
  },
  button: {
    borderRadius: 10,
    minWidth: 120,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#25292e",
    fontSize: 16,
  },
});
