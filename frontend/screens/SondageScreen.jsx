import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function SondageScreen({ navigation }) {
  const [sondages, setSondages] = useState([]);
  
  useFocusEffect( // Permet de rafraichir la page afin de recupérer tous les nouveaux tricounts
    useCallback(() => {
      fetchSondages();
    }, [])
  );

 /* useEffect(() => {
    fetchSondages();
  }, []);*/

  const fetchSondages = async () => {
    try {
      const response = await fetch('http://10.9.1.105:3000/sondage/getSondages');
      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status}`);
        return;
      }
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


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {sondages.length === 0 ? (
          <Text style={styles.noSondageText}>Aucun sondage disponible.</Text>
        ) : (
          sondages.map((item) => (
            <View key={item._id} style={styles.sondageCard}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.responses}>
                {item.responses.map((response, index) => (
                  <Text key={index} style={styles.response}>
                    {response}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateSondage')} // Redirige vers l'écran CreateSondage
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FE",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 80, 
  },
  sondageCard: {
    backgroundColor: "#E6E6FC",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  responses: {
    marginTop: 10,
  },
  response: {
    fontSize: 16,
    color: "#555",
  },
  noSondageText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "black",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});