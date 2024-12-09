import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";

const MyCalendar = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [items, setItems] = useState({});
  const [events, setEvents] = useState({});

  const addEvent = (newEvent) => {
    const newItems = { ...items };
    if (!newItems[selectedDate]) {
      newItems[selectedDate] = [];
    }
    newItems[selectedDate].push(newEvent); // Ajouter l'événement à la date sélectionnée
    setItems(newItems); // Mettre à jour les événements
  };

  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No events for this day</Text>
      </View>
    );
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
    );
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EventAdd", { selectedDate, addEvent })
          }
          style={styles.button}
        >
          <Text style={styles.buttonAdd}>ajout</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        items={items}
        showOnlySelectedDayItems={true}
        renderEmptyData={renderEmptyData}
        style={{ width: 350, borderRadius: 10, marginBottom: 80 }}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: "rgb(253, 112, 60)",
          },
        }}
      />
      <Agenda
        items={items}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
      />
      <View style={styles.containerEvent}>
        <Text style={styles.textEvent}>Event</Text>
        <View style={styles.descriptionEvent}>
          {selectedDate && items[selectedDate] ? (
            items[selectedDate].map((event, index) => (
              <Text key={index} style={{ marginTop: 20 }}>
                {event.name} à {event.time} à {event.place}, {event.description}
              </Text>
            ))
          ) : (
            <Text>No events for this day</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerEvent: {
    width: 320,
    height: 200,
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
    width: 250,
    height: 150,
    backgroundColor: "#BEBFF5",
    borderRadius: 10,
    marginTop: 10,
    overflow: "scroll",
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
