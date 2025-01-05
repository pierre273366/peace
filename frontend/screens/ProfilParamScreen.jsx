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
import { useSelector, useDispatch } from "react-redux";
import { supColoc, logout } from "../reducers/users";

export default function ProfilParam({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const userToken = useSelector((state) => state.users.user.token);
  const [description, setDescription] = useState(""); // État pour la description
  const [facebook, setFacebook] = useState(""); // État pour le lien Facebook
  const [instagram, setInstagram] = useState(""); // État pour le lien Instagram
  const dispatch = useDispatch();
  const backendUrl = "http://192.168.1.11:3000";

  // Fonction pour mettre à jour la description et les liens sociaux
  const updateProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/users/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          description: description,
          facebook: facebook,
          instagram: instagram,
        }),
      });
      const data = await response.json();
      if (data.result) {
        Alert.alert("Succès", "Profil mis à jour avec succès");
      } else {
        Alert.alert("Erreur", "Échec de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour du profil."
      );
    }
  };

  const logoutUser = () => {
    Alert.alert("Confirmation", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Se déconnecter",
        onPress: () => {
          dispatch(logout()); // Seulement nettoyer le state Redux
          navigation.navigate("Signin");
        },
      },
    ]);
  };

  // Fonction pour quitter la coloc avec confirmation
  const deleteUserFromColoc = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir quitter la coloc ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Quitter",
          onPress: async () => {
            try {
              // Effectuer la requête pour supprimer l'utilisateur de la coloc
              const response = await fetch(`${backendUrl}/users/${userToken}`, {
                method: "DELETE",
              });
              const data = await response.json();
              if (data.result) {
                console.log("Utilisateur supprimé avec succès de la coloc");
                dispatch(supColoc()); // Suppression de la coloc dans Redux
                // Redirige vers la page de connexion
                navigation.navigate("Signin");
              } else {
                console.error(
                  "Erreur lors de la suppression de l'utilisateur :",
                  data.error
                );
              }
            } catch (error) {
              console.error("Erreur lors de la requête DELETE :", error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue, veuillez réessayer plus tard."
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "30%" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profil")}
            style={styles.iconContainer}
          >
            <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
          </TouchableOpacity>
        </View>
        <View style={styles.parametre}>
          <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
            Paramètres Profil
          </Text>

          {/* Champ pour la description */}
          <TextInput
            style={styles.descriptionInput}
            multiline
            placeholder="Ajouter une description..."
            value={description}
            onChangeText={setDescription}
          />

          {/* Champ pour le lien Facebook */}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Ajouter le lien Facebook..."
            value={facebook}
            onChangeText={setFacebook}
          />

          {/* Champ pour le lien Instagram */}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Ajouter le lien Instagram..."
            value={instagram}
            onChangeText={setInstagram}
          />

          {/* Bouton pour sauvegarder les informations */}
          <TouchableOpacity
            onPress={updateProfile}
            style={styles.buttonConnect}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Sauvegarder le profil
            </Text>
          </TouchableOpacity>

          {/* Bouton pour se déconnecter */}
          <TouchableOpacity
            onPress={logoutUser}
            style={styles.buttonConnect}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>

          {/* Bouton pour quitter la coloc */}
          <TouchableOpacity
            onPress={deleteUserFromColoc}
            style={[styles.buttonConnect, { backgroundColor: "red" }]}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Quitter la coloc
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
