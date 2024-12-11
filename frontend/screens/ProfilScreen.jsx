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
        <View style={{ backgroundColor: "orange", height: "30%" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfilParams")}
            style={styles.iconContainer}
          >
            <FontAwesome name={"gear"} size={30} color="#5F5F5F" />
          </TouchableOpacity>
          <View style={styles.containerDescript}>
            <Text>@USER</Text>
            <Text>🎂{}</Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.containerInfo}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Informations</Text>
        <View style={styles.infoUser}>
          <Text>Réseaux Sociaux</Text>
          <Text>Tél</Text>
          <Text>Date d'entrée dans la coloc</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Badges</Text>
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
    backgroundColor: "orange",
  },
  iconContainer: {
    alignItems: "flex-end",
    marginRight: 20,
  },
  containerDescript: {
    width: 320,
    height: 250,
    backgroundColor: "white",
    marginTop: 100,
    marginLeft: 40,
    borderRadius: 20,
    shadowColor: "#000", // Couleur de l'ombre
    shadowOffset: { width: 0, height: 4 }, // Décalage de l'ombre
    shadowOpacity: 0.1, // Opacité de l'ombre
    shadowRadius: 10, // Rayon de flou de l'ombre
    alignItems: "center",
    justifyContent: "center",
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
