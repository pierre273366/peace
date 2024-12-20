import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector"; // Importer ModalSelector

export default function TodoListCrea({ navigation, route }) {
  const [showDatePicker, setShowDatePicker] = useState(false); // Contrôle pour afficher ou non le DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date de l'événement, initialisée à la date actuelle
  const [recurrenceType, setRecurrenceType] = useState("Quotidienne"); // Type de récurrence
  const [selectTache, setSelectTache] = useState("");
  const backendUrl = "https://peace-chi.vercel.app";
  const [tempDate, setTempDate] = useState(new Date()); // Pour stocker la date temporaire pendant la sélection

  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);

  const [users, setUsers] = useState([]); //personnes de la coloc
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [colocId, setColocId] = useState(null);
  const dispatch = useDispatch();

  //RECHERCHE D'UN ID COLOC
  useEffect(() => {
    const getUsers = async () => {
      if (!userToken) return; // Protection si le token n'est pas encore disponible

      const usersData = await fetchUsers(userToken);
      if (usersData) {
        setUsers(usersData);
      }
    };
    getUsers();
  }, [userToken]);

  //fetch de tous les utilisateurs de la colocs
  const fetchUsers = async (userToken) => {
    const response = await fetch(
      `${backendUrl}/tricount/getcolocusers/${userToken}`
    );
    const data = await response.json();

    if (data.result) {
      console.log(data.users);
      return data.users;
    }
    return null;
  };

  const userChoice = users.map((user, i) => {
    return (
      <View key={i} style={styles.containerCheck}>
        <Checkbox
          style={styles.checkbox}
          value={selectedUsers.includes(user._id)}
          onValueChange={() => handleCheckboxChange(user)}
          // Ajoutez ces props pour une meilleure visibilité
          color={selectedUsers.includes(user._id) ? "#FD703C" : undefined}
        />
        <Text>{user.username}</Text>
      </View>
    );
  });

  const handleCheckboxChange = (user) => {
    if (selectedUsers.includes(user._id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user._id]);
    }
  };

  // Fonction pour formater la date au format "JJ/MM/AAAA"
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Les mois commencent à 0 en JavaScript, donc on ajoute 1
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  // Fonction pour calculer la prochaine occurrence en fonction du type de récurrence
  const calculateNextOccurrence = (selectedDate, recurrenceType) => {
    let nextOccurrence = new Date(selectedDate);

    switch (recurrenceType) {
      case "quotidienne":
        nextOccurrence.setDate(nextOccurrence.getDate() + 1); // Ajouter 1 jour pour récurrence quotidienne
        break;
      case "hebdomadaire":
        nextOccurrence.setDate(nextOccurrence.getDate() + 7); // Ajouter 7 jours pour récurrence hebdomadaire
        break;
      case "mensuel":
        nextOccurrence.setMonth(nextOccurrence.getMonth() + 1); // Ajouter 1 mois pour récurrence mensuelle
        break;
      default:
        break;
    }
    return nextOccurrence;
  };

  // Fonction pour gérer la sélection de la date
  // Utilisez une fonction utilitaire pour vérifier si la date est valide
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  // Mise à jour de la date dans `onDateChange` avec vérification
  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;

    // Vérifier si la date est valide avant de la mettre à jour
    if (!isValidDate(currentDate)) {
      console.error("La date sélectionnée est invalide !");
      return; // Empêche de mettre à jour une date invalide
    }

    if (Platform.OS === "android") {
      setSelectedDate(currentDate); // Mise à jour pour Android
      setShowDatePicker(false); // Masquer le DateTimePicker
    } else {
      setTempDate(currentDate); // Mise à jour pour iOS (temporaire avant confirmation)
    }
  };

  // Données pour ModalSelector (types de récurrence)
  const recurrenceOptions = [
    { key: "Quotidienne", label: "Quotidienne" },
    { key: "Hebdomadaire", label: "Hebdomadaire" },
    { key: "Mensuelle", label: "Mensuelle" },
  ];

  const handleSubmit = async () => {
    const response = await fetch(`${backendUrl}/todo/createtodo/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participants: selectedUsers,
        tâche: selectTache,
        date: selectedDate.toISOString().split("T")[0], // Formater la date au format YYYY-MM-DD
        récurrence: recurrenceType,
        colocToken: colocToken,
      }),
    });
    const data = await response.json();

    if (data.result) {
      console.log("Tâche créé !");
      navigation.goBack();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView style={styles.containerProfil}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("TodoList")}
            style={styles.backButton}
          >
            <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Todo List</Text>
        </View>
      </SafeAreaView>

      <View style={styles.containerCrea}>
        <View style={styles.input}>
          <FontAwesome name="users" size={24} color="#FD703C" />
          <View style={styles.inputContent}>
            <View style={styles.participantsHeader}>
              <Text>Participants</Text>
              <TouchableOpacity
                onPress={() => setSelectedUsers(users.map((user) => user._id))}
                style={styles.selectAllButton}
              >
                <Text style={styles.selectAllText}>Tout sélectionner</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.participantsList}>
              {users.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.participantItem}
                  onPress={() => handleCheckboxChange(item)}
                >
                  <View style={styles.participantInfo}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>
                        {item.username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.participantName}>{item.username}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      selectedUsers.includes(item._id) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedUsers.includes(item._id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {selectedUsers.length > 0 && (
              <Text style={styles.selectedCount}>
                {selectedUsers.length} participant
                {selectedUsers.length > 1 ? "s" : ""} sélectionné
                {selectedUsers.length > 1 ? "s" : ""}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.input}>
          <FontAwesome
            name="tasks"
            size={24}
            color="#FD703C"
            style={styles.inputIcon}
          />
          <View style={styles.inputContent}>
            <Text>Nom de la tâche</Text>
            <TextInput
              placeholder="Exemple: Faire les courses"
              value={selectTache}
              onChangeText={setSelectTache}
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.input}>
          <FontAwesome
            name="calendar"
            size={24}
            color="#FD703C"
            style={styles.inputIcon}
          />
          <View style={styles.inputContent}>
            <Text>Sélectionner une date</Text>
            <TouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
                setTempDate(selectedDate);
              }}
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                {Platform.OS === "ios" && (
                  <View style={styles.iosButtonsContainer}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)} // Annuler la sélection
                      style={styles.iosButton}
                    >
                      <Text style={styles.iosButtonTextCancel}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedDate(tempDate); // Valider la date pour iOS
                        setShowDatePicker(false);
                      }}
                      style={styles.iosButton}
                    >
                      <Text style={styles.iosButtonTextConfirm}>Valider</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={Platform.OS === "ios" ? tempDate : selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.input}>
          <FontAwesome
            name="refresh"
            size={24}
            color="#FD703C"
            style={styles.inputIcon}
          />
          <View style={styles.inputContent}>
            <Text>Type de récurrence</Text>
            <ModalSelector
              data={recurrenceOptions}
              initValue={recurrenceType}
              onChange={(option) => setRecurrenceType(option.key)}
              style={styles.modalSelector}
              selectedItemTextStyle={styles.selectedItemText}
            >
              <View style={styles.dateButton}>
                <Text style={styles.dateText}>{recurrenceType}</Text>
              </View>
            </ModalSelector>
            <Text style={styles.nextOccurrence}>
              Prochaine tâche:{" "}
              {formatDate(
                calculateNextOccurrence(selectedDate, recurrenceType)
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.partager}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 255)",
  },
  containerProfil: {
    width: "100%",
    marginBottom: 5, // Réduit l'espace entre le header et le contenu
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  iconContainer: {
    marginLeft: 20,
  },
  backButton: {
    padding: 5,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerCrea: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    alignItems: "center", // Aligne les éléments verticalement au centre
    gap: 15,
    borderRadius: 8,
    width: "90%",
  },
  dateTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
  },
  dateInput: {
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(255, 139, 228)",
    borderRadius: 5,
    marginBottom: 25,
    width: "70%",
  },
  selectedDate: {
    fontSize: 16,
    color: "rgb(0, 0, 0)",
  },
  imageLogo: {
    width: "60%",
    height: undefined,
    aspectRatio: 1.25, // 250/200
    resizeMode: "contain",
    marginTop: Platform.OS === "android" ? 10 : 20,
    marginTop: 100, // Ajoutez cette ligne pour décaler le logo vers le bas
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 200,
  },

  modalSelector: {
    width: "70%",
    marginBottom: 20,
  },
  selectedItemText: {
    fontSize: 16,
    color: "rgb(0, 0, 0)",
  },
  participantsTitle: {
    gap: 20,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
  },
  containerCheck: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  checkbox: {
    color: "red",
  },
  partager: {
    marginTop: 40,
    alignItems: "center",
    width: "50%",
    borderRadius: 50,
    backgroundColor: "#FD703C",
    padding: 25,
  },
  white: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    alignItems: "flex-start",
    gap: 15,
    borderRadius: 8,
    width: "90%",
  },
  inputContent: {
    gap: 10,
    flex: 1,
  },

  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  selectAllButton: {
    padding: 4,
  },
  selectAllText: {
    color: "#FD703C",
    fontSize: 14,
    fontWeight: "600",
  },
  participantsList: {
    width: "100%",
    gap: 10,
  },
  participantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FD703C20",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FD703C",
    fontSize: 18,
    fontWeight: "600",
  },
  participantName: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#FD703C",
    borderColor: "#FD703C",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedCount: {
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
  nextOccurrence: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  dateButton: {
    backgroundColor: "#F7F7FF",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  dateText: {
    fontSize: 16,
  },
  modalSelector: {
    width: "100%",
  },
  datePickerContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginTop: 8,
  },
  datePickerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {
    width: Platform.OS === "ios" ? 320 : undefined, // Largeur fixe pour iOS
    height: Platform.OS === "ios" ? 120 : undefined,
  },
  iosButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iosButton: {
    padding: 8,
    minWidth: 60,
    alignItems: "center",
  },
  iosButtonTextCancel: {
    color: "#666",
    fontSize: 16,
  },
  iosButtonTextConfirm: {
    color: "#FD703C",
    fontSize: 16,
    fontWeight: "600",
  },
});
