
import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout } from "../reducers/users"; // Importation des actions login et logout de Redux
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Signin() {
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Utilisation du hook useDispatch pour envoyer des actions Redux
  const user = useSelector((state) => state.users.value); // Utilisation du hook useSelector pour accéder à l'état de l'utilisateur dans Redux

  // Déclaration des états locaux pour gérer la fenêtre modale et les valeurs du formulaire
  const [signInUsername, setSignInUsername] = useState(""); // État pour gérer le nom d'utilisateur du formulaire
  const [signInPassword, setSignInPassword] = useState(""); // État pour gérer le mot de passe du formulaire
  const [showPassword, setShowPassword] = useState(false);

  // Fonction qui est appelée lors de la soumission du formulaire de connexion
  const SignInBtn = () => {
    fetch("http://10.9.1.105:3000/users/signin", {
      method: "POST", // Utilisation de la méthode POST pour envoyer les données
      headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
      body: JSON.stringify({
        username: signInUsername, // Envoie du nom d'utilisateur
        password: signInPassword, // Envoie du mot de passe
      }),
    })
      .then((response) => response.json()) // Résultat de la requête transformé en JSON
      .then((data) => {
        console.log(data); // Affiche la réponse du serveur dans la console (utile pour déboguer)
        if (data.result) { // Si la connexion réussie (data.result est true)
          dispatch( // Envoie l'action login à Redux pour mettre à jour l'état global de l'utilisateur
            login({
              username: signInUsername, // Nom d'utilisateur
              token: data.token, // Token reçu du serveur pour authentifier l'utilisateur
              name: data.mail, // Mail de l'utilisateur reçu du serveur
            })
          );
          setSignInUsername(""); // Réinitialisation du champ du nom d'utilisateur
          setSignInPassword(""); // Réinitialisation du champ du mot de passe
          navigation.navigate('TabNavigator')
        }
      });
  };

  const handleSubmit = () => {
    navigation.navigate("Signup");
  };

  return (
    
    <View style={styles.container}>
<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <Image style={styles.image} source={require('../assets/peacelogo.png')} />
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Username"
        onChangeText={(value) => setSignInUsername(value)}
        value={signInUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setSignInPassword(value)}
        value={signInPassword}
        style={styles.input}
        secureTextEntry={!showPassword} // Si showPassword est faux, le texte est masqué
      />
       <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text>{showPassword ? 'Hide' : 'Show'} Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => SignInBtn()}
        style={styles.buttonConnect}
        activeOpacity={0.8}
      >
        <Text style={styles.textButtonConnect}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.buttonSignUp}
        activeOpacity={0.8}
      >
        <View style={styles.textContent}>
        <Text style={styles.textSignUp}>Vous n'avez pas de compte ? </Text>
        <Text style={styles.textButtonSignUp}>S'inscrire</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 150,
  },
  title: {
    width: '80%',
    fontSize: 28,
    fontWeight: '600',
  },
  input: {
    width: 300,
    height: 40,
    marginTop: 25,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    fontSize: 18,
  },
  buttonConnect: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: '#EC794C',
    borderRadius: 30,
    marginBottom: 80,
  },
  buttonSignUp:{
    alignItems: 'center',
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#F6F8FE',
    borderRadius: 10,
    marginBottom: 80,
  },
  textButtonConnect: {
    color: '#ffffff',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
textContent:{
  flex: 1,
  flexDirection: 'row',
},

  textButtonSignUp: {
    color: 'blue',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
  textSignUp:{
    color: 'black',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  }
});


export default Signin; // Exporte le composant Signin pour qu'il puisse être utilisé ailleurs dans l'application
