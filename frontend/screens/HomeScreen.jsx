import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, {  useRef } from 'react';
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

export default function HomeScreen({ navigation }) {
  const coloc = useSelector((state) => state.users.coloc);
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const [isChecked, setChecked] = useState(false);
  const [events, setEvents] = useState([]); // Liste des événements
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Date du jour
  const backendUrl = "http://10.9.1.137:3000"; // URL de l'API de ton backend
  const colocToken = useSelector((state) => state.users.coloc.token);
  const [products, setProducts] = useState([]);


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
                        le {formatDate(todo.date)} {todo.tâche}
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
                          todo.isCompleted ? "rgb(255, 139, 228)" : "lightgray"
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
            <Text style={styles.h2Wblack}>Sondage</Text>
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

          <TouchableOpacity style={styles.roue} onPress={() => navigation.navigate("WheelScreen")}>
              <Text style={styles.h2}>Roue</Text>
              <View style={styles.decorativeWheelContainer}>
                <Animated.View
                  style={[
                    styles.decorativeWheel,
                    {
                      transform: [{
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg']
                        })
                      }]
                    }
                  ]}
                >
                  {[...Array(6)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.wheelSegment,
                        {
                          transform: [
                            { rotate: `${i * 60}deg` }
                          ]
                        }
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
    height: 50,
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
    width: 320,
    height: 150,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
  },
  todo: {
    marginTop: 15,
    flexDirection: "row",
    gap: 15,
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
    width: 320,
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "48%",
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  decorativeWheel: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#BEBFF5',
    position: 'relative',
  },
  wheelSegment: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#ffffff',
    top: '50%',
    left: 0,
    transformOrigin: 'center',
  },
});

/* const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(new Animated.Value(0)); // Animation de la rotation
  const [isSpinning, setIsSpinning] = useState(false); // Flag pour empêcher les multiples clics avant la fin de l'animation

  // Liste des récompenses
  const rewards = ["Prix 1", "Prix 2", "Prix 3", "Prix 4", "Prix 5"];
  const colors = ["#ff6347", "#fd703c", "#9b59b6", "#2ecc71", "#3498db"]; // Couleurs différentes pour chaque section

  // Fonction pour faire tourner la roue
  const spinWheel = () => {
    if (isSpinning) return; // Empêche de tourner plusieurs fois à la suite avant la fin de l'animation

    setIsSpinning(true); // Démarre l'animation

    const randomDegree = Math.floor(Math.random() * 360); // Angle aléatoire
    const rewardIndex = Math.floor(randomDegree / (360 / rewards.length)); // Calcul de l'index

    // Animation de la roue
    Animated.timing(rotation, {
      toValue: randomDegree + 360 * 8, // Ajouter plusieurs tours pour un effet fluide
      duration: 5000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      // Une fois l'animation terminée, mettre à jour le résultat
      setIsSpinning(false); // Réinitialiser le flag d'animation
      setResult(rewards[rewardIndex]);
    });
  };

  // Calcul de la rotation de la roue
  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });*/
/*<View style={styles.wheelContainer}>
            <Animated.View
              style={[styles.wheel, { transform: [{ rotate: spin }] }]}
            >
              {rewards.map((reward, index) => {
                const angle = (360 / rewards.length) * index; // Angle pour chaque section
                return (
                  <View
                    key={index}
                    style={[
                      styles.section,
                      {
                        transform: [{ rotate: `${angle}deg` }], // Appliquer la rotation pour chaque section
                        backgroundColor: colors[index], // Couleur différente pour chaque section
                      },
                    ]}
                  >
                    <Text style={styles.sectionText}>{reward}</Text>
                  </View>
                );
              })}
            </Animated.View>

            <TouchableOpacity style={styles.spinButton} onPress={spinWheel}>
              <Text style={styles.spinButtonText}>Tourner la roue</Text>
            </TouchableOpacity>

            {result && (
              <Text style={styles.resultText}>Résultat: {result}</Text>
            )}
          </View>*/
