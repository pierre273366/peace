
import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, } from 'react-native'
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, updatePhone } from "../reducers/users";
import { updateEmail } from '../reducers/users';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker'


function Signup({navigation}) {
  const dispatch = useDispatch(); // Utilisation du hook useDispatch pour envoyer des actions Redux

  // Déclaration des états locaux pour gérer les valeurs du formulaire
  const [signUpName, setSignUpName] = useState(""); // État pour gérer le nom de l'utilisateur dans le formulaire
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [date, setDate] = useState(new Date())
  const [signUpBirth, setSignUpBirth] = useState("");
  const [signUpFirstColoc, setSignUpFirstColoc] = useState("");
  const [signUpPhone, setSignUpPhone] = useState(""); // État pour gérer le nom d'utilisateur dans le formulaire
  const [signUpPassword, setSignUpPassword] = useState(""); // État pour gérer le mot de passe dans le formulaire
  const [showPassword, setShowPassword] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [show, setShow] = useState(false); // Contrôle l'affichage du picker


  const dateSet = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Ferme le picker sauf sur iOS (iOS nécessite un bouton de validation)
    setDate(currentDate);

    // Formatage de la date (par exemple, DD/MM/YYYY)
    const formatted = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;
    console.log(formatted)
    setSignUpBirth(formatted);
  };

  // Fonction appelée lors de la soumission du formulaire de création de compte
  const SignUpBtn = () => {
    const infos = {
      name: signUpName, // Envoie le nom de l'utilisateur
      username: signUpUsername, // Envoie le nom d'utilisateur
      email: signUpEmail,
      phonenumber: signUpPhone,
      dateofbirth: signUpBirth,
      password: signUpPassword, // Envoie le mot de passe
      firstcoloc: signUpFirstColoc,
    }
    
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  
    if(regexEmail.test(signUpEmail)){
        dispatch(updateEmail(signUpEmail));        
        setEmailInvalid(false)
    }else{
        setEmailInvalid(true)
        return
    }
  
  const regexPhone = /^0[1-9]\d{8}$/

    if(regexPhone.test(signUpPhone)){
      dispatch(updatePhone(signUpPhone));
      setPhoneInvalid(false)
    }else{
      setPhoneInvalid(true)
      return
    }

    fetch("http://10.9.1.105:3000/users/signup", {
      method: "POST", // Utilisation de la méthode POST pour envoyer les données au serveur
      headers: { "Content-Type": "application/json" }, // Indication du type de contenu envoyé (JSON)
      body: JSON.stringify(infos),
    })
      .then((response) => response.json()) // Conversion de la réponse du serveur en format JSON
      .then((data) => {
        if (data.result) {
          // Si la réponse contient des données (inscription réussie)
          // Envoie l'action login à Redux pour mettre à jour l'état global de l'utilisateur
          console.log("Réponse du serveur:", data);
          dispatch(
            login({
              username: signUpUsername, // Nom d'utilisateur
              token: data.token, // Token d'authentification reçu du serveur
            })
          );
          // Réinitialisation des champs du formulaire
          setSignUpName("");
          setSignUpUsername("");
          setSignUpPassword("");
          setSignUpEmail(""),
          setSignUpBirth(""),
          setSignUpPhone(""),
          setSignUpFirstColoc(""),


          // Redirection vers la page /home après l'inscription
          navigation.navigate('Choice');
          console.log(data); // Affiche la réponse du serveur dans la console (utile pour déboguer)
        } else {
          console.log("Aucune donnée retournée du serveur");
        }
      });
  };

  // Fonction pour gérer la checkbox de colocation
  const toggleFirstColoc = () => {
    setSignUpFirstColoc((prev) => (prev === "Yes" ? "No" : "Yes"));
  };



  return (
    
        <View style={styles.signinContainer}>
        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Image style={styles.image} source={require('../assets/peacelogo.png')} />
          <Text style={styles.textAccount}>Inscription</Text>
          <TextInput
            placeholder="Name" // Texte d'invite pour le champ
            
            onChangeText={(value) =>  setSignUpName(value)} // Met à jour l'état signUpName lorsqu'on tape dans le champ
            value={signUpName} // La valeur du champ est liée à l'état signUpName
            style={styles.input} // Application du style CSS spécifique à ce champ
          />
          <TextInput
           placeholder="Username" // Texte d'invite pour le champ
           
           onChangeText={(value) => setSignUpUsername(value)} // Met à jour l'état signUpUsername lorsqu'on tape dans le champ
           value={signUpUsername} // La valeur du champ est liée à l'état signUpUsername
           style={styles.input} // Application du style CSS spécifique à ce champ
          />
          <TextInput
           placeholder="Email" // Texte d'invite pour le champ
           
           onChangeText={(value) => setSignUpEmail(value)} // Met à jour l'état signUpEmail lorsqu'on tape dans le champ
           value={signUpEmail} // La valeur du champ est liée à l'état signUpPassword
           style={styles.input} // Application du style CSS spécifique à ce champ
          />
           { emailInvalid && <Text>Invalid email address</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password" // Texte d'invite pour le champ
            onChangeText={(value) => setSignUpPassword(value)} // Met à jour l'état signUpUsername lorsqu'on tape dans le champ
            value={signUpPassword} // La valeur du champ est liée à l'état signUpUsername
            style={styles.input} // Application du style CSS spécifique à ce champ
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
       <FontAwesome
          name={showPassword ? 'eye-slash' : 'eye'}
          size={20}
          color="#5F5F5F"
        />
      </TouchableOpacity>
      </View>
          <TextInput
        placeholder="PhoneNumber" // Texte d'invite pour le champ
        
        onChangeText={(value) => setSignUpPhone(value)} // Met à jour l'état signUpEmail lorsqu'on tape dans le champ
        value={signUpPhone} // La valeur du champ est liée à l'état signUpPassword
        style={styles.input} // Application du style CSS spécifique à ce champ
          />
           { phoneInvalid && <Text>Invalid phone number</Text>} 
        <View style={styles.date}>
        <DateTimePicker
          value={date} // Date initiale
          mode="date" // Sélectionne uniquement la date
          display="default" // Type d'affichage (default, spinner, calendar)
          onChange={dateSet} // Gestionnaire d'événement
          maximumDate={new Date()} // Empêche la sélection d'une date future
        />
    </View>
          <TouchableOpacity style={styles.checkboxContainer} onPress={toggleFirstColoc}>
            <Text style={styles.checkboxText}>As tu déjà fait de la colocation ?</Text>
            <View style={[styles.checkbox, signUpFirstColoc === "Yes" && styles.checked]}>
              {signUpFirstColoc === "Yes" && <Text style={styles.checkmark}>✔</Text>}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSignup} onPress={() => SignUpBtn()}>
            <Text style={styles.textButtonSignup}>S'inscrire</Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>

  );
}

const styles = StyleSheet.create({
  signinContainer: {
    flex: 1,
    backgroundColor: "#F6F8FE",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  image: {
    paddingTop: 15,
    paddingLeft: 70,
    width: 250,
    height: 150,
  },
  textAccount: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 20,
  },
  input: {
    width: 300,
    height: 40,
    marginTop: 25,
    marginLeft: 10,
    paddingLeft: 15,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    backgroundColor: "white",
    fontSize: 18,
    borderRadius: 15,
  },
  inputContainer: {
    position: "relative",
  },

  iconContainer: {
    position: "absolute",
    right: 20,
    top: 35,
  },

  buttonSignup: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    marginBottom: 80,
    marginLeft: 60,
  },

  textButtonSignup: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 20,
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    fontSize: 16,
    color: "white",
  },
  checkboxText: {
    fontSize: 16,
    paddingLeft: 10,
  },
  date:{
    width: 80,
  }
});

export default Signup; // Exporte le composant Signup pour qu'il puisse être utilisé ailleurs dans l'application
