import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  SafeAreaView,
  SafeAreaProvider,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";

export default function CreateSondageScreen({ navigation }) {
  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
  const userName = useSelector((state) => state.users.user.username);
  const [title, setTitle] = useState("");
  const [responses, setResponses] = useState([""]); // Deux réponses initiales

  // Ajouter un nouveau champ de réponse
  const addInput = () => {
    setResponses([...responses, ""]); // Ajouter une réponse vide au tableau
  };

  // Mettre à jour une réponse spécifique
  const updateResponse = (value, index) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const removeInput = (index) => {
    const newResponses = responses.filter((_, i) => i !== index); // Supprime l'élément à l'index donné
    setResponses(newResponses);
  };
  const submitSondage = async () => {
    const infosSondage = {
      title,
      responses,
      userToken,
      colocToken,
      userName,
    };

    const response = await fetch(
      "http://10.9.1.137:3000/sondage/createSondage",
      {
        method: "POST", // Utilisation de la méthode POST pour envoyer les données au serveur
        headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
        body: JSON.stringify(infosSondage),
      }
    );

    const data = await response.json(); // Conversion de la réponse du serveur en format JSON

    if (data.result) {
      // Réinitialisation des champs du formulaire
      setTitle("");
      setResponses(["", ""]);

      // Redirection vers la page /SondageScreen après l'inscription
      console.log(data); // Affiche la réponse du serveur dans la console (utile pour déboguer)
      navigation.navigate("Sondage");
    } else {
      console.log("Aucune donnée retournée du serveur");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.imageLogo}
        source={require("../assets/peacelogo.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Je crée mon sondage</Text>
      </View>
      <View style={styles.sondageContainer}>
        <View style={styles.bloc}>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            placeholder="Sondage Title"
            value={title}
          />
        </View>
        <View style={styles.blocResponse}>
          {responses.map((response, index) => (
            <View key={index} style={styles.responseRow}>
              <TextInput
                style={styles.input}
                placeholder={`Réponse ${index + 1}`}
                onChangeText={(value) => updateResponse(value, index)}
                value={response}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeInput(index)}
              >
                <FontAwesome
                  style={styles.deleteIcon}
                  name={"remove"}
                  size={20}
                  color="#EC794C"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => addInput()}>
          <Text style={styles.btnText}>Ajouter une réponse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addSondage}
          onPress={() => submitSondage()}
        >
          <Text style={styles.btnTextAdd}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FE",
    alignItems: "center",
    justifyContent: "center",
  },

  imageLogo: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 200,
  },

  addBtn: {
    width: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    paddingTop: 15,
    marginTop: 10,
    paddingLeft: 20,
  },
  addSondage: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    marginBottom: 80,
    marginLeft: 60,
  },
  btnText: {
    color: "#EC794C",
    fontWeight: "bold",
  },
  input: {
    width: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    position: "relative",
    paddingLeft: 20,
  },
  blocResponse: {
    position: "relative",
  },

  deleteButton: {
    position: "absolute",
    right: 20,
    top: 25,
  },
  btnTextAdd: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
