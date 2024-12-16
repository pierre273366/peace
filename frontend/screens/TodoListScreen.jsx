import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Checkbox from "expo-checkbox";

export default function TodoList({ navigation }) {
  const [todos, setTodos] = useState([]); // Tableau pour stocker tous les todos
  const [completedTodos, setCompletedTodos] = useState({}); // Pour suivre l'état des tâches (faites ou non)
  const backendUrl = "http://10.9.1.137:3000";
  const userToken = useSelector((state) => state.users.user.token);

  // Fonction pour formater la date au format "yyyy-mm-dd"
  const formatDateForComparison = (time) => {
    const dateObj = new Date(time);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Format aaaa-mm-jj pour comparaison
  };

  // Fonction pour formater la date au format "dd/mm/yyyy"
  const formatDate = (time) => {
    const dateObj = new Date(time);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // useEffect pour récupérer les todos depuis le backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/todo/recuptodo/${userToken}`
        );
        const data = await response.json();
        if (data.result) {
          const today = formatDateForComparison(new Date()); // Obtenir la date actuelle formatée
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowFormatted = formatDateForComparison(tomorrow);

          // Initialiser les todos et leur état de complétion
          const updatedTodos = data.todos.map((todo) => {
            const nextOccurrenceFormatted = todo.nextOccurrence
              ? formatDateForComparison(todo.nextOccurrence)
              : null;

            // Si la tâche est à la récurrence du jour suivant, décocher la tâche
            let isCompleted = completedTodos[todo._id];
            if (nextOccurrenceFormatted === today) {
              isCompleted = todo.completed; // Garder l'état de complétion comme "complété"
            }
            return { ...todo, isCompleted };
          });

          // Mettre à jour l'état local
          setTodos(updatedTodos);
        } else {
          console.error(
            "Erreur lors de la récupération des todos:",
            data.error
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des todos:", error);
      }
    };

    fetchTodos(); // Lancer la récupération des todos
  }, [userToken, completedTodos]); // Déclencher le useEffect quand completedTodos change

  // Fonction pour calculer la prochaine occurrence en fonction de la récurrence
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

  // Fonction pour marquer une tâche comme terminée
  const toggleTodoCompletion = async (
    _id,
    récurrence,
    date,
    nextOccurrence
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

    // Mettre à jour la tâche dans le backend pour ajouter la prochaine occurrence
    try {
      const response = await fetch(`${backendUrl}/todo/update/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextOccurrence: nextOccurrenceDate,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setCompletedTodos((prev) => ({
          ...prev,
          [_id]: !prev[_id], // Inverser l'état de la tâche
        }));
      } else {
        console.error("Erreur lors de la mise à jour de la tâche:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View style={{ height: "30%" }}>
          <View style={styles.containerBtnTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.iconContainer}
            >
              <FontAwesome
                name={"arrow-circle-left"}
                size={35}
                color="rgb(255, 139, 228)"
              />
            </TouchableOpacity>
            <View style={styles.containerView}>
              <TouchableOpacity
                style={styles.Add}
                onPress={() => navigation.navigate("TodoCrea")}
              >
                <Text style={styles.white}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}
          >
            Todo List
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.todo}>
        <ScrollView>
          {/* Afficher tous les todos récupérés */}
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <View key={index} style={styles.todoItem}>
                <View style={styles.todoHeader}>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 18, marginTop: 10 }}
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
                    value={todo.isCompleted || false} // Utiliser isCompleted pour l'état
                    onValueChange={() =>
                      toggleTodoCompletion(
                        todo._id,
                        todo.récurrence,
                        todo.date,
                        todo.nextOccurrence
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
            <Text style={{ textAlign: "center" }}>Aucun todo disponible</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 255)",
  },
  containerProfil: {
    width: "100%",
  },
  iconContainer: {
    marginLeft: 20,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Add: {
    backgroundColor: "black",
    borderRadius: 50,
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  white: {
    color: "white",
    fontSize: 26,
  },
  todoItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantText: {
    fontSize: 16,
    marginRight: 5,
  },
});
