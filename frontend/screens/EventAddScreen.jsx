import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Récupération des dimensions de l'écran pour gérer les tailles responsives
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EventAdd = ({ navigation, route }) => {
  // Déclaration des états locaux pour gérer les valeurs des champs du formulaire
  const [eventName, setEventName] = useState(""); // Nom de l'événement
  const [eventTime, setEventTime] = useState(new Date()); // Heure de l'événement
  const [timePickerDate, setTimePickerDate] = useState(new Date()); // Date de sélection dans le sélecteur d'heure
  const [showTimePicker, setShowTimePicker] = useState(false); // Affichage ou non du sélecteur d'heure
  const [eventPlace, setEventPlace] = useState(""); // Lieu de l'événement
  const [eventDescription, setEventDescription] = useState(""); // Description de l'événement
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date de l'événement
  const [showDatePicker, setShowDatePicker] = useState(false); // Affichage ou non du sélecteur de date
  const colocToken = useSelector((state) => state.users.coloc.token); // Récupère le token de la colocation depuis Redux
  const backendUrl = "http://192.168.1.20:3000";

  // Fonction appelée lorsque l'utilisateur sélectionne une date dans le sélecteur de date
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      // Sur Android, on ferme le sélecteur après la sélection
      setShowDatePicker(false);
    }
    if (selectedDate) {
      // Si une date est sélectionnée, on met à jour l'état de la date sélectionnée
      setSelectedDate(selectedDate);
    }
  };

  // Fonction appelée lorsque l'utilisateur sélectionne une heure dans le sélecteur d'heure
  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      // Sur Android, on ferme le sélecteur après la sélection
      setShowTimePicker(false);
    }

    if (selectedTime) {
      // Si une heure est sélectionnée, on met à jour l'état de l'heure sélectionnée
      if (Platform.OS === "ios") {
        // Pour iOS, on garde la date de sélection dans un état séparé
        setTimePickerDate(selectedTime);
      } else {
        // Pour Android, l'heure est directement stockée dans `eventTime`
        setEventTime(selectedTime);
      }
    }
  };

  // Fonction appelée pour confirmer l'heure sélectionnée sur iOS
  const handleTimeConfirm = () => {
    setEventTime(timePickerDate); // On met à jour `eventTime` avec la valeur choisie dans `timePickerDate`
    setShowTimePicker(false); // On ferme le sélecteur d'heure
  };

  // Fonction pour ajouter un événement via une requête POST vers le backend
  const handleAddEvent = () => {
    if (!eventTime) {
      // Si l'heure n'est pas sélectionnée, on affiche une alerte
      alert("Veuillez sélectionner une heure");
      return;
    }

    // Récupération des heures et minutes à partir de l'objet Date
    const hours = eventTime.getHours();
    const minutes = eventTime.getMinutes();

    // Création de l'objet de l'événement à envoyer au backend
    const newEvent = {
      name: eventName,
      time: hours * 100 + minutes, // Heure formatée en `HHmm`
      place: eventPlace,
      description: eventDescription,
      date: selectedDate.toISOString().split("T")[0], // Date de l'événement au format ISO (sans l'heure)
      colocToken,
    };

    // Envoi de la requête POST au backend pour ajouter l'événement
    fetch(`${backendUrl}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then(() => {
        // Si la route parent a une fonction `addEvent`, on l'appelle pour mettre à jour les événements dans le parent
        if (route.params?.addEvent) {
          route.params.addEvent(newEvent);
        }
        navigation.goBack(); // On revient à l'écran précédent après l'ajout
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de l'événement :", error); // On affiche l'erreur si l'ajout échoue
      });

    checkKeywordsInName(eventName); // On vérifie si le nom de l'événement contient des mots-clés spéciaux
  };

  // Fonction pour formater l'heure en chaîne de caractères `HH:mm`
  const formatTime = (date) => {
    if (!date) return ""; // Si la date est invalide, on retourne une chaîne vide
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`; // Format de l'heure avec deux chiffres pour les heures et les minutes
  };

  // Rendu conditionnel de l'heure sélectionnée
  const renderTimePickerContent = () => {
    if (!eventTime) {
      // Si l'heure n'est pas définie, afficher un texte de remplacement
      return <Text style={styles.placeholder}>Heure de l'événement</Text>;
    }
    return <Text style={styles.selectedTime}>{formatTime(eventTime)}</Text>; // Sinon, afficher l'heure formatée
  };

  // Fonction pour vérifier si le nom de l'événement contient des mots-clés spécifiques
  const checkKeywordsInName = (name) => {
    if (!name || typeof name !== "string") {
      return; // Si le nom n'est pas une chaîne de caractères, on arrête la fonction
    }

    // Liste de mots-clés à rechercher dans le nom de l'événement
    const motsCles = [
      "soirée",
      "apéro",
      "fête",
      "party",
      "fiesta",
      "anniversaire",
      "noël",
      "réveillon",
      "nouvel an",
    ];

    // Messages associés à chaque mot-clé
    const messages = {
      soirée: [
        "L'apéro est lancé ! 🍹",
        "Soirée en vue ! 🎉",
        "Que la fête commence !🥳",
        "J'espère que tu as pensé aux glaçons 🧊",
      ],
      anniversaire: [
        "Joyeux anniversaire ! 🎂🎉",
        "C'est le grand jour, fête bien ! 🥳",
        "Un an de plus, mais qui compte ! 🎈",
      ],
      noël: ["Joyeux Noël à tous ! 🎄", "Le Père Noël est passé ! 🎅"],
      "nouvel an": [
        "Bonne année ! 🥂",
        "Que 2024 soit encore mieux ! 🎉",
        "Fêtons le début d'une nouvelle année ! 🎆",
      ],
      réveillon: [
        "C'est le réveillon ! 🥳",
        "Célébrons ensemble cette soirée magique ! 🍾",
      ],
    };

    const nameLower = name.toLowerCase(); // On met le nom en minuscule pour comparer sans case-sensitive

    // Recherche des mots-clés dans le nom de l'événement
    for (let mot of motsCles) {
      if (nameLower.includes(mot)) {
        // Si un mot-clé est trouvé dans le nom
        // Choisir un message aléatoire parmi les messages associés à ce mot-clé
        const randomMessage =
          messages[mot][Math.floor(Math.random() * messages[mot].length)];
        Alert.alert("", randomMessage, [{ text: "OK" }]); // Afficher une alerte avec ce message
        return; // On sort de la fonction dès qu'un mot-clé est trouvé
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerBtnTitle}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Agenda")}
          style={styles.iconContainer}
        >
          <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
        </TouchableOpacity>
      </View>

      <Image
        style={styles.imageLogo}
        source={require("../assets/peacelogo.png")}
      />
      <Text style={styles.title}>Je crée un événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l'événement"
        value={eventName}
        onChangeText={setEventName}
      />

      {Platform.OS === "ios" ? (
        <>
          {showTimePicker && (
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={timePickerDate}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
                is24Hour={true}
                minuteInterval={1}
                minimumDate={new Date(1970, 0, 1)}
                maximumDate={new Date(2100, 0, 1)}
              />
              <TouchableOpacity
                style={styles.iosButton}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.iosButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setTimePickerDate(eventTime);
              setShowTimePicker(true);
            }}
            style={styles.timeInput}
          >
            {renderTimePickerContent()}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timeInput}
          >
            {renderTimePickerContent()}
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </>
      )}

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

      <Text style={styles.dateTitle}>Sélectionner une date</Text>
      {Platform.OS === "ios" ? (
        <>
          {showDatePicker && (
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
              <TouchableOpacity
                style={styles.iosButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.iosButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInput}
          >
            <Text style={styles.selectedDate}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInput}
          >
            <Text style={styles.selectedDate}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </>
      )}

      <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
        <Text style={styles.buttonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    paddingBottom: 300,
    paddingTop: 50,
  },
  imageLogo: {
    height: 150,
  },
  iconContainer: {
    paddingTop: 220,
  },
  containerBtnTitle: {
    width: "100%",
    alignItems: "flex-end",
    padding: windowWidth * 0.1,
    marginTop: windowHeight * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.05,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.03,
  },
  input: {
    width: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    position: "relative",
    paddingLeft: 20,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: Math.min(windowWidth, windowHeight) * 0.016,
    marginBottom: windowHeight * 0.01,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    marginBottom: 70,
  },
  buttonText: {
    color: "#fff",
    fontSize: Math.min(windowWidth, windowHeight) * 0.04,
    textAlign: "center",
    fontWeight: "bold",
  },
  dateTitle: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.04,
    marginTop: windowHeight * 0.02,
    fontWeight: "bold",
  },
  dateInput: {
    width: 340,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    paddingLeft: 20,
    padding: windowHeight * 0.025,
    marginBottom: windowHeight * 0.03,
  },
  selectedDate: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.035,
    color: "rgb(0, 0, 0)",
  },
  iosPickerContainer: {
    backgroundColor: "white",
    width: windowWidth * 0.9,
    padding: windowHeight * 0.02,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(255, 139, 228)",
    marginBottom: windowHeight * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iosButton: {
    backgroundColor: "#ff6347",
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.1,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: windowHeight * 0.02,
  },
  iosButtonText: {
    color: "white",
    fontSize: Math.min(windowWidth, windowHeight) * 0.03,
    fontWeight: "600",
  },
  selectedTime: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.035,
    color: "rgb(0, 0, 0)",
  },
  timeInput: {
    width: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    justifyContent: "center", // Centre verticalement
    paddingHorizontal: 20,
  },
  placeholder: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.035,
    color: "#666",
  },
});

export default EventAdd;
