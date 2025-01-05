import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SondageScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);
  const userToken = useSelector((state) => state.users.user.token);
  const colocToken = useSelector((state) => state.users.coloc.token);
  const [sondages, setSondages] = useState([]);
  const backendUrl = "http://192.168.1.11:3000";

  useFocusEffect(
    useCallback(() => {
      fetchSondages();
    }, [])
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const fetchSondages = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/sondage/getSondages/${colocToken}`
      );
      const data = await response.json();

      if (data.result) {
        setSondages(data.sondages);
      } else {
        console.error("Erreur lors de la récupération des sondages");
      }
    } catch (error) {
      console.error("Erreur de fetch:", error.message);
    }
  };

  const fetchVote = async (_id, vote) => {
    try {
      const votes = {
        _id,
        vote,
        userToken: user.token,
      };

      const response = await fetch(`${backendUrl}/sondage/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(votes),
      });
      const data = await response.json();

      if (data.result) {
        fetchSondages();
      }
    } catch (error) {
      console.error("Erreur de fetch:", error.message);
    }
  };

  const fetchDeleteSondage = async (_id) => {
    try {
      const response = await fetch(`${backendUrl}/sondage/deleteSondage`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();

      if (data.result) {
        fetchSondages();
      } else {
        console.error("Erreur: Sondage non supprimé.");
      }
    } catch (error) {
      console.error("Erreur de suppression:", error.message);
    }
  };

  const fetchDeleteVote = async (_id, vote) => {
    try {
      const votes = {
        _id,
        vote,
        userToken: user.token,
      };

      const response = await fetch(`${backendUrl}/sondage/deleteVote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(votes),
      });
      const data = await response.json();

      if (data.result) {
        fetchSondages(colocToken);
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
          style={[
            styles.responseContainer,
            isSelected && styles.selectedResponse,
          ]}
          onPress={() =>
            isSelected
              ? fetchDeleteVote(sondage._id, response)
              : fetchVote(sondage._id, response)
          }
        >
          <View style={styles.responseRow}>
            <Text
              style={[
                styles.responseText,
                isSelected && styles.selectedResponseText,
              ]}
            >
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.iconContainer}
        >
          <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
        </TouchableOpacity>
        <Text style={styles.title1}>Sondages</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateSondage")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {sondages.length === 0 ? (
          <Text style={styles.noSondageText}>Aucun sondage disponible.</Text>
        ) : (
          sondages.map((sondage) => (
            <View key={sondage._id} style={styles.sondageCard}>
              <View style={styles.titleIcon}>
                <Text style={styles.title}>{sondage.title}</Text>
                {sondage.user === user.token && (
                  <TouchableOpacity
                    onPress={() => fetchDeleteSondage(sondage._id)}
                  >
                    <FontAwesome
                      style={styles.icon}
                      name="remove"
                      size={20}
                      color="#FD703C"
                    />
                  </TouchableOpacity>
                )}
              </View>
              {sondage.createdBy && (
                <Text style={styles.createdByText}>
                  Sondage créé par: {sondage.createdBy}
                </Text>
              )}
              <View style={styles.responses}>{allResponses(sondage)}</View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FF",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
    height: 50,
  },
  iconContainer: {
    width: 50,
    justifyContent: "center",
  },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  sondageCard: {
    backgroundColor: "#F7F7FF",
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "black",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -2,
  },
  responses: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  responseContainer: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 10,
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
    fontSize: 16,
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
    height: "100%",
    backgroundColor: "#FD703C",
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  noSondageText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  icon: {
    position: "relative",
  },
  titleIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createdByText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
    fontStyle: "italic",
  },
});
