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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EventAdd = ({ navigation, route }) => {
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventPlace, setEventPlace] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  const handleAddEvent = () => {
    if (!eventTime) {
      // Gérer le cas où aucune heure n'est sélectionnée
      alert("Veuillez sélectionner une heure");
      return;
    }

    const hours = eventTime.getHours();
    const minutes = eventTime.getMinutes();

    const newEvent = {
      name: eventName,
      time: hours * 100 + minutes,
      place: eventPlace,
      description: eventDescription,
      date: selectedDate.toISOString().split("T")[0],
      colocToken,
    };

    fetch(`${backendUrl}/event`, {
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

  const formatTime = (date) => {
    if (!date) return "";
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const renderTimePickerContent = () => {
    if (!eventTime) {
      return <Text style={styles.placeholder}>Heure de l'événement</Text>;
    }
    return <Text style={styles.selectedTime}>{formatTime(eventTime)}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerBtnTitle}>
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

      {/* Time picker section */}
      {Platform.OS === "ios" ? (
        <>
          {showTimePicker && (
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={eventTime || new Date()}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
              />
              <TouchableOpacity
                style={styles.iosButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.iosButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
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
              value={eventTime || new Date()}
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
    paddingBottom:300,
    paddingTop:50,

  },
  imageLogo:{
height:150
  },

  iconContainer:{
paddingTop: 220,
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
    paddingTop: 12,
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
  selectedTime: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.035,
    color: "rgb(0, 0, 0)",
  },
  placeholder: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.035,
    color: "#666",
  },
});

export default EventAdd;
