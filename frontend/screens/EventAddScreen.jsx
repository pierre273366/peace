import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventAdd = ({ navigation, route }) => {
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fonction pour afficher et gérer la sélection de la date
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  // Lorsque l'utilisateur soumet l'événement
  const handleAddEvent = () => {
    const newEvent = {
      name: eventName,
      time: eventTime,
      place: eventPlace,
      description: eventDescription,
      date: selectedDate.toISOString().split("T")[0], // Formatage de la date
    };

    fetch("http://10.9.1.137:3000/event", {
      method: "POST", // Utilisation de la méthode POST pour envoyer les données au serveur
      headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json()) // Conversion de la réponse du serveur en format JSON
      .then(() => {
        // Envoie de l'événement à la page MyCalendar
        if (route.params?.addEvent) {
          route.params.addEvent(newEvent); // Ajouter l'événement via la fonction addEvent
        }
        // Retour à la page MyCalendar
        navigation.goBack();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l'événement"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Heure de l'événement"
        value={eventTime}
        onChangeText={setEventTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Lieu de l'événement"
        value={eventPlace}
        onChangeText={setEventPlace}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={eventDescription}
        onChangeText={setEventDescription}
      />

      {/* Affichage de la date sélectionnée */}
      <Text style={styles.dateTitle}>Sélectionner une date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={styles.selectedDate}>
          {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* Affichage du DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Bouton pour ajouter l'événement */}
      <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
        <Text style={styles.buttonText}>Ajouter l'événement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    borderColor: "rgb(255, 139, 228)",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
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
  },
  selectedDate: {
    fontSize: 16,
    color: "rgb(0, 0, 0)",
  },
});

export default EventAdd;
