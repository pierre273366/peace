import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function ColocParam({ navigation }) {
  const coloc = useSelector((state) => state.users.coloc.token); // Récupération du token
  const colocToken = coloc.token;
  const [codeWifi, setCodeWifi] = useState(""); // État pour la wifi
  const [loyer, setLoyer] = useState(""); // État pour le loyer
  const [infoVoisinage, setInfoVoisinage] = useState(""); // État pour info voisinage
  const [regleColoc, setRegleColoc] = useState(""); // État pour info voisinage

  const backendUrl = "https://peace-chi.vercel.app";

  // Fonction pour mettre à jour les infos colocs
  const updateColoc = async () => {
    try {
      const response = await fetch(`${backendUrl}/users/updateColoc`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: colocToken,
          codeWifi: codeWifi,
          loyer: loyer,
          infoVoisinage: infoVoisinage,
          regleColoc: regleColoc,
        }),
      });

      const data = await response.json();
      if (data.result) {
        Alert.alert("Succès", "Infos coloc mises à jour avec succès");
      } else {
        Alert.alert("Erreur", "Échec de la mise à jour des infos coloc");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des infos coloc", error);
      Alert.alert(
        "Erreur",
        `Une erreur est survenue lors de la mise à jour de la coloc: ${error.message}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "30%" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ColocProfil")}
            style={styles.iconContainer}
          >
            <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
          </TouchableOpacity>
        </View>
        <View style={styles.parametre}>
          <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
            Infos sur la Coloc
          </Text>

          <TextInput
            style={styles.descriptionInput}
            multiline
            placeholder="Ajouter un code Wifi..."
            value={codeWifi}
            onChangeText={setCodeWifi}
          />

          <TextInput
            style={styles.descriptionInput}
            placeholder="Ajouter le loyer..."
            value={loyer}
            onChangeText={setLoyer}
          />

          <TextInput
            style={styles.descriptionInput}
            placeholder="Ajouter les infos voisinages.."
            value={infoVoisinage}
            onChangeText={setInfoVoisinage}
          />

          <TextInput
            style={styles.descriptionInput}
            placeholder="Ajouter les règles de la coloc.."
            value={regleColoc}
            onChangeText={setRegleColoc}
          />

          <TouchableOpacity
            onPress={updateColoc}
            style={styles.buttonConnect}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Sauvegarder
            </Text>
          </TouchableOpacity>
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
  },
  iconContainer: {
    marginLeft: 20,
  },
  parametre: {
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionInput: {
    width: 340,
    height: 50,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    borderBottomWidth: 1,
    backgroundColor: "#E6E6FC",
  },
  buttonConnect: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    textAlign: "center",
  },
});
