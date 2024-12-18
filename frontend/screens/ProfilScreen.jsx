import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ProfilPicture from "../components/profilPicture";

export default function Profil({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const coloc = useSelector((state) => state.users.coloc); // Détails de la coloc
  const [userDetails, setUserDetails] = useState(null); // Détails utilisateur
  const [colocataires, setColocataires] = useState([]); // Liste des colocataires
  const [modalVisible, setModalVisible] = useState(false); // Etat pour la modal
  const [selectedColocataire, setSelectedColocataire] = useState(null); // Colocataire sélectionné pour la modal
  const backendUrl = "http://10.9.1.137:3000"; // URL du backend
  const userToken = user.token;

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Fonction pour récupérer les détails de l'utilisateur
  const fetchUserDetails = React.useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/users/${userToken}`);
      const data = await response.json();
      if (data.userDet) {
        setUserDetails(data.userDet);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
    }
  }, [userToken]);

  // Fetch de tous les utilisateurs de la coloc
  const fetchColocataires = async (userToken) => {
    const response = await fetch(
      `${backendUrl}/tricount/getcolocusers/${userToken}`
    );
    const data = await response.json();

    if (data.result) {
      console.log(data.users);
      setColocataires(data.users); // Mettez à jour l'état avec la liste des colocataires
    } else {
      console.error(
        "Erreur lors de la récupération des colocataires:",
        data.error
      );
    }
  };

  // Fonction pour ouvrir un lien
  const openLink = React.useCallback((url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Erreur d'ouverture de lien", err)
      );
    }
  }, []);

  // Utilisation de useFocusEffect avec React.useCallback pour mémoriser la fonction de récupération
  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails(); // Appel de la fonction pour récupérer les détails utilisateur
      fetchColocataires(userToken); // Appel de la fonction pour récupérer les colocataires
    }, [userToken]) // Dépendance sur userToken
  );

  // Fonction pour ouvrir la modal avec les informations du colocataire sélectionné
  const openColocataireModal = (colocataire) => {
    setSelectedColocataire(colocataire); // Met à jour le colocataire sélectionné
    setModalVisible(true); // Affiche la modal
  };

  // Fonction pour fermer la modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedColocataire(null); // Réinitialiser l'utilisateur sélectionné
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
                <ProfilPicture profilpicture={userDetails?.profilpicture} />
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
                  {userDetails?.dateofbirth &&
                    new Date(userDetails.dateofbirth)
                      .toISOString()
                      .split("T")[0]}
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
              {userDetails && userDetails.facebook && (
                <TouchableOpacity
                  onPress={() => openLink(userDetails && userDetails.facebook)}
                >
                  <FontAwesome
                    name="facebook"
                    size={30}
                    color="#3b5998"
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              )}
              {userDetails && userDetails.instagram && (
                <TouchableOpacity
                  onPress={() => openLink(userDetails && userDetails.instagram)}
                >
                  <FontAwesome
                    name="instagram"
                    size={30}
                    color="#C13584"
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text>Tél: {userDetails?.phonenumber}</Text>
            <Text>
              Date d'entrée dans la coloc:{" "}
              {userDetails?.arrivaldate &&
                userDetails.arrivaldate.split("T")[0]}
            </Text>
            <Text>Token de ma coloc :{coloc.token}</Text>
          </View>
          <View style={styles.mescolocs}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mes colocs</Text>
            {/* Affichage des colocataires sous forme d'images */}
            {colocataires.length > 0 ? (
              <ScrollView horizontal>
                {colocataires.map((colocataire, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openColocataireModal(colocataire)} // Ouvre la modal sur clic
                    style={styles.colocataireContainer}
                  >
                    <Image
                      source={
                        colocataire.profilpicture &&
                        colocataire.profilpicture !== "default-image-url"
                          ? { uri: colocataire.profilpicture } // Assurez-vous que l'URL est correcte
                          : require("../assets/utilisateur.png") // Image par défaut si pas de photo
                      }
                      style={styles.colocAvatar}
                    />
                    <Text style={styles.colocUsername}>
                      {colocataire.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text>Aucun colocataire trouvé.</Text>
            )}
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            Badges
          </Text>
          <Text style={{ marginTop: 20 }}>
            {userDetails?.badgeearned || "Aucun badge disponible"}
          </Text>
        </View>
      </ScrollView>

      {/* Modal de détails du colocataire */}
      <Modal
        visible={modalVisible}
        onRequestClose={closeModal} // Ferme la modal quand l'utilisateur appuie en dehors
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedColocataire?.username}
            </Text>
            <Text>
              🎂{" "}
              {userDetails?.dateofbirth &&
                new Date(userDetails.dateofbirth).toISOString().split("T")[0]}
            </Text>
            <Text>
              {" "}
              {userDetails?.description || "Pas de description disponible"}
            </Text>
            <Text>Réseaux sociaux:</Text>
            <View style={styles.socialContainer}>
              {userDetails?.facebook && (
                <TouchableOpacity
                  onPress={() => openLink(userDetails.facebook)}
                >
                  <FontAwesome
                    name="facebook"
                    size={30}
                    color="#3b5998"
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              )}
              {userDetails?.instagram && (
                <TouchableOpacity
                  onPress={() => openLink(userDetails.instagram)}
                >
                  <FontAwesome
                    name="instagram"
                    size={30}
                    color="#C13584"
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text>
              Date d'entrée :{" "}
              {userDetails?.arrivaldate &&
                userDetails.arrivaldate.split("T")[0]}
            </Text>
            <Button title="Fermer" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
  mescolocs: {
    marginTop: 10,
  },
  colocataireContainer: {
    alignItems: "center",
    marginRight: 20,
    marginTop: 20,
  },
  colocAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  colocUsername: {
    textAlign: "center",
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
