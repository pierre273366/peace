import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useFocusEffect } from "@react-navigation/native";

export default function TodoList({ navigation }) {
  const [todos, setTodos] = useState([]); // Tableau pour stocker tous les todos
  const backendUrl = "http://10.9.1.137:3000";
  const userToken = useSelector((state) => state.users.user.token);

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

  const fetchTodos = useCallback(async () => {
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
  }, [userToken]);

  useFocusEffect(
    useCallback(() => {
      fetchTodos(); // Rafraîchir les todos chaque fois que la page est au premier plan
    }, [fetchTodos])
  );

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

  const handleDeleteTodo = (todoId) => {
    console.log("Tentative de suppression de la tache:", todoId);

    fetch(`${backendUrl}/todo/delete/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: userToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Données reçues:", data);
        if (data.result) {
          Alert.alert("Succès", data.message || "Tache supprimée avec succès");

          // Supprimer la tâche de l'état local
          setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo._id !== todoId)
          );
        } else {
          Alert.alert("Erreur", data.error || "Erreur lors de la suppression");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la suppression");
      });
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
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TouchableOpacity
                onPress={() => handleNavigateToDetails(todo._id, todo.tâche)}
                onLongPress={() => {
                  Alert.alert(
                    "Supprimer la tache",
                    `Êtes-vous sûr de vouloir supprimer "${todo.tâche}" ?`,
                    [
                      {
                        text: "Annuler",
                        style: "cancel",
                      },
                      {
                        text: "Supprimer",
                        onPress: () => handleDeleteTodo(todo._id),
                        style: "destructive",
                      },
                    ]
                  );
                }}
                delayLongPress={500}
                key={todo._id}
              >
                <View style={styles.todoItem}>
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
                        todo.isCompleted ? "rgb(255, 139, 228)" : "lightgray"
                      }
                    />
                  </View>
                  <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                </View>
              </TouchableOpacity>
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
