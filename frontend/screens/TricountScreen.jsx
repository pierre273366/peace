import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function TricountScreen({ navigation }) {
  const [tricounts, setTricounts] = useState([]);
  const userToken = useSelector((state) => state.users.user.token);
  const backendUrl = "http://10.9.1.105:3000";

  useFocusEffect(
    useCallback(() => {
      fetchTricounts();
    }, [])
  );

  const fetchTricounts = () => {
    fetch(`${backendUrl}/tricount/recuptricounts/${userToken}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTricounts(data.tricounts);
        }
      });
  };

  const handleDeleteTricount = (tricountId) => {
    console.log("Tentative de suppression du tricount:", tricountId);

    fetch(`${backendUrl}/tricount/delete/${tricountId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: userToken }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Données reçues:", data);
        if (data.result) {
          Alert.alert(
            "Succès",
            data.message || "Tricount supprimé avec succès"
          );
          fetchTricounts();
        } else {
          Alert.alert("Erreur", data.error || "Erreur lors de la suppression");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la suppression");
      });
  };

  const handleNavigateToDetails = (_id, title) => {
    navigation.navigate("DetailTricount", {
      tricountId: _id,
      tricountTitle: title,
    });
  };

  const cardTricount = tricounts.map((data, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.card}
        onPress={() => handleNavigateToDetails(data._id, data.title)}
        onLongPress={() => {
          Alert.alert(
            "Supprimer le tricount",
            `Êtes-vous sûr de vouloir supprimer "${data.title}" ?`,
            [
              {
                text: "Annuler",
                style: "cancel",
              },
              {
                text: "Supprimer",
                onPress: () => handleDeleteTricount(data._id),
                style: "destructive",
              },
            ]
          );
        }}
        delayLongPress={500}
      >
        <Text style={{ fontSize: 30 }}>💳</Text>
        <Text style={styles.name}>{data.title}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>
        <View style={styles.containerBtnTitle}>
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
                            </View>
          <Text style={styles.title}>Tricount</Text>
          <TouchableOpacity
            style={styles.Add}
            onPress={() => navigation.navigate("TricountCrea")}
          >
            <Text style={styles.white}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerCard}>
        {tricounts.length > 0 ? (
          cardTricount
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Vous n'avez pas encore de tricount
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  containerView: {
    width: "100%",
    padding: 16,
  },
  containerText: {
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
  white: {
    color: "white",
    fontSize: 26,
  },
  containerCard: {
    height: "100%",
    width: "100%",
    padding: 16,
    gap: 10,
  },
  card: {
    backgroundColor: "#F7F7FF",
    width: "100%",
    flexDirection: "row",
    padding: 16,
    height: "10%",
    alignItems: "center",
    gap: 15,
  },
  name: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
