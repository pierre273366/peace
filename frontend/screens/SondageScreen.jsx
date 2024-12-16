import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { useCallback } from 'react';

export default function SondageScreen({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const [sondages, setSondages] = useState([]);
  const [votes, setVotes] = useState([]); 
  const [selectedResponses, setSelectedResponses] = useState([]); // Indique la réponse sélectionnée pour chaque sondage

  useFocusEffect( // Permet de rafraichir la page afin de récupérer tous les nouveaux sondages
    useCallback(() => {
      fetchSondages();
    }, [])
  );

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
        setVotes(data.sondages.map((s) => Array(s.responses.length).fill(0))); // Initialise les votes pour chaque sondage
        setSelectedResponses(data.sondages.map(() => null)); // Initialise les réponses sélectionnées pour chaque sondage
      } else {
        console.error("Erreur lors de la récupération des sondages");
      }
    } catch (error) {
      console.error("Erreur de fetch:", error.message);
    }
  };

  const handleVote = (sondageIndex, responseIndex) => {
    // Ne permet pas de revoter pour un sondage si une réponse a déjà été sélectionnée
    if (selectedResponses[sondageIndex] !== null) return;

    // Enregistre la réponse sélectionnée pour ce sondage
    const newSelectedResponses = [...selectedResponses];
    newSelectedResponses[sondageIndex] = responseIndex;
    setSelectedResponses(newSelectedResponses);

    // Met à jour les votes pour ce sondage
    const updatedVotes = [...votes];
    updatedVotes[sondageIndex][responseIndex] = (updatedVotes[sondageIndex][responseIndex] || 0) + 1;
    setVotes(updatedVotes);
  };

  const calculatePercentages = (sondageIndex) => {
    const totalVotes = votes[sondageIndex].reduce((sum, count) => sum + count, 0);
    if (totalVotes === 0) return votes[sondageIndex].map(() => 0); // Evite la division par zéro
    return votes[sondageIndex].map((count) => Math.round((count / totalVotes) * 100));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title1}>Sondages</Text>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {sondages.length === 0 ? (
          <Text style={styles.noSondageText}>Aucun sondage disponible.</Text>
        ) : (
          sondages.map((item, sondageIndex) => (
            <View key={item._id} style={styles.sondageCard}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.responses}>
                {item.responses.map((response, responseIndex) => (
                  <TouchableOpacity
                    key={responseIndex}
                    style={[
                      styles.responseContainer,
                      selectedResponses[sondageIndex] === responseIndex && styles.selectedResponse, // Mise en surbrillance de la réponse sélectionnée
                    ]}
                    onPress={() => handleVote(sondageIndex, responseIndex)} // Gère le clic sur une réponse
                    disabled={selectedResponses[sondageIndex] !== null} // Désactive les réponses après un vote
                  >
                    <Text>{response}</Text>
                    <Text style={styles.percentageText}>
                      {calculatePercentages(sondageIndex)[responseIndex]}% {/* Affiche le pourcentage */}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateSondage')} 
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FE",
    justifyContent: 'center',
    alignItems:'center',
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
  title1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingBottom: 20,
    paddingTop:20,
    
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
  responseContainer: {
    marginVertical: 5, 
    padding: 10,
    backgroundColor: "#F6F8FE",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedResponse: {
    backgroundColor: "#EC794C", 
  },
  percentageText: {
    marginTop: 5,
    fontSize: 14,
    color: "#555", 
  },
});
