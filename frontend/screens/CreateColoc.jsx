import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function CreateColocScreen({ navigation }) {

    const user = useSelector((state) => state.users.value);
        const [houseName, setHouseName] = useState("");
        const [address, setAddress] = useState("");
        const [number, setNumber] = useState(0);

        const createBtn = () => {

            const infos = {
                name: houseName, // Envoie le nom de la maison
                address: address, // Envoie l'addresse de la maison'
                peoples: number, //envoie le nombre de coloc
                user:user.token
              }

        fetch("http://10.9.1.105:3000/users/createcoloc", {
            method: "POST", // Utilisation de la méthode POST pour envoyer les données au serveur
            headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
            body: JSON.stringify(infos),
          })
          .then((response) => response.json()) // Conversion de la réponse du serveur en format JSON
          .then((data) => {
          if (data.result) { // Si la réponse contient des données (inscription réussie)
          // Envoie l'action login à Redux pour mettre à jour l'état global de l'utilisateur
          console.log("Réponse du serveur:", data)
          dispatch(
            coloc({
              name: houseName, // Nom de la maison     
            })
          );
          // Réinitialisation des champs du formulaire
          setHouseName("");
          setAddress("");
          setNumber("");

          // Redirection vers la page /partage après l'inscription
          navigation.navigate('ShareScreen');
          console.log(data); // Affiche la réponse du serveur dans la console (utile pour déboguer)
        }else {
          console.log("Aucune donnée retournée du serveur");
        }
      });
    }

      
return(
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/peacelogo.png')} />

      
      <TextInput style={styles.input}
      placeholder="Nome de la maison"
        onChangeText={(value) => setHouseName(value)}
        value={houseName}
      />
      <TextInput style={styles.input}
      placeholder="Adresse"
        onChangeText={(value) => setAddress(value)}
        value={address}
        />
      <TextInput style={styles.input}
      placeholder="Nombre de coloc"
        onChangeText={(value) => setNumber(value)}
        value={number}
       />
      <TouchableOpacity
        onPress={() => createBtn()}
        style={styles.buttonCreate}
        activeOpacity={0.8}
      >
        <Text style={styles.textSignUp}>Suivant </Text>
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
  },
  input:{

  },
  buttonCreate:{
    backgroundColor: 'red'
  }
});