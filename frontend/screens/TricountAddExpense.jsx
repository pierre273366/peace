import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import {View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  
} from "react-native";


export default function TricountAddExpense({ navigation, route }) {


  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
    
  const [title, setTitle] = useState('')
  const [value, setValue] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [date, setDate] = useState('')
  const [participants, setParticipants] = useState([]);
  const tricountId = route.params?.tricountId; // Récupération de l'ID
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [userId, setUserId] = useState('');



  useEffect(() => {
    if (tricountId) {
      fetch(`http://10.9.1.140:3000/tricount/tricount-participants/${tricountId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log('Participants:', data.participants);
            setParticipants(data.participants);
          }
        });
    }
    fetchUserId(userToken)
  }, [tricountId]);


//RECUPÉRATION USER id
  const fetchUserId = async (token) => {
    const response = await fetch(`http://10.9.1.140:3000/tricount/user/${token}`);
    const data = await response.json();
    setUserId (data.userId);
    setPaidBy(data.userId)
  };



  const handleParticipantSelection = (participantId) => {
    setSelectedParticipants(prevSelected => {
      if (prevSelected.includes(participantId)) {
        return prevSelected.filter(id => id !== participantId);
      } else {
        return [...prevSelected, participantId];
      }
    });
  };



  const userChoice = participants.map((user, i) => {
    return (
      <View key={i} style={styles.containerCheck}>
        <Checkbox
          style={styles.checkbox}
          value={selectedParticipants.includes(user._id)}
          onValueChange={() => handleParticipantSelection(user._id)}
          // Ajoutez ces props pour une meilleure visibilité
          color={selectedParticipants.includes(user._id) ? '#FD703C' : undefined}
        />
        <Text>{user.username}</Text>
      </View>
    );
  });


  
  // Ensuite, modifiez votre handleSubmit
  const handleSubmit = async () => {
    // Vérification des champs
    if (!title || !value || !date || selectedParticipants.length === 0 || !paidBy) {
      console.log('Veuillez remplir tous les champs');
      return;
    }
  
    // Calcul du montant par personne
    const amountPerPerson = Number(value) / selectedParticipants.length;
  
    // Construction de l'objet expense
    const expenseData = {
      tricountId,
      expense: {
        user: paidBy,
        amount: Number(value),
        description: title,
        expense_date: date,
        share: selectedParticipants.map(participantId => ({
          user: participantId,
          amountToPay: amountPerPerson
        }))
      }
    };
  
    console.log('Données envoyées:', expenseData); // Pour débugger
  
    // Envoi au backend
    fetch('http://10.9.1.140:3000/tricount/add-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        console.log('Dépense ajoutée avec succès:', data);
        navigation.goBack();
      } else {
        console.log('Erreur:', data.error);
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  };

console.log(paidBy)

  return (
    <SafeAreaView  style={styles.container}>
      
      
        <Text style={styles.title}>Ajouter une dépense</Text>

        <View style={styles.containerInput}>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Titre</Text>
                    <TextInput 
                    placeholder="Bière" 
                    onChangeText={(value) => setTitle(value)} 
                    value={title} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Montant</Text>
                    <TextInput 
                    placeholder="300€" 
                    onChangeText={(value) => setValue(value)} 
                    value={value} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
            <Text>⭐️</Text>
            <View style={styles.inputContent}>
                <Text>Payé par</Text>
                <View style={styles.containerPayer}>
                {participants.map((user, i) => (
                    <View key={i} style={styles.payerChoice}>
                    <Checkbox
                        style={styles.checkbox}
                        value={paidBy === user._id}
                        onValueChange={() => setPaidBy(user._id)}
                        color={paidBy === user._id ? '#FD703C' : undefined}
                    />
                    <Text>{user.username}</Text>
                    </View>
                ))}
                </View>
            </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Quand ?</Text>
                    <TextInput 
                    placeholder="12 dec 2024" 
                    onChangeText={(value) => setDate(value)} 
                    value={date} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Participants</Text>

                    <View style={styles.containerCheck}>
                  
                    {userChoice}
                </View>
            </View>

        </View>
        </View>
      
      
        <TouchableOpacity style={styles.partager} onPress={()=> handleSubmit()}>
            <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    alignItems: "center",
  },
  containerInput:{
    width:'100%',
    padding:16,
    gap:15
  },
  input:{
    flexDirection:'row',
    backgroundColor:'white',
    padding:16,
    alignItems:'center',
    gap:15
  },
  inputContent:{
    gap:10
  },
  title:{
    fontSize:24,
    fontWeight:'bold'
  },
  partager:{
    alignItems:'center',
    width:'85%',
    borderRadius:50,
    backgroundColor:'#FD703C',
    padding:25
  },
  white:{
    color:'white',
    fontSize:20,
    fontWeight:'600'
  },
  containerCheck:{
    flexDirection:'row',
    gap: 15,
    alignItems:'center'
  },
  checkbox:{
    color:'red'
  }

  
  
});
