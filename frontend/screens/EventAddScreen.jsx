import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const EventAdd = ({ route, navigation }) => {
  const { addEvent } = route.params; // Fonction pour ajouter l'événement
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "", // date de l'événement
    time: "",
    place: "",
    description: "",
  });

  // Fonction pour gérer le changement de valeur dans les champs de texte
  const handleInputChange = (field, value) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  // Fonction pour ajouter un événement
  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.time && newEvent.place) {
      // Ajouter l'événement avec la date spécifiée
      addEvent({ ...newEvent });
      navigation.goBack(); // Retourner à la page du calendrier après l'ajout
    } else {
      alert("Tous les champs doivent être remplis !");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Ajouter un événement</Text>

        {/* Champ pour entrer le nom de l'événement */}
        <TextInput
          style={styles.input}
          placeholder="Nom de l'événement"
          value={newEvent.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />

        {/* Champ pour entrer la date de l'événement */}
        <TextInput
          style={styles.input}
          placeholder="Date de l'événement (ex: 20-12-2024)"
          value={newEvent.date}
          onChangeText={(text) => handleInputChange("date", text)}
        />

        {/* Champ pour entrer l'heure de l'événement */}
        <TextInput
          style={styles.input}
          placeholder="Heure de l'événement"
          value={newEvent.time}
          onChangeText={(text) => handleInputChange("time", text)}
        />

        {/* Champ pour entrer le lieu de l'événement */}
        <TextInput
          style={styles.input}
          placeholder="Lieu de l'événement"
          value={newEvent.place}
          onChangeText={(text) => handleInputChange("place", text)}
        />

        {/* Champ pour entrer la description de l'événement */}
        <TextInput
          style={styles.input}
          placeholder="Description de l'événement"
          value={newEvent.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />

        {/* Bouton pour ajouter l'événement */}
        <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(247, 247, 255)",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    width: 100,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default EventAdd;
