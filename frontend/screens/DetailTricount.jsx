import { useState } from "react";
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


export default function DetailTricount({ navigation }) {

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
  
// CREATION DES CARD TRICOUNT EN FONCTION DE LA BDD
  const cardTricount = exempleTricount.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        
        <Text style={{fontSize:30}}>💳</Text>
          <Text style={styles.name}>{data.title}</Text>
        
      </View>
    );
  });



  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.containerView}>
      
      <View style={styles.containerBtnTitle}>

        <Text style={styles.title}>Tricount</Text>

        <TouchableOpacity style={styles.Add} onPress={()=>  navigation.navigate("TricountCrea")}>
            <Text style={styles.white}>+</Text>
        </TouchableOpacity>

      </View>
    </View>
      
      <View style={styles.containerCard}>
        {cardTricount}
      </View>

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
  containerCard:{
    height:'100%',
    width:'100%',
    padding:16
  },
  card:{
    backgroundColor:'#F7F7FF',
    width:'100%',
    flexDirection:'row',
    padding:16,
    height: '10%',
    alignItems:'center',
    gap:15
  },
  name:{
    fontSize: 16
  }


  
  
});
