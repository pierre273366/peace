import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Profil({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "30%" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profil")}
            style={styles.iconContainer}
          >
            <FontAwesome
              name={"arrow-circle-left"}
              size={35}
              color="rgb(255, 139, 228)"
            />
          </TouchableOpacity>
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
  containerInfo: {
    marginTop: 190,
    marginLeft: 20,
  },
  infoUser: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 130,
    padding: 20,
  },
});
