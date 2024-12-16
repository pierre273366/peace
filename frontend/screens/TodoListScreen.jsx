import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function TodoList({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "30%" }}>
          <View style={styles.containerBtnTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.iconContainer}
            >
              <FontAwesome
                name={"arrow-circle-left"}
                size={35}
                color="rgb(255, 139, 228)"
              />
            </TouchableOpacity>
            <View style={styles.containerView}>
              <TouchableOpacity
                style={styles.Add}
                onPress={() => navigation.navigate("TodoCrea")}
              >
                <Text style={styles.white}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}
          >
            Todo List
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.containerInfo}>
        <View style={styles.infoUser}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 255)",
  },
  containerProfil: {
    width: "100%",
    heigth: 600,
  },
  iconContainer: {
    marginLeft: 20,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Add: {
    backgroundColor: "black",
    borderRadius: 50,
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  white: {
    color: "white",
    fontSize: 26,
  },
});
