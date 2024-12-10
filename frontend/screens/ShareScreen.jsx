import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
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

      
      <TouchableOpacity
        
       style={styles.buttonSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.textSignUp}>Rejoindre </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateColoc')
        }
        style={styles.buttonSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.textSignUp}>Créer </Text>
      </TouchableOpacity>
      </View>
)

}

const styles = StyleSheet.create({
  signinContainer: {
    flex: 1,
    backgroundColor: '#F6F8FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  image: {
    paddingTop:15,
    paddingLeft: 70,
    width: 250,
    height: 150,
  },});