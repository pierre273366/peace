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
<Image style={styles.image} source={require('../assets/peacelogo.png')} />
          <TouchableOpacity style={styles.btnCreate} onPress={()=> btnCreate()}>
              <Text style={styles.btnText}>Je crée ma coloc'</Text>
          </TouchableOpacity>
          <Text style={styles.separation}>_____________________  ou  _____________________</Text>
          <TouchableOpacity style={styles.btnJoin} onPress={()=> btnJoin()}>
              <Text style={styles.btnText}>Je rejoins ma coloc'</Text>
          </TouchableOpacity>
      </View>
)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FE',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 150,
  },
  image: {
    width: 300,
    height: 200,
  },
  btnCreate:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 70,
    marginTop: 40,
    marginBottom:30,
    backgroundColor:'#5F6092',
    borderRadius: 40,
  },
btnJoin:{
  alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 70,
    marginTop: 30,
    backgroundColor:'#EC794C',
    borderRadius: 40,
},
btnText:{
  color:"white",
  fontWeight:'bold',
  fontSize: 20,
}
});