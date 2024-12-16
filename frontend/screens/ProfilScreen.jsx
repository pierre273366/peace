import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function Profil({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const coloc = useSelector((state) => state.users.coloc);
  const [userDetails, setUserDetails] = useState("");

  const backendUrl = "http://10.9.1.105:3000";
  const userToken = user.token;

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Utilisation de useEffect pour récupérer les informations de l'utilisateur avec son token
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Effectuer le fetch avec le token de l'utilisateur pour récupérer ses détails
        const response = await fetch(`${backendUrl}/users/${userToken}`);
        const data = await response.json();

        // Si la réponse contient les informations nécessaires, mettre à jour l'état
        if (data.userDet) {
          setUserDetails(data.userDet);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur:",
          error
        );
      }
    };

    fetchUserDetails();
  }, []); // Déclenche l'effet uniquement si le token de l'utilisateur change

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
            <View style={styles.avatarContainer}>
              <Image
                source={require("../assets/utilisateur.png")}
                style={styles.avatar}
              />
            </View>
            <View style={styles.presentation}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  paddingTop: 5,
                }}
              >
                @{user.username}
              </Text>
              <Text style={{ textAlign: "center", lineHeight: 30 }}>
                Ma coloc: {coloc.name}
              </Text>
              <Text style={{ textAlign: "center", lineHeight: 30 }}>
                Adresse de la coloc: {coloc.address}
              </Text>
              <Text style={{ textAlign: "center", lineHeight: 30 }}>
                🎂{userDetails && userDetails.dateofbirth.split("T")[0]}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.containerInfo}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Informations</Text>
        <View style={styles.infoUser}>
          <Text>Réseaux Sociaux</Text>
          <Text>Tél:{userDetails.phonenumber}</Text>
          <Text>
            Date d'entrée dans la coloc:{" "}
            {userDetails && userDetails.arrivaldate.split("T")[0]}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Badges</Text>
        <Text>{userDetails.badgeearned}</Text>
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
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  presentation: {
    paddingBottom: 130,
  },
});
