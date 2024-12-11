import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Calendar, Agenda } from "react-native-calendars";

const MyCalendar = ({ navigation }) => {
  // Initialisation des états : un objet `events` pour stocker les événements par date
  // et un `selectedDate` pour la gestion de la date actuellement sélectionnée dans le calendrier.
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const backendUrl = "http://10.9.1.137:3000"; // URL de l'API de ton backend
  const colocToken = useSelector((state) => state.user.coloc.token);

  // useEffect pour récupérer les événements depuis le backend lors du premier rendu du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Récupérer les événements depuis l'API
        const response = await fetch(`${backendUrl}/event/${colocToken}`);
        const data = await response.json();
        const formattedEvents = formatEvents(data.events); // Formater les événements avant de les stocker
        setEvents(formattedEvents); // Mettre à jour l'état avec les événements formatés
      } catch (error) {
        // Si une erreur se produit lors de la récupération des événements
        console.error("Erreur lors de la récupération des événements:", error);
      }
    };

    fetchEvents(); // Lancer la récupération des événements au premier rendu
  }, []); // Le tableau vide [] assure que ce code ne s'exécute qu'une seule fois au premier rendu.

  // Fonction pour formater l'heure au format "00h00"
  const formatTime = (time) => {
    const hours = Math.floor(time / 100); // Extraire l'heure (ex: 1430 -> 14)
    const minutes = time % 100; // Extraire les minutes (ex: 1430 -> 30)
    return `${hours.toString().padStart(2, "0")}h${minutes
      .toString()
      .padStart(2, "0")}`; // Format HHhMM (ex: 14h30)
  };

  // Fonction pour formater les événements récupérés afin de les rendre compatibles avec le calendrier et l'agenda.
  const formatEvents = (eventsData) => {
    const formatted = {}; // Objet où chaque clé est une date au format "YYYY-MM-DD"
    eventsData.forEach((event) => {
      // Formater la date de l'événement en "YYYY-MM-DD"
      const eventDate = new Date(event.date).toISOString().split("T")[0];
      if (!formatted[eventDate]) {
        formatted[eventDate] = []; // Si aucun événement pour cette date, initialiser un tableau.
      }
      // Ajouter l'événement dans le tableau de la date correspondante
      formatted[eventDate].push({
        name: event.name,
        time: event.time,
        place: event.place,
        description: event.description,
      });
    });
    return formatted; // Retourner l'objet formaté.
  };

  // Fonction pour ajouter un événement dans l'état `events` (appelée lors de l'ajout d'un événement)
  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents }; // Créer une copie de l'état précédent
      const eventDate = newEvent.date;

      if (!updatedEvents[eventDate]) {
        updatedEvents[eventDate] = []; // Initialiser un tableau pour la date si ce n'est pas déjà fait
      }
      // Ajouter le nouvel événement à la liste de la date spécifique
      updatedEvents[eventDate].push({
        name: newEvent.name,
        time: newEvent.time,
        place: newEvent.place,
        description: newEvent.description,
      });

      return updatedEvents; // Retourner l'état mis à jour
    });
  };

  // Marquer les dates qui ont des événements sur le calendrier
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      selected: date === selectedDate, // Si la date est sélectionnée, la marquer comme sélectionnée
      marked: true, // Marquer la date sur le calendrier
      selectedColor: "rgb(253, 112, 60)", // Couleur de la date sélectionnée
    };
    return acc; // Retourner l'objet avec toutes les dates marquées
  }, {});

  // Fonction pour afficher un événement dans l'agenda
  const renderItem = (item) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventTime}>{formatTime(item.time)}</Text>
      {/* Affichage de l'heure formatée */}
    </View>
  );

  // Message affiché lorsque aucune donnée n'est disponible pour la journée sélectionnée
  const renderEmptyData = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No events for this day</Text>
    </View>
  );

  // Fonction pour gérer la sélection d'une date dans le calendrier
  const handleDateSelect = (date) => {
    setSelectedDate(date); // Mettre à jour la date sélectionnée
  };

  // Naviguer vers la page d'ajout d'événements lorsque le bouton "Ajouter" est pressé
  const navigateToAddEvent = () => {
    navigation.navigate("EventAdd", { addEvent: handleAddEvent }); // Passer la fonction d'ajout en paramètre
  };

  return (
    <View style={styles.container}>
      {/* Bouton pour ajouter un événement */}
      <View style={styles.containerButton}>
        <TouchableOpacity onPress={navigateToAddEvent} style={styles.button}>
          <Text style={styles.buttonAdd}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Affichage du calendrier */}
      <Calendar
        markedDates={markedDates} // Passer les dates marquées avec des événements
        style={styles.calendar}
        onDayPress={(day) => handleDateSelect(day.dateString)} // Gérer la sélection d'une date
        renderEmptyData={renderEmptyData} // Message lorsque aucune donnée n'est disponible pour la date
      />

      {/* Affichage de l'agenda avec les événements pour la date sélectionnée */}
      <Agenda
        items={events} // Passer l'objet `events` à la prop `items` du composant Agenda
        selected={selectedDate} // La date actuellement sélectionnée
        renderItem={renderItem} // Fonction pour afficher un événement
        renderEmptyData={renderEmptyData} // Message lorsque aucune donnée n'est disponible
      />

      {/* Section pour afficher les événements sous forme de texte */}
      <View style={styles.containerEvent}>
        <Text style={styles.textEvent}>Événements</Text>
        <View style={styles.descriptionEvent}>
          <ScrollView>
            {/* Afficher les événements pour la date sélectionnée */}
            {events[selectedDate] ? (
              events[selectedDate].map((event, index) => (
                <View key={index}>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 18, marginTop: 10 }}
                  >
                    {event.name} à {formatTime(event.time)} {event.place}
                  </Text>
                  <Text style={{ marginTop: 5 }}>{event.description}</Text>
                </View>
              ))
            ) : (
              // Message si aucun événement n'est disponible pour la date sélectionnée
              <Text>Aucun événement pour cette date</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

// Styles pour la mise en page de l'application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(247, 247, 255)",
  },
  containerButton: {
    width: "100%",
    alignItems: "flex-end",
    padding: 50,
    marginTop: 40,
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
  calendar: {
    width: 350,
    borderRadius: 10,
    marginBottom: 80,
  },
  eventCard: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
  },
  containerEvent: {
    width: 320,
    height: 220,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 80,
    paddingTop: 10,
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
    alignItems: "center",
  },
});

export default MyCalendar;
