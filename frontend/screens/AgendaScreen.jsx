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
  const backendUrl = "http://10.9.1.137:3000"; // Remplace avec l'URL de ton backend

  // Récupérer les événements depuis le backend au premier rendu
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backendUrl}/event`);
        const data = await response.json();
        const formattedEvents = formatEvents(data);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      }
    };

    fetchEvents();
  }, []);

  // Formater les événements pour le calendrier et l'agenda
  const formatEvents = (eventsData) => {
    const formatted = {};
    eventsData.forEach((event) => {
      const eventDate = event.date; // La date formatée "YYYY-MM-DD"
      if (!formatted[eventDate]) {
        formatted[eventDate] = [];
      }
      formatted[eventDate].push({
        name: event.name,
        time: event.time,
        place: event.place,
        description: event.description,
      });
    });
    return formatted;
  };

  // Fonction pour gérer l'ajout d'un événement
  const handleAddEvent = (newEvent) => {
    // Ajout de l'événement à l'état local des événements
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const eventDate = newEvent.date; // La date sous forme "YYYY-MM-DD"

      // Ajoute le nouvel événement à la date correspondante
      if (!updatedEvents[eventDate]) {
        updatedEvents[eventDate] = [];
      }
      updatedEvents[eventDate].push({
        name: newEvent.name,
        time: newEvent.time,
        place: newEvent.place,
        description: newEvent.description,
      });

      return updatedEvents;
    });
  };

  // Marking des dates avec des événements
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      selected: false,
      marked: true,
      selectedColor: "rgb(253, 112, 60)",
    };
    return acc;
  }, {});

  // Affichage d'un événement dans l'agenda
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
            navigation.navigate("EventAdd", { addEvent: handleAddEvent })
          } // Passer la fonction handleAddEvent à la page EventAdd
          style={styles.button}
        >
          <Text style={styles.buttonAdd}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        markedDates={markedDates} // Afficher les dates marquées avec des événements
        style={{ width: 350, borderRadius: 10, marginBottom: 80 }}
        renderEmptyData={renderEmptyData}
      />

      <Agenda
        items={events} // Afficher les événements dans l'agenda
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
