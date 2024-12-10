import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function ShareScreen({ navigation }) {
    // Récupération des données utilisateur et du nom de la colocation depuis le reducer
    const coloc = useSelector((state) => state.users.coloc);

    const colocName = coloc.name; // Récupérer le nom de la colocation
    const colocAddress = coloc.address;
    const colocNumber = coloc.number; 

    const handleSubmit = () => {
    
      
      };
return(

<View style={styles.container}>

    <Image style={styles.image} source={require('../assets/peacelogo.png')} />

        <Text style={styles.input}>{colocName}</Text>
        <Text style={styles.input}>{colocAddress}</Text>
        <Text style={styles.input}>{colocNumber}</Text>
   
   <TouchableOpacity style={styles.btnNext}
    activeOpacity={0.8}>
    <Text style={styles.btnText}>Suivant </Text>
</TouchableOpacity>
      </View>
)

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F8FE',
        flexDirection: 'column'
    },
    image: {
        width: 300,
        height: 200,
    },
    input: {
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
    btnNext: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 70,
        marginTop: 30,
        backgroundColor: '#EC794C',
        borderRadius: 40,
    },
    btnText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 20,
  },
});