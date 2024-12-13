import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";

export default function AjoutProductScreen({ navigation }) {
  const [productName, setProductName] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom de produit");
      return;
    }

    const response = await fetch('http://10.9.1.140:3000/product', { // Remplacez X par votre adresse IP locale
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        isUrgent,
      }),
    });

    if (response.ok) {
      setProductName('');
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
        <TouchableOpacity 
          style={styles.partager} 
          onPress={handleSubmit}
        >
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
  },
  containerView: {
    width: '100%',
    padding: 16,
  },
  containerBtnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Add: {
    backgroundColor: 'black',
    borderRadius: 50,
    height: 56,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  white: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16
  },
  input: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    gap: 15,
    margin: 16,
    borderRadius: 8,
  },
  inputContent: {
    gap: 10,
    flex: 1,
  },
  inputText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  partager: {
    alignItems: 'center',
    width: '85%',
    borderRadius: 50,
    backgroundColor: '#FD703C',
    padding: 25,
  },
});