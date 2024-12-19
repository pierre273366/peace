import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar
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
  const backendUrl = "https://peace-chi.vercel.app";


  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

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
      `${backendUrl}/sondage/createSondage`,
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
      <TouchableOpacity
                          onPress={() => navigation.navigate("Sondage")}
                          style={styles.iconContainer}
                        >
                          <FontAwesome
                            name={"chevron-left"}
                            size={35}
                            color="#FD703C"
                          />
                        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  iconContainer: {
    position: 'absolute',
    left: 20,
    top: 50, 
    zIndex: 1,
    alignSelf: 'flex-start',
  },
  imageLogo: {
    width: '60%',
    height: undefined,
    aspectRatio: 1.25, // 250/200
    resizeMode: 'contain',
    marginTop: Platform.OS === 'android' ? 10 : 20,
    marginTop: 100, // Ajoutez cette ligne pour décaler le logo vers le bas
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 200,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
  },
  sondageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bloc: {
    width: '100%',
    alignItems: 'center',
  },
  blocResponse: {
    width: '100%',
    alignItems: 'center',
    position: "relative",
  },
  responseRow: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    maxWidth: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 40, // Espace pour le bouton de suppression
  },
  deleteButton: {
    position: "absolute",
    right: '5%',
    top: 25,
    padding: 5, // Zone de toucher plus grande
  },
  addBtn: {
    width: '100%',
    maxWidth: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 10,
  },
  
  addSondage: {
    width: '60%',
    maxWidth: 200,
    height: 50,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: Platform.OS === 'android' ? 30 : 80,
    elevation: 3, // Pour Android
    shadowColor: "#000", // Pour iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnText: {
    color: "#EC794C",
    fontWeight: "bold",
  },
  btnTextAdd: {
    color: "white",
    fontWeight: "bold",
  },
});