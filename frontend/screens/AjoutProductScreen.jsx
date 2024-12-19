import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import Checkbox from "expo-checkbox";

export default function AjoutProductScreen({ navigation }) {
  const [productName, setProductName] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const colocToken = useSelector((state) => state.users.coloc.token);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom de produit");
      return;
    }

    const response = await fetch("http://10.9.1.137:3000/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName,
        isUrgent,
        colocToken,
      }),
    });

    if (response.ok) {
      setProductName("");
      setIsUrgent(false);
      Alert.alert("Succès", "Produit ajouté !");
      navigation.goBack();
    } else {
      Alert.alert("Erreur", "Impossible d'ajouter le produit");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ajout d'un Produit</Text>

      <View style={styles.input}>
        <Text>⭐️</Text>
        <View style={styles.inputContent}>
          <Text>Nom du Produit</Text>
          <TextInput
            placeholder="New city"
            onChangeText={(value) => setProductName(value)}
            value={productName}
            style={styles.inputText}
          />
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={isUrgent}
          onValueChange={setIsUrgent}
        />
        <Text style={styles.checkboxLabel}>Urgent ?</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.partager} onPress={handleSubmit}>
          <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 255)",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  containerView: {
    width: "100%",
    padding: 16,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Add: {
    backgroundColor: "black",
    borderRadius: 28,
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  white: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
    gap: 15,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContent: {
    gap: 10,
    flex: 1,
  },
  inputText: {
    fontSize: 16,
    padding: Platform.OS === 'android' ? 0 : 2,
    minHeight: Platform.OS === 'android' ? 40 : 35,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  checkbox: {
    height: 20,
    width: 20,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: Platform.OS === 'android' ? 40 : 30,
    paddingHorizontal: 16,
  },
  partager: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    borderRadius: 50,
    backgroundColor: "#FD703C",
    padding: Platform.OS === 'android' ? 20 : 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
});