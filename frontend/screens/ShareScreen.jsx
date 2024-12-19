import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';




export default function ShareScreen({ navigation }) {
    // Récupération des données utilisateur et du nom de la colocation depuis le reducer
    const coloc = useSelector((state) => state.users.coloc);

    const colocName = coloc.name; // Récupérer le nom de la colocation
    const colocAddress = coloc.address;
    const colocNumber = coloc.peoples; 
    const colocToken = coloc.token;

    const handleCopy = async () => {
        await Clipboard.setString(colocToken);
        alert('Texte copié dans le presse-papiers!');
      };

      const nextBtn = () => {
      navigation.navigate('TabNavigator')
      }

return(

<View style={styles.container}>
<TouchableOpacity style={styles.iconReturn}
    activeOpacity={0.8}>
    <FontAwesome
              name={"chevron-left"}
              size={35}
              color="#FD703C"
            />
</TouchableOpacity>
    <Image style={styles.image} source={require('../assets/peacelogo.png')} />
    <Text style={styles.title}>Récap des infos</Text>
    <View style={styles.titleContainer}>
<Text style={styles.textTitle}>Nom de la coloc'</Text>
</View>
<View style={styles.inputContainer}>
        <Text  style={styles.input}>{colocName}</Text>
        <Text style={styles.textTitle}>Adresse de la coloc'</Text>
        <Text style={styles.input}>{colocAddress}</Text>
        <Text style={styles.textTitle}>Nombre de colocataires</Text>
        <Text style={styles.input}>{colocNumber}</Text>
        <Text style={styles.textTitle}>Url à partager</Text>
        <View style={styles.urlInputContainer}>
   <Text style={styles.urlInput}>{colocToken}</Text>
   </View>
   <TouchableOpacity style={styles.iconContainer} onPress={() => handleCopy()}>
   <FontAwesome
              name={'copy'}
              size={20}
              color="#EC794C"
              />
            </TouchableOpacity>
              </View>
   <TouchableOpacity style={styles.btnNext} onPress={() => nextBtn()}
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
        height: 30,
        marginTop:10,
        paddingLeft:10,
        paddingTop:5,
        backgroundColor: 'white',
        fontSize: 18,
        color: 'black',
        fontStyle:'italic'
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
  titleContainer:{
 justifyContent:'flex-start',
  },

  textTitle:{
fontWeight:'bold',
paddingTop: 10,
color:'black',

  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 25,
  },

  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 40,
    backgroundColor: 'white',
    marginTop: 25,
},
urlInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
    color: 'black',
},
iconContainer: {
    position: 'absolute',
    right: 10,
    paddingTop: 233,
},
});