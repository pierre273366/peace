import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

export default function Profil({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const coloc = useSelector((state) => state.users.coloc);
  const [userDetails, setUserDetails] = useState(null);
  const backendUrl = "http://10.9.1.137:3000";
  const userToken = user.token;

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Utilisation de React.useCallback pour la logique de récupération des détails utilisateur
  const fetchUserDetails = React.useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/users/${userToken}`);
      const data = await response.json();

      if (data.userDet) {
        console.log(data.userDet); // Debugging
        setUserDetails(data.userDet);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
    }
  }, [userToken]);

  // Utilisation de useFocusEffect avec React.useCallback pour mémoriser la fonction de récupération
  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails(); // Appel de la fonction pour récupérer les détails utilisateur
    }, [fetchUserDetails]) // Dépendance à la fonction fetchUserDetails
  );

  // Fonction pour ouvrir un lien
  const openLink = React.useCallback((url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Erreur d'ouverture de lien", err)
      );
    }
  }, []);

  if (!userDetails) {
    // Si userDetails n'est pas encore disponible, afficher un message de chargement
    return (
      <View style={styles.loaderContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

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
                🎂
                {userDetails.dateofbirth &&
                  new Date(userDetails.dateofbirth).toISOString().split("T")[0]}
              </Text>
              {/* Affichage de la description */}
              <Text
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  marginTop: 10,
                }}
              >
                {userDetails?.description || "Pas de description disponible"}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Section Réseaux Sociaux */}
      <View style={styles.containerInfo}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Informations</Text>
        <View style={styles.infoUser}>
          <Text>Réseaux Sociaux</Text>
          <View style={styles.socialContainer}>
            {userDetails.facebook && (
              <TouchableOpacity onPress={() => openLink(userDetails.facebook)}>
                <FontAwesome
                  name="facebook"
                  size={30}
                  color="#3b5998"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            )}
            {userDetails.instagram && (
              <TouchableOpacity onPress={() => openLink(userDetails.instagram)}>
                <FontAwesome
                  name="instagram"
                  size={30}
                  color="#C13584"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text>Tél: {userDetails.phonenumber}</Text>
          <Text>
            Date d'entrée dans la coloc:{" "}
            {userDetails.arrivaldate && userDetails.arrivaldate.split("T")[0]}
          </Text>
          <Text>Token de ma coloc :{coloc.token}</Text>
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
    height: 300,
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
    marginTop: 20,
    marginLeft: 20,
    paddingTop: 150,
  },
  infoUser: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 230,
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
  socialContainer: {
    flexDirection: "row",
  },
  socialIcon: {
    padding: 10,
  },
});
