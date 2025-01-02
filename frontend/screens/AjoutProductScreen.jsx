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
  Dimensions,
} from "react-native";
import Checkbox from "expo-checkbox";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

export default function AjoutProductScreen({ navigation }) {
  const [productName, setProductName] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const colocToken = useSelector((state) => state.users.coloc.token);
  const backendUrl = "http://192.168.1.20:3000";

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom de produit");
      return;
    }

    const response = await fetch(`${backendUrl}/product`, {
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="chevron-left" size={24} color="#FD703C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajout d'un Produit</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="shopping-basket" size={24} color="#FD703C" />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nom du Produit</Text>
            <TextInput
              placeholder="Entrez le nom du produit"
              placeholderTextColor="#999"
              onChangeText={setProductName}
              value={productName}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsUrgent(!isUrgent)}
        >
          <Checkbox
            style={styles.checkbox}
            value={isUrgent}
            onValueChange={setIsUrgent}
            color={isUrgent ? "#FD703C" : undefined}
          />
          <Text style={styles.checkboxLabel}>Urgent ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !productName.trim() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!productName.trim()}
        >
          <Text style={styles.submitButtonText}>Créer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    backgroundColor: "transparent",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333333",
    textAlign: "left",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#333333",
    padding: Platform.OS === "android" ? 0 : 4,
    minHeight: Platform.OS === "android" ? 40 : 35,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333333",
  },
  submitButton: {
    backgroundColor: "#FD703C",
    borderRadius: 25,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    shadowColor: "#FD703C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#FFAB90",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
