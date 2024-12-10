import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from 'react-native/Libraries/NewAppScreen';



export default function ChoiceScreen({ navigation }) {

    const btnCreate = () => {
       navigation.navigate("CreateColoc");
      
      };

      const btnJoin = () => {
        navigation.navigate("JoinColoc");
       
       };
return(
    <View style={styles.container}>

          <TouchableOpacity onPress={()=> btnCreate()}>
              <Text>Créer</Text>
          </TouchableOpacity>

          <TouchableOpacity  onPress={()=> btnJoin()}>
              <Text>Rejoindre</Text>
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
    paddingTop:15,
    paddingLeft: 70,
    width: 250,
    height: 150,
  },
  buttonSignUp:{
    marginTop:50
  }
});