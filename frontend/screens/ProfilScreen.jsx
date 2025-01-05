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
  ImageBackground,
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
  const backendUrl = "http://192.168.1.20:3000"; // URL du backend
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
      setColocataires(data.users); // Mise à jour l'état avec la liste des colocataires
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
    setSelectedColocataire(null); // Réinitialise l'utilisateur sélectionné
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={require("../assets/backgroundProfil.png")} // Remplacez par votre chemin d'image
          style={styles.imageBackground}
        >
          <View style={styles.containerDescript}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfilParams")}
              style={styles.iconContainer}
            >
              <FontAwesome name={"gear"} size={30} color="#5F5F5F" />
            </TouchableOpacity>
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
              <Text style={{ textAlign: "center", lineHeight: 20 }}>
                <Text style={{ fontWeight: "bold" }}>Ma coloc</Text>:{" "}
                {coloc.name}
              </Text>
              <Text style={{ textAlign: "center", lineHeight: 30 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  Adresse de la coloc:
                </Text>{" "}
                {coloc.address}
              </Text>
              <Text style={{ textAlign: "center", lineHeight: 30 }}>
                🎂
                {userDetails?.dateofbirth && (
                  <>
                    {(() => {
                      const birthDate = new Date(userDetails.dateofbirth);
                      const day = String(birthDate.getDate()).padStart(2, "0"); // Jour (jj)
                      const month = String(birthDate.getMonth() + 1).padStart(
                        2,
                        "0"
                      ); // Mois (mm) - Les mois sont indexés de 0 à 11
                      const year = birthDate.getFullYear(); // Année (aaaa)
                      return `${day}/${month}/${year}`;
                    })()}
                  </>
                )}
              </Text>
              {/* Affichage de la description */}
              <Text
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  marginTop: 5,
                }}
              >
                {userDetails?.description || "Pas de description disponible"}
              </Text>
            </View>
          </View>
        </ImageBackground>

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
            <Text>
              <Text style={{ fontWeight: "bold" }}>Tél:</Text>
              <Text>
                {userDetails?.phonenumber
                  ? ` 0${userDetails.phonenumber}`
                  : "Numéro non disponible"}
              </Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                Date d'entrée dans la coloc:{" "}
              </Text>
              {userDetails?.arrivaldate && (
                <>
                  {(() => {
                    const arrivalDate = new Date(userDetails.arrivaldate);
                    const day = String(arrivalDate.getDate()).padStart(2, "0"); // Jour (jj)
                    const month = String(arrivalDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    ); // Mois (mm)
                    const year = arrivalDate.getFullYear(); // Année (aaaa)
                    return `${day}/${month}/${year}`;
                  })()}
                </>
              )}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Token de ma coloc : </Text>
              {coloc.token}
            </Text>
          </View>
          <View style={styles.mescolocs}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mes colocs</Text>
            {/* Affichage des colocataires sous forme d'images */}
            <ScrollView horizontal>
              {colocataires.length > 0 ? (
                colocataires.map((colocataire, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openColocataireModal(colocataire)} // Ouvre la modal sur clic
                    style={styles.colocataireContainer}
                  >
                    <Image
                      source={
                        colocataire.profilpicture &&
                        colocataire.profilpicture !== "default-image-url"
                          ? { uri: colocataire.profilpicture }
                          : require("../assets/utilisateur2.jpg") // Image par défaut si pas de photo
                      }
                      style={styles.colocAvatar}
                    />
                    <Text style={styles.colocUsername}>
                      {colocataire.username}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Aucun colocataire trouvé.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Modal de détails du colocataire */}
      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedColocataire?.username || "Colocataire inconnu"}
            </Text>
            <Text style={{ lineHeight: 20 }}>
              🎂{" "}
              {selectedColocataire?.dateofbirth &&
                new Date(selectedColocataire.dateofbirth).toLocaleDateString(
                  "fr-FR"
                )}
            </Text>
            <Text style={{ lineHeight: 40 }}>
              {selectedColocataire?.description ||
                "Pas de description disponible"}
            </Text>
            <Text style={{ lineHeight: 20 }}>Réseaux sociaux:</Text>
            <View style={styles.socialContainer}>
              {selectedColocataire?.facebook && (
                <TouchableOpacity
                  onPress={() => openLink(selectedColocataire.facebook)}
                >
                  <FontAwesome
                    name="facebook"
                    size={30}
                    color="#3b5998"
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              )}
              {selectedColocataire?.instagram && (
                <TouchableOpacity
                  onPress={() => openLink(selectedColocataire.instagram)}
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
            <Text style={{ lineHeight: 20 }}>
              Date d'entrée :{" "}
              {selectedColocataire?.arrivaldate &&
                new Date(selectedColocataire.arrivaldate).toLocaleDateString(
                  "fr-FR"
                )}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
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
    backgroundColor: "orange",
  },

  containerDescript: {
    width: 320,
    height: 220,
    backgroundColor: "white",
    marginTop: 140,
    marginLeft: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },

  containerInfo: {
    marginLeft: 20,
  },
  infoUser: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 190,
    padding: 20,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
    overflow: "hidden",
  },

  presentation: {
    paddingBottom: 90,
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
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  colocUsername: {
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageBackground: {
    justifyContent: "center",
    height: "60%",
  },
});
