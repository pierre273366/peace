import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function HomeScreen({ navigation }) {
  const coloc = useSelector((state) => state.users.coloc);
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const [isChecked, setChecked] = useState(false);
  const [events, setEvents] = useState([]); // Liste des événements
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Date du jour
  const backendUrl = "http://10.9.1.137:3000"; // URL de l'API de ton backend
  const colocToken = useSelector((state) => state.users.coloc.token);
  const [products, setProducts] = useState([]);
  const [todos, setTodos] = useState([]); // Tableau pour stocker tous les todos
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const userToken = useSelector((state) => state.users.user.token);
  const [sondage, setSondage] = useState({});

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

  // useEffect pour récupérer les événements depuis le backend lors du premier rendu du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const dateFormated = new Date(date).toISOString();

        // Récupérer les événements depuis l'API
        const response = await fetch(
          `${backendUrl}/event/${colocToken}/${dateFormated}`
        );

        const data = await response.json();
        console.log(data);
        const formattedEvents = formatEvents(data.eventsOfDay); // Formater les événements avant de les stocker
        console.log(formattedEvents);
        setEvents(formattedEvents); // Mettre à jour l'état avec les événements formatés
      } catch (error) {
        // Si une erreur se produit lors de la récupération des événements
        console.error("Erreur lors de la récupération des événements:", error);
      }
    };
    fetchEvents();
    fetchProducts();
    fetchTodos();
    fetchLastSondage();
  }, []);

  // Fonction pour formater l'heure au format "00h00"
  const formatTime = (time) => {
    const hours = Math.floor(time / 100); // Extraire l'heure (ex: 1430 -> 14)
    const minutes = time % 100; // Extraire les minutes (ex: 1430 -> 30)
    return `${hours.toString().padStart(2, "0")}h${minutes
      .toString()
      .padStart(2, "0")}`; // Format HHhMM (ex: 14h30)
  };

  //FETCH LISTE DE COURSE
  const fetchProducts = async () => {
    if (!colocToken) {
      return;
    }

    try {
      const response = await fetch(
        `http://10.9.1.140:3000/product/getproducts/${colocToken}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  //FETCH TODO LIST
  const formatDateForComparison = (time) => {
    const dateObj = new Date(time);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (time) => {
    const dateObj = new Date(time);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${backendUrl}/todo/recuptodo/${userToken}`);
      const data = await response.json();
      if (data.result) {
        const today = formatDateForComparison(new Date());
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowFormatted = formatDateForComparison(tomorrow);

        const updatedTodos = data.todos.map((todo) => {
          const nextOccurrenceFormatted = todo.nextOccurrence
            ? formatDateForComparison(todo.nextOccurrence)
            : null;

          let isCompleted = todo.completed;
          if (nextOccurrenceFormatted === today) {
            isCompleted = true;
          }

          if (nextOccurrenceFormatted === tomorrowFormatted) {
            isCompleted = false;
          }

          return { ...todo, isCompleted };
        });

        setTodos(updatedTodos);
      } else {
        console.error("Erreur lors de la récupération des todos:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des todos:", error);
    }
  };

  const getNextOccurrence = (date, récurrence, nextOccurrence) => {
    let newDate = nextOccurrence ? new Date(nextOccurrence) : new Date(date);

    if (isNaN(newDate)) {
      console.error("Date invalide pour le calcul de la prochaine occurrence");
      return null;
    }

    switch (récurrence.toLowerCase()) {
      case "quotidienne":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "hebdomadaire":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "mensuelle":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        console.error("Récurrence inconnue:", récurrence);
        return null;
    }

    return newDate;
  };

  const toggleTodoCompletion = async (
    _id,
    récurrence,
    date,
    nextOccurrence,
    isCompleted
  ) => {
    const nextOccurrenceDate = getNextOccurrence(
      date,
      récurrence,
      nextOccurrence
    );

    if (!nextOccurrenceDate) {
      console.error("Prochaine occurrence invalide");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/todo/update/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !isCompleted,
          nextOccurrence: nextOccurrenceDate,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === _id
              ? {
                  ...todo,
                  isCompleted: !isCompleted,
                }
              : todo
          )
        );
      } else {
        console.error("Erreur lors de la mise à jour de la tâche:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };
  
const fetchLastSondage = async () => {
  try {
    const response = await fetch(`http://10.9.1.105:3000/sondage/getLastSondage/${colocToken}`)
    const data = await response.json();
    if(data.result){
      setSondage(data.sondage)
    }
  } catch (error) {
    console.error("Erreur lors du fetch du dernier sondage:", error);
  }
} 

const fetchVote = async (_id, vote) => {
  try {
    const votes = {
      _id,
      vote,
      userToken: user.token,
    };

    const response = await fetch("http://10.9.1.105:3000/sondage/vote", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(votes),
    });
    const data = await response.json();

    if (data.result) {
      fetchLastSondage();
    }
  } catch (error) {
    console.error("Erreur de fetch:", error.message);
  }
};

const fetchDeleteVote = async (_id, vote) => {
  try {
    const votes = {
      _id,
      vote,
      userToken: user.token,
    };


    const response = await fetch("http://10.9.1.105:3000/sondage/deleteVote", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(votes),
    });
    const data = await response.json();

    if (data.result) {
      fetchLastSondage();
    }
  } catch (error) {
    console.error("Erreur de fetch:", error.message);
  }
};


