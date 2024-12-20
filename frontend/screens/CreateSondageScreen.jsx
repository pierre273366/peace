import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function CreateSondageScreen({ navigation }) {
  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
  const userName = useSelector((state) => state.users.user.username);
  const [title, setTitle] = useState("");
  const [responses, setResponses] = useState([""]);
  const backendUrl = "https://peace-chi.vercel.app";

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const addInput = () => {
    setResponses([...responses, ""]);
  };

  const updateResponse = (value, index) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const removeInput = (index) => {
    const newResponses = responses.filter((_, i) => i !== index);
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

    const response = await fetch(`${backendUrl}/sondage/createSondage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infosSondage),
    });

    const data = await response.json();

    if (data.result) {
      setTitle("");
      setResponses([""]);
      navigation.navigate("Sondage");
    } else {
      console.log("Aucune donnée retournée du serveur");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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

              <TouchableOpacity style={styles.addBtn} onPress={addInput}>
                <Text style={styles.btnText}>Ajouter une réponse</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addSondage}
                onPress={submitSondage}
              >
                <Text style={styles.btnTextAdd}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F8FE",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F8FE",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  iconContainer: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "android" ? 40 : 10,
    zIndex: 1,
  },
  imageLogo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginTop: Platform.OS === "android" ? 80 : 50,
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  sondageContainer: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  bloc: {
    width: "100%",
    alignItems: "center",
  },
  blocResponse: {
    width: "100%",
    alignItems: "center",
  },
  responseRow: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    maxWidth: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 40,
  },
  deleteButton: {
    position: "absolute",
    right: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addBtn: {
    width: "100%",
    maxWidth: 340,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E6E6FC",
    justifyContent: "center",
    paddingLeft: 20,
    marginTop: 10,
  },
  addSondage: {
    width: "100%",
    maxWidth: 340,
    height: 60,
    backgroundColor: "#EC794C",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
    shadowColor: "#000",
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
    fontSize: 18,
  },
});