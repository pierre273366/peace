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
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector"; // Importer ModalSelector

export default function TodoListCrea({ navigation, route }) {
  const [showDatePicker, setShowDatePicker] = useState(false); // Contrôle pour afficher ou non le DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date de l'événement, initialisée à la date actuelle
  const [recurrenceType, setRecurrenceType] = useState("Quotidienne"); // Type de récurrence
  const [showRecurrence, setShowRecurrence] = useState(false); // Afficher ou non le choix de récurrence
  const [selectTache, setSelectTache] = useState("");
  const backendUrl = "http://10.9.1.105:3000";

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
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Fermer le DatePicker après la sélection
    if (selectedDate) {
      setSelectedDate(selectedDate); // Mettre à jour l'état avec la date sélectionnée
      setShowRecurrence(true); // Afficher la section de récurrence après avoir sélectionné la date
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
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "20%" }}>
          <View style={styles.containerBtnTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TodoList")}
              style={styles.iconContainer}
            >
              <FontAwesome
                name={"arrow-circle-left"}
                size={35}
                color="rgb(255, 139, 228)"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text
            style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}
          >
            Todo List
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.containerCrea}>
        <View style={styles.userscheck}>
          <Text style={styles.inputContent}>Participants:</Text>
          <View style={styles.containerCheck}>{userChoice}</View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nom de la tâche"
          value={selectTache}
          onChangeText={setSelectTache}
        ></TextInput>
        <Text style={styles.dateTitle}>Sélectionner une date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)} // Ouvrir le DatePicker lors du clic
          style={{ width: "100%", alignItems: "center" }}
        >
          <Text style={styles.input}>
            {formatDate(selectedDate)} {/* Affichage de la date formatée */}
          </Text>
        </TouchableOpacity>

        {/* Afficher le DatePicker si showDatePicker est vrai */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date" // Mode de sélection de date
            display="default" // Affichage par défaut
            onChange={onDateChange} // Gérer la sélection de la date
          />
        )}

        {/* Section de récurrence (affichée après la sélection de la date) */}
        {showRecurrence && (
          <>
            <Text style={styles.dateTitle}>Choisir une récurrence</Text>
            <ModalSelector
              data={recurrenceOptions}
              initValue={recurrenceType}
              onChange={(option) => setRecurrenceType(option.key)}
              style={styles.modalSelector}
              selectedItemTextStyle={styles.selectedItemText}
            />

            {/* Affichage de la prochaine occurrence */}
            <Text style={styles.dateTitle}>Prochaine tâche au:</Text>
            <Text style={styles.selectedDate}>
              {formatDate(
                calculateNextOccurrence(selectedDate, recurrenceType)
              )}
            </Text>
          </>
        )}
        <TouchableOpacity
          style={styles.partager}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>
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
  },
  iconContainer: {
    marginLeft: 20,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerCrea: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "70%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: "rgb(255, 139, 228)",
    backgroundColor: "white",
    textAlign: "center",
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
  modalSelector: {
    width: "70%",
    marginBottom: 20,
  },
  selectedItemText: {
    fontSize: 16,
    color: "rgb(0, 0, 0)",
  },
  userscheck: {
    gap: 20,
    marginBottom: 50,
  },
  inputContent: {
    gap: 20,
    textAlign: "center",
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
});
