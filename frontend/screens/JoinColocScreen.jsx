import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';




export default function JoinColoc({ navigation }) {

    const handleSubmit = () => {
    
      };
    

return(
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/peacelogo.png')} />

      
      <TextInput style={styles.urlInput} placeholder='url de ta coloc'>

      </TextInput>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')
        }
        style={styles.btnNext}
        activeOpacity={0.8}
      >
        <Text style={styles.textBtn}>Suivant </Text>
      </TouchableOpacity>
      </View>
)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  image: {
    width: 300,
    height: 200,
  },
urlInput:{
  width: 300,
        height: 40,
        marginTop: 25,
        marginLeft: 10,
        borderBottomColor: '#ec6e5b',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        fontSize: 18,
        borderRadius: 15,
},
btnNext:{
  alignItems: 'center',
  justifyContent: 'center',
  width: 250,
  height: 70,
  marginTop: 30,
  backgroundColor: '#EC794C',
  borderRadius: 40,
},
textBtn:{
  color: "white",
        fontWeight: 'bold',
        fontSize: 20,
}
});