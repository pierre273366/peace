import { useState } from "react";
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(247, 247, 255)",
      }}
    >
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonAdd}>ajout</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        style={{ width: 350, borderRadius: 10, marginBottom: 80 }}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "rgb(253, 112, 60)",
          },
        }}
      />
      <View style={styles.containerEvent}>
        <Text style={styles.textEvent}>Event</Text>
        <View style={styles.descriptionEvent}>
          {selectedDate && (
            <Text style={{ marginTop: 20 }}>Event : {selectedDate}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerEvent: {
    width: 320,
    height: 150,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
  },
  textEvent: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "inter",
    fontWeight: "bold",
    color: "#BEBFF5",
  },
  descriptionEvent: {
    width: 200,
    height: 100,
    backgroundColor: "#BEBFF5",
    borderRadius: 10,
    marginTop: 10,
  },
  containerButton: {
    width: "100%",
    alignItems: "flex-end",
    padding: 50,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "rgb(253, 112, 60)",
    width: 80,
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAdd: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MyCalendar;
