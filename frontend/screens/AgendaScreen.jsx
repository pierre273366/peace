import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Calendar, Agenda } from "react-native-calendars";

const MyCalendar = ({ navigation, route }) => {
  const [events, setEvents] = useState({});

  // Récupérer les événements passés de EventAdd via les params
  useEffect(() => {
    if (route.params?.events) {
      setEvents(route.params.events); // Mettre à jour les événements
    }
  }, [route.params?.events]);

  // Fonction pour afficher un événement dans le calendrier ou agenda
  const renderItem = (item) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventTime}>{item.time}</Text>
    </View>
  );

  // Message lorsque aucune donnée n'est disponible pour le jour
  const renderEmptyData = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No events for this day</Text>
    </View>
  );

  // Générer les dates marquées dans le calendrier à partir des événements
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      selected: false,
      marked: true,
      selectedColor: "rgb(253, 112, 60)",
    };
    return acc;
  }, {});

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
          onPress={() => navigation.navigate("EventAdd", { events, setEvents })} // Naviguer vers EventAdd avec les events
          style={styles.button}
        >
          <Text style={styles.buttonAdd}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        // Affichage du calendrier sans sélection de dates
        markedDates={markedDates}
        style={{ width: 350, borderRadius: 10, marginBottom: 80 }}
        renderEmptyData={renderEmptyData}
      />

      <Agenda
        items={events}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
      />

      <View style={styles.containerEvent}>
        <Text style={styles.textEvent}>Événements</Text>
        <View style={styles.descriptionEvent}>
          <ScrollView>
            {Object.keys(events).map((date) => (
              <View key={date}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, marginTop: 10 }}
                >
                  {date}
                </Text>
                {events[date].map((event, index) => (
                  <Text key={index} style={{ marginTop: 5 }}>
                    {event.name} à {event.time} à {event.place},{" "}
                    {event.description}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
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
  eventCard: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
});

export default MyCalendar;
