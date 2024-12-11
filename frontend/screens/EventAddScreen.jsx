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
  // Déclaration des états pour stocker les valeurs des champs
  const [eventName, setEventName] = useState(""); // Nom de l'événement
  const [eventTime, setEventTime] = useState(""); // Heure de l'événement
  const [eventPlace, setEventPlace] = useState(""); // Lieu de l'événement
  const [eventDescription, setEventDescription] = useState(""); // Description de l'événement
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date de l'événement, initialisée à la date actuelle
  const [showDatePicker, setShowDatePicker] = useState(false); // Contrôle pour afficher ou non le DatePicker
  const [timeError, setTimeError] = useState(""); // Message d'erreur si l'heure est mal formatée

  // Fonction pour gérer la sélection de la date
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Fermer le DatePicker après la sélection
    if (selectedDate) {
      setSelectedDate(selectedDate); // Mettre à jour l'état avec la date sélectionnée
    }
  };

  // Fonction de validation du format de l'heure (HH:MM)
  const validateTime = (time) => {
    // Expression régulière pour vérifier le format HH:MM
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;

    // Si le format est incorrect, afficher un message d'erreur
    if (!timePattern.test(time)) {
      setTimeError("L'heure doit être au format HH:MM (ex: 14:30).");
      return false;
    }
    setTimeError(""); // Réinitialiser l'erreur si l'heure est valide
    return true;
  };

  // Fonction de gestion de la soumission de l'événement
  const handleAddEvent = () => {
    // Si l'heure est invalide, ne pas soumettre l'événement
    if (!validateTime(eventTime)) {
      return;
    }

    // Séparer l'heure et les minutes
    const [hour, minutes] = eventTime.split(":").map(Number);

    // Créer un nouvel événement avec les données saisies
    const newEvent = {
      name: eventName,
      time: hour * 100 + minutes, // Convertir l'heure en nombre (ex: "14:30" -> 1430)
      place: eventPlace,
      description: eventDescription,
      date: selectedDate.toISOString().split("T")[0], // Formater la date au format YYYY-MM-DD
    };

    // Envoyer l'événement au backend
    fetch("http://10.9.1.137:3000/event", {
      method: "POST", // Méthode HTTP pour envoyer des données
      headers: { "Content-Type": "application/json" }, // Indiquer que le corps de la requête est du JSON
      body: JSON.stringify(newEvent), // Convertir l'objet en JSON
    })
      .then((response) => response.json()) // Convertir la réponse du serveur en JSON
      .then(() => {
        // Si un événement est ajouté, transmettre les données à la page précédente (MyCalendar)
        if (route.params?.addEvent) {
          route.params.addEvent(newEvent);
        }
        // Retourner à la page précédente après l'ajout
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de l'événement :", error); // Afficher l'erreur en cas de problème
      });
  };

  // Fonction pour gérer le changement dans le champ de l'heure
  const handleTimeChange = (text) => {
    // Supprimer tous les caractères non numériques et ":"
    let formattedText = text.replace(/[^0-9:]/g, "");

    // Ajouter automatiquement ":" entre les heures et les minutes si nécessaire
    if (formattedText.length === 2 && !formattedText.includes(":")) {
      formattedText += ":";
    }

    // Limiter la saisie à 5 caractères au maximum (ex: "14:30")
    if (formattedText.length > 5) {
      formattedText = formattedText.substring(0, 5);
    }

    // Mettre à jour l'état de l'heure avec le texte formaté
    setEventTime(formattedText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un événement</Text>

      {/* Champ de saisie pour le nom de l'événement */}
      <TextInput
        style={styles.input}
        placeholder="Nom de l'événement"
        value={eventName}
        onChangeText={setEventName} // Mettre à jour l'état avec la valeur du texte saisi
      />

      {/* Champ de saisie pour l'heure de l'événement */}
      <TextInput
        style={[styles.input, timeError ? styles.inputError : null]} // Appliquer un style d'erreur si l'heure est incorrecte
        placeholder="Heure de l'événement (ex: 14:30)"
        value={eventTime}
        onChangeText={handleTimeChange} // Appeler handleTimeChange à chaque modification
        maxLength={5} // Limiter la saisie à 5 caractères (format HH:MM)
        keyboardType="numeric" // Afficher un clavier numérique
      />
      {/* Afficher un message d'erreur si l'heure est invalide */}
      {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

      {/* Champ de saisie pour le lieu de l'événement */}
      <TextInput
        style={styles.input}
        placeholder="Lieu de l'événement"
        value={eventPlace}
        onChangeText={setEventPlace} // Mettre à jour l'état avec la valeur du texte saisi
      />

      {/* Champ de saisie pour la description de l'événement */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={eventDescription}
        onChangeText={setEventDescription} // Mettre à jour l'état avec la valeur du texte saisi
      />

      {/* Section de sélection de la date */}
      <Text style={styles.dateTitle}>Sélectionner une date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)} // Ouvrir le DatePicker lors du clic
        style={styles.dateInput}
      >
        <Text style={styles.selectedDate}>
          {selectedDate.toLocaleDateString()}{" "}
          {/* Affichage de la date sélectionnée */}
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

      {/* Bouton pour ajouter l'événement */}
      <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
        <Text style={styles.buttonText}>Ajouter l'événement</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: "rgb(255, 139, 228)",
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "red", // Si l'heure est invalide, changer la bordure en rouge
  },
  errorText: {
    color: "red", // Style pour le texte d'erreur
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff6347", // Couleur du bouton
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff", // Couleur du texte du bouton
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
    width: "100%",
  },
  selectedDate: {
    fontSize: 16,
    color: "rgb(0, 0, 0)",
  },
});

export default EventAdd;
