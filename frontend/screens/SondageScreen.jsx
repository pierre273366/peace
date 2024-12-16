import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView,  } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { useCallback } from 'react';

export default function SondageScreen({ navigation }) {
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const [sondages, setSondages] = useState([]);

  useFocusEffect( useCallback(() => {
    // Permet de rafraichir la page afin de récupérer tous les nouveaux sondages
    fetchSondages();

  },[]) );

  const fetchSondages = async () => {
    try {
      const response = await fetch("http://10.9.1.105:3000/sondage/getSondages");
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
        _id ,
        vote ,
        userToken: user.token
      }
const response = await fetch("http://10.9.1.105:3000/sondage/vote", {
  method: "PUT", // Utilisation de la méthode POST pour envoyer les données au serveur
  headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
  body: JSON.stringify(votes),
})
const data = await response.json()
if(data.result){
  fetchSondages();
}
    } catch (error) {
      console.error("Erreur de fetch:", error.message);
    }
  }

  const fetchDeleteVote = async (_id, vote) => {
    try {
      const votes = {
        _id ,
        vote ,
        userToken: user.token
      }
const response = await fetch("http://10.9.1.105:3000/sondage/deleteVote", {
  method: "PUT", // Utilisation de la méthode POST pour envoyer les données au serveur
  headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
  body: JSON.stringify(votes),
})
const data = await response.json()
if(data.result){
  fetchSondages();
}
    } catch (error) {
      console.error("Erreur de fetch:", error.message);
    }
  }

  const calculatePercentages = (totalVotes, totalVotesForOneResponse) => {
    if (totalVotes === 0) return 0; // Évite la division par 0
    const result = (totalVotesForOneResponse * 100 ) / totalVotes
    return result.toFixed(0)
  };

  const allResponses = (sondage) => {
        // Calcul du total des votes
    const totalVotes = Object.values(sondage.votes).reduce(
      (acc, votesArray) => acc + votesArray.length,
      0
    );

    const result =  sondage.responses.map((response, i) => {
      
      return (
   <TouchableOpacity
       key={i}
       style={[
       sondage.votes[response]?.includes(user.token)  && styles.selectedResponse, // Mise en surbrillance de la réponse sélectionnée
       ]}
       onPress={() => sondage.votes[response]?.includes(user.token) ? fetchDeleteVote(sondage._id, response ) : fetchVote(sondage._id, response )} // Gère le clic sur une réponse
     >
       <Text>{response}</Text>
       <Text style={styles.percentageText}>
         {calculatePercentages(totalVotes, sondage.votes[response].length)}% {/* Affiche le pourcentage */}
       </Text>
     </TouchableOpacity> 
  )}) 
   return result
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title1}>Sondages</Text>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {sondages.length === 0 ? (
          <Text style={styles.noSondageText}>Aucun sondage disponible.</Text>
        ) : (
          sondages.map((sondage) => (
            <View key={sondage._id} style={styles.sondageCard}>
              <Text style={styles.title}>{sondage.title}</Text>
              <View style={styles.responses}>
              {allResponses(sondage)}
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
