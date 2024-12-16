import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";


export default function DetailTricount({ navigation, route } ) {


  const userToken = useSelector((state) => state.users.user.token);

    const [selectedOption, setSelectedOption] = useState('depenses'); // 'depenses' ou 'equilibre'
    const [tricountData, setTricountData] = useState(null);
    const tricountId = route.params.tricountId;
    const [userId, setUserId] = useState('');

// Récupération des données du tricount
useEffect(() => {
    fetchTricountData();
    fetchUserId(userToken)
  }, []);

  const fetchTricountData = () => {
    fetch(`http://10.9.1.140:3000/tricount/tricountExpense/${tricountId}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setTricountData(data.tricount);
        }
      });
  };




  //RECUPÉRATION USER id
  const fetchUserId = async (token) => {
    const response = await fetch(`http://10.9.1.105:3000/tricount/user/${token}`);
    const data = await response.json();
    setUserId (data.userId);
  };



// CREATION DES CARD TRICOUNT EN FONCTION DE LA BDD
const ExpenseCards = () => {
    if (!tricountData || !tricountData.expense) {
      return <Text>Aucune dépense</Text>;
    }
  
    return tricountData.expense.map((expense, i) => (
      <View key={i} style={styles.card}>

        <View style={styles.containerContent}>
            <Text style={{fontSize: 30}}>💳</Text>
            <View>
            <Text style={{fontSize:18, fontWeight:'500'}}>{expense.description}</Text>
            <Text style={{fontSize:12, fontWeight:'300'}}>Payé par {expense.user.username}</Text>
            </View>
        </View>

        <Text style={{fontSize:16, fontWeight:'bold'}}>{expense.amount}€</Text>
      </View>
    ));
  };
  


  //BLOC DÉPENSE
  const DepensesView = () => {
    // Calculer le total de toutes les dépenses
    const totalExpenses = tricountData?.expense?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  
    // Calculer le total de mes dépenses (où je suis le payeur)
    const myExpenses = tricountData?.expense?.reduce((acc, curr) => {
      if (curr.user._id === userId) {
        return acc + curr.amount;
      }
      return acc;
    }, 0) || 0;
  
    return (
      <View style={styles.containerDepenseView}>
        <View style={styles.containerDepenses}>
          <View style={styles.depense}>
            <Text>Mes Dépenses</Text>
            <Text style={{fontWeight: 'bold'}}>{myExpenses}€</Text>
          </View>
          <View style={styles.depense}>
            <Text>Total des Dépenses</Text>
            <Text style={{fontWeight: 'bold'}}>{totalExpenses}€</Text>
          </View>
        </View>
  
        <View style={styles.containerCardExpense}>
          <ExpenseCards />
        </View>
      </View>
    );
  };

//BLOC ÉQUILIBRE
const EquilibreView = () => (
    <View>
        <View style={styles.containerDue}>
            <Text>💳</Text>
            <View>
                <Text>Vous devez XX€</Text>
                <Text>à Carla</Text>
            </View>
        </View>
    </View>
);
    
  
    // Affichage principal : Détails du Tricount
    return (
        <SafeAreaView  style={styles.container}>
        <View style={styles.containerView}>
        
        <View style={styles.containerBtnTitle}>
  
          <Text style={styles.title}>{route.params.tricountTitle}</Text>
  
          <TouchableOpacity style={styles.Add} onPress={()=>navigation.navigate("TricountAddExpense" ,{ tricountId: route.params.tricountId })}>
              <Text style={styles.white}>+</Text>
          </TouchableOpacity>
  
        </View>
      </View>
        
        <View style={styles.containerChoice}>

            <TouchableOpacity 
                style={[styles.choice, 
                        selectedOption === 'depenses' && styles.activeChoice]}
                onPress={() => setSelectedOption('depenses')}
            >
                <Text style={selectedOption === 'depenses' ? styles.activeText : styles.inactiveText}>
                    Dépenses
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.choice, 
                    selectedOption === 'equilibre' && styles.activeChoice]}
                    onPress={() => setSelectedOption('equilibre')}
            >
                <Text style={selectedOption === 'equilibre' ? styles.activeText : styles.inactiveText}>
                    Équilibre
                </Text>
            </TouchableOpacity>

        </View>

        {selectedOption === 'depenses' ? <DepensesView /> : <EquilibreView />}
        
  
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        
      },
      containerView:{
        width:'100%',
        padding:16,
      },
      containerText:{
        width:'100%',
        padding:16
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
      },
      containerBtnTitle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    
      },
      Add:{
        backgroundColor:'black',
        borderRadius:50,
        height:56,
        width:56,
        justifyContent:'center',
        alignItems:'center'
      },
      white:{
        color:'white',
        fontSize:26
      },
      containerChoice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#F7F7FF',
        borderRadius: 10,
        width:'75%'
    },
    choice: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    activeChoice: {
        backgroundColor: '#5F6095', 
    },
    inactiveText: {
        color: '#666',
    },
    activeText: {
        color: '#FFF',
        fontWeight: '600',
    },
    containerDepenseView:{
        alignItems:'center'
    },
    containerDepenses:{
        flexDirection:'row',
        justifyContent: 'space-between',
        padding: 5,
        borderRadius: 10,
        width:'65%',
        marginTop: 15
    },
    depense:{
        justifyContent:'center',
        alignItems:'center'
    },
    containerDue:{
        backgroundColor:'#F7F7FF',
        width:'75%'
    },
    containerCardExpense: {
        width: '100%',
        padding: 16,
        gap: 10
      },
      card:{
        flexDirection:'row',
        width:'100%',
        backgroundColor:'#F7F7FF',
        justifyContent:'space-between',
        padding:16,
        alignItems:'center'
      },
      containerContent:{
        flexDirection:'row',
        gap: 15
      },
      name:{
        fontSize:50
      }
    


    
    
      
      
    });
    