import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EventAdd = ({ navigation, route }) => {
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeError, setTimeError] = useState("");
  const colocToken = useSelector((state) => state.users.coloc.token);
  const backendUrl = "http://10.9.1.105:3000";

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const validateTime = (time) => {
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    if (!timePattern.test(time)) {
      setTimeError("L'heure doit être au format HH:MM (ex: 14:30).");
      return false;
    }
    setTimeError("");
    return true;
  };

  const handleAddEvent = () => {
    if (!validateTime(eventTime)) {
      return;
    }

    const [hour, minutes] = eventTime.split(":").map(Number);

    const newEvent = {
      name: eventName,
      time: hour * 100 + minutes,
      place: eventPlace,
      description: eventDescription,
      date: selectedDate.toISOString().split("T")[0],
      colocToken,
    };

    fetch(`${backendUrl}:3000/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then(() => {
        if (route.params?.addEvent) {
          route.params.addEvent(newEvent);
        }
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de l'événement :", error);
      });
  };

  const handleTimeChange = (text) => {
    let formattedText = text.replace(/[^0-9:]/g, "");
    if (formattedText.length === 2 && !formattedText.includes(":")) {
      formattedText += ":";
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.substring(0, 5);
    }
    setEventTime(formattedText);
  };

  return (
    <View style={styles.container}>
      <View
         style={styles.containerBtnTitle}>
                          <TouchableOpacity
                            onPress={() => navigation.navigate("Agenda")}
                            style={styles.iconContainer}
                          >
                            <FontAwesome
                              name={"arrow-circle-left"}
                              size={35}
                              color="rgb(255, 139, 228)"
                            />
                          </TouchableOpacity>
      </View>
      <Text style={styles.title}>Ajouter un événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l'événement"
        value={eventName}
        onChangeText={setEventName}
      />

      <TextInput
        style={[styles.input, timeError ? styles.inputError : null]}
        placeholder="Heure de l'événement (ex: 14:30)"
        value={eventTime}
        onChangeText={handleTimeChange}
        maxLength={5}
        keyboardType="numeric"
      />
      {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

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
    height: "100%",
    paddingBottom:150,

  },
  containerBtnTitle:{
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
    width: windowWidth * 0.9,
    padding: windowHeight * 0.02,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: windowHeight * 0.02,
    borderColor: "rgb(255, 139, 228)",
    backgroundColor: "white",
    fontSize: Math.min(windowWidth, windowHeight) * 0.04,
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
    backgroundColor: "#ff6347",
    padding: windowHeight * 0.025,
    borderRadius: 15,
    marginTop: windowHeight * 0.03,
    width: windowWidth * 0.9,
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
    backgroundColor: "white",
    padding: windowHeight * 0.025,
    borderWidth: 1,
    borderColor: "rgb(255, 139, 228)",
    borderRadius: 5,
    marginBottom: windowHeight * 0.03,
    width: windowWidth * 0.9,
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
});

export default EventAdd;