const allResponses = (sondage) => {
    const totalVotes = Object.values(sondage.votes).reduce(
      (acc, votesArray) => acc + votesArray.length,
      0
    );

    return sondage.responses.map((response, i) => {
      const isSelected = sondage.votes[response]?.includes(user.token);
      const percentage = totalVotes
        ? (sondage.votes[response].length / totalVotes) * 100
        : 0;

      return (
        <TouchableOpacity
          key={i}
          style={[styles.responseContainer, isSelected && styles.selectedResponse]}
          onPress={() =>
            isSelected
              ? fetchDeleteVote(sondage._id, response)
              : fetchVote(sondage._id, response)
          }
        >
          <View style={styles.responseRow}>
            <Text style={[styles.responseText, isSelected && styles.selectedResponseText]}>
              {response}
            </Text>
            <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>
        </TouchableOpacity>
      );
    });
  };
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profil}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profil")}
          style={styles.user}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Mon Profil</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerView}>
        <View style={styles.containerText}>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.title}>dans ta coloc {user.username} !</Text>
        </View>
          <View style={styles.containerTodo}>
            <Text style={styles.textEvent}>Todo List</Text>
            <View style={styles.todo}>
              <ScrollView>
                {todos.length > 0 ? (
                  todos.map((todo, index) => (
                    <View key={index} style={styles.todoItem}>
                      <View style={styles.todoHeader}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            marginTop: 10,
                          }}
                        >
                          {todo.participants.map((user, idx) => (
                            <Text key={idx} style={styles.participantText}>
                              {user.username}
                              {idx < todo.participants.length - 1 && ", "}
                            </Text>
                          ))}{" "}
                          {todo.tâche}
                        </Text>
                        <Checkbox
                          style={{ marginRight: 20 }}
                          value={todo.isCompleted || false}
                          onValueChange={() =>
                            toggleTodoCompletion(
                              todo._id,
                              todo.récurrence,
                              todo.date,
                              todo.nextOccurrence,
                              todo.isCompleted
                            )
                          }
                          color={
                            todo.isCompleted
                              ? "rgb(255, 139, 228)"
                              : "lightgray"
                          }
                        />
                      </View>
                      <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: "center" }}>
                    Aucun todo disponible
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        <View style={styles.containerWidget}>

          <View style={styles.containerEvent}>
            <Text style={styles.textEvent}>Événements</Text>
            <View style={styles.descriptionEvent}>
              <ScrollView>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {date}
                </Text>
                {/* Afficher les événements pour la date sélectionnée */}
                {events[date] ? (
                  events[date].map((event, index) => (
                    <View key={index}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          marginTop: 10,
                        }}
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

          <TouchableOpacity
            style={styles.sondage}
            onPress={() => navigation.navigate("Sondage")}
          >
            <Text style={styles.textEvent}>Dernier Sondage</Text>
            {sondage.title &&  (
              <View style={styles.sondageCard}>
              
              <Text style={styles.title}>{sondage.title}</Text>
              
              {sondage.createdBy && (
                <Text style={styles.createdByText}>
                  Sondage créé par: {sondage.createdBy}
                </Text>
              )}
              <View style={styles.scrollSondage}>
                 <ScrollView>
                   <View style={styles.responses}>{allResponses(sondage)}</View>
                   </ScrollView>
                 </View>
            </View>)}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.liste}
            onPress={() => navigation.navigate("GroceryList")}
          >
            <Text style={styles.h2}>Liste de course</Text>
            <ScrollView style={styles.miniList}>
              {products.slice(0, 3).map((product, index) => (
                <View key={product._id} style={styles.miniListItem}>
                  <Text style={styles.miniListText} numberOfLines={1}>
                    • {product.name}
                  </Text>
                </View>
              ))}
              {products.length > 3 && (
                <Text style={styles.miniListMore}>
                  +{products.length - 3} autres produits
                </Text>
              )}
            </ScrollView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roue}
            onPress={() => navigation.navigate("WheelScreen")}
          >
            <Text style={styles.h2}>Roue</Text>
            <View style={styles.decorativeWheelContainer}>
              <Animated.View
                style={[
                  styles.decorativeWheel,
                  {
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {[...Array(6)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.wheelSegment,
                      {
                        transform: [{ rotate: `${i * 60}deg` }],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    alignItems: "center",
  },
  containerView: {
    width: "100%",
  },
  containerText: {
    width: "100%",
  },
  profil: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  user: {
    backgroundColor: "rgb(253, 112, 60)",
    width: 90,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 16,
    fontWeight: "700",
  },
  h2White: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  containerTodo: {
    width: '100%',
    height: 200, 
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  todo: {
    flex: 1,
    width: '100%',
  },
  containerWidget: {
    backgroundColor: "#BEBFF5",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  containerEvent: {
    width: 320,
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "48%",
  },
  textEvent: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "inter",
    fontWeight: "bold",
    color: "#BEBFF5",
    paddingTop: 5,
  },
  descriptionEvent: {
    width: 250,
    height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "scroll",
    alignItems: "center",
    width: "90%",
  },
  sondage: {
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "48%",
  },
  scrollSondage:{
    width:'100%',
    height:115,
  },
  liste: {
    width: 320,
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "48%",
  },
  roue: {
    width: 320,
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "48%",
  },
  wheelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden", // Masque les sections qui dépassent de la roue
    marginBottom: 10,
  },
  section: {
    position: "absolute",
    width: "50%",
    height: "50%",
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
    transformOrigin: "100% 100%", // Centre de rotation
    borderBottomLeftRadius: 150, // Arrondi pour chaque section
    borderBottomRightRadius: 150,
  },
  sectionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    transform: [{ rotate: "-72deg" }], // Rotation inverse pour que le texte soit lisible
    textAlign: "center",
  },
  spinButton: {
    backgroundColor: "#fd703c",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  spinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  decorativeWheelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  decorativeWheel: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#BEBFF5",
    position: "relative",
  },
  wheelSegment: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#ffffff",
    top: "50%",
    left: 0,
    transformOrigin: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9FF",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 100,
    alignItems: "center",
  },
  sondageCard: {
    padding: 5,
    borderRadius: 12,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  responses: {
    width:'100%',
    marginTop: 5,

  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  responseContainer: {
    marginVertical: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
    minHeight:35,
  },
  selectedResponse: {
    borderColor: "#FD703C",
    borderWidth: 2,
  },
  responseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  responseText: {
    fontSize: 10,
    paddingBottom: 10,
    color: "#333",
  },
  selectedResponseText: {
    fontWeight: "bold",
    color: "#5A5A8F",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#EDEDF7",
    borderRadius: 10,
  },
  progressBar: {
    height: "90%",
    backgroundColor: "#FD703C",
    borderRadius:5,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: "600",
    color: "black",
  },
  noSondageText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#333",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  icon:{
    position:'relative',
  },
  titleIcon:{
    flexDirection:'row',
    justifyContent:'space-between',
  }, 
  createdByText:{
    fontSize:10,
  }
});
