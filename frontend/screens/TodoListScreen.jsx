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
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekFormatted = formatDateForComparison(nextWeek);

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

          return { ...todo, isCompleted, nextOccurrenceFormatted };
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

  const filterTodos = () => {
    const today = formatDateForComparison(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = formatDateForComparison(tomorrow);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekFormatted = formatDateForComparison(nextWeek);

    const todayTasks = todos.filter(
      (todo) =>
        todo.nextOccurrenceFormatted === today ||
        formatDateForComparison(todo.date) === today
    );
    const tomorrowTasks = todos.filter(
      (todo) =>
        todo.nextOccurrenceFormatted === tomorrowFormatted ||
        formatDateForComparison(todo.date) === tomorrowFormatted
    );
    const nextWeekTasks = todos.filter(
      (todo) =>
        todo.nextOccurrenceFormatted > tomorrowFormatted &&
        todo.nextOccurrenceFormatted <= nextWeekFormatted
    );
    const upcomingTasks = todos.filter(
      (todo) => todo.nextOccurrenceFormatted > nextWeekFormatted
    );

    return { todayTasks, tomorrowTasks, nextWeekTasks, upcomingTasks };
  };

  const { todayTasks, tomorrowTasks, nextWeekTasks, upcomingTasks } =
    filterTodos();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerProfil}>
        <View>
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

            <TouchableOpacity
              style={styles.Add}
              onPress={() => navigation.navigate("TodoCrea")}
            >
              <Text style={styles.white}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
            textAlign: "center",
            paddingBottom: 20,
          }}
        >
          Todo List
        </Text>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tâches d'aujourd'hui */}
        {todayTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Aujourd'hui</Text>
            {todayTasks.map((todo) => (
              <TouchableOpacity
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
                delayLongPress={300}
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
                        <View style={styles.usernameCircle} key={idx}>
                          <Text style={styles.usernameText}>
                            {user.username.substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                      ))}
                    </Text>
                    <View style={styles.todoTextContainer}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {todo.tâche}
                      </Text>
                      <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                    </View>
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
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Tâches de demain */}
        {tomorrowTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Demain</Text>
            {tomorrowTasks.map((todo) => (
              <TouchableOpacity
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
                delayLongPress={300}
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
                        <View style={styles.usernameCircle} key={idx}>
                          <Text style={styles.usernameText}>
                            {user.username.substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                      ))}
                    </Text>
                    <View style={styles.todoTextContainer}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {todo.tâche}
                      </Text>
                      <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                    </View>
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
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Tâches de cette semaine */}
        {nextWeekTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cette semaine</Text>
            {nextWeekTasks.map((todo) => (
              <TouchableOpacity
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
                delayLongPress={300}
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
                        <View style={styles.usernameCircle} key={idx}>
                          <Text style={styles.usernameText}>
                            {user.username.substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                      ))}
                    </Text>
                    <View style={styles.todoTextContainer}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {todo.tâche}
                      </Text>
                      <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                    </View>
                    <Checkbox
                      style={{ marginLeft: 20 }}
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
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Tâches à venir */}
        {upcomingTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>À venir</Text>
            {upcomingTasks.map((todo) => (
              <TouchableOpacity
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
                delayLongPress={300}
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
                        <View style={styles.usernameCircle} key={idx}>
                          <Text style={styles.usernameText}>
                            {user.username.substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                      ))}
                    </Text>
                    <View style={styles.todoTextContainer}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {todo.tâche}
                      </Text>
                      <Text style={{ marginTop: 5 }}>{todo.récurrence}</Text>
                    </View>
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
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
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
    padding: 5,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: "center",
  },
  todoHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  todoTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginRight: 20,
  },
  participantText: {
    fontSize: 19,
    color: "#FD703C",
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  usernameCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FD703C20",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FD703C",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
  },
});
