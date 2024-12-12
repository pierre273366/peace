import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { supColoc } from "../reducers/users";

export default function ProfilParam({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const userToken = user.token;
  const dispatch = useDispatch();

  const deleteUserFromColoc = async () => {
    console.log(user);
    try {
      const response = await fetch(
        `http://10.9.1.137:3000/users/${userToken}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.result) {
        console.log("Utilisateur supprimé avec succès de la coloc");
        dispatch(supColoc());
      } else {
        console.error("Utilisatuer non supprimé de la coloc", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la requête DELETE:", error);
    }
  };

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
        <View style={styles.parametre}>
          <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
            Paramètres Profil
          </Text>
          <View>
            <TouchableOpacity
              onPress={deleteUserFromColoc}
              style={styles.buttonConnect}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18, color: "white" }}>
                Quitter la coloc
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
  parametre: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonConnect: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
  },
});
