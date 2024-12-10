import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DetailTricount({ route } ) {

    const [selectedOption, setSelectedOption] = useState('depenses'); // 'depenses' ou 'equilibre'



//EXEMPLE EN ATTENDANT LA BDD
  const exempleTricount = [
    {
      "_id": "64b7a12393f1a4e689456abc",
      "title": "Voyage à Paris",
      "participants": [
        "64b7a13e93f1a4e689456abc",
        "64b7a12393f1a4e689456def"
      ],
      "expense": [
        {
          "user_id": "64b7a13e93f1a4e689456abc",
          "amount": 100,
          "description": "Hotel",
          "expense_date": "2024-12-09"
        },
        {
          "user_id": "64b7a12393f1a4e689456def",
          "amount": 50,
          "description": "Transport",
          "expense_date": "2024-12-09"
        }
      ],
      "created_at": "2024-12-09T00:00:00.000Z",
      "updated_at": "2024-12-09T00:00:00.000Z"
    }
  ];



  //BLOC DÉPENSE
  const DepensesView = () => (
    <View>
        <View style={styles.containerDepenses}>
            <View style={styles.depense}>
                <Text>Mes Dépenses</Text>
                <Text style={{fontWeight:'bold'}}>XXX€</Text>
            </View>
            <View style={styles.depense}>
                <Text>Total des Dépenses</Text>
                <Text style={{fontWeight:'bold'}}>XXX€</Text>
            </View>
        </View>
    </View>
);


//BLOC ÉQUILIBRE
const EquilibreView = () => (
    <View>
        <View style={styles.containerDepenses}>
            <View style={styles.depense}>
                <Text>Mes Dépenses</Text>
                <Text style={{fontWeight:'bold'}}>XXX€</Text>
            </View>
            <View style={styles.depense}>
                <Text>Total des Dépenses</Text>
                <Text style={{fontWeight:'bold'}}>XXX€</Text>
            </View>
        </View>
    </View>
);
    
  
    // Affichage principal : Détails du Tricount
    return (
        <SafeAreaView  style={styles.container}>
        <View style={styles.containerView}>
        
        <View style={styles.containerBtnTitle}>
  
          <Text style={styles.title}>TITLE</Text>
  
          <TouchableOpacity style={styles.Add} onPress={()=>navigation.navigate("TricountCrea")}>
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
        backgroundColor: '#f5f5f5',
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
    }


    
    
      
      
    });
    