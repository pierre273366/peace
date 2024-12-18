import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, coloc } from "../reducers/users";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Signin() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.value);

  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Correction de la fonction handleSignIn
  const handleSignIn = () => {
    fetch("http://10.9.1.137:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              username: signInUsername,
              token: data.token,
              name: data.name,
            })
          );

          if (data.hasColoc && data.colocInfo) {
            dispatch(
              coloc({
                name: data.colocInfo.name,
                address: data.colocInfo.address,
                peoples: data.colocInfo.peoples,
                token: data.colocInfo.token,
              })
            );
          }

          setSignInUsername("");
          setSignInPassword("");

          navigation.navigate(data.redirect);
        }
      });
  };

  const handleSubmit = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.image}
            source={require("../assets/peacelogo.png")}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Username"
          onChangeText={(value) => setSignInUsername(value)}
          value={signInUsername}
          style={styles.input}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            onChangeText={(value) => setSignInPassword(value)}
            value={signInPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={windowWidth * 0.05}
              color="#5F5F5F"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSignIn}
          style={styles.buttonConnect}
          activeOpacity={0.8}
        >
          <Text style={styles.textButtonConnect}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
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
    backgroundColor: "#F6F8FE",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: windowHeight * 0.03,
  },
  image: {
    width: windowWidth * 0.9, // Augmenté de 0.6 à 0.7
    height: windowHeight * 0.2, // Augmenté de 0.15 à 0.2
  },
  title: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.07, 
    fontWeight: "600",
    marginBottom: windowHeight * 0.03,
  },
  input: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.07,
    marginTop: windowHeight * 0.02,
    paddingLeft: windowWidth * 0.05,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    backgroundColor: "white",
    fontSize: Math.min(windowWidth, windowHeight) * 0.040, // Augmenté de 0.022 à 0.026
    borderRadius: 15,
  },
  inputContainer: {
    position: "relative",
    width: windowWidth * 0.85,
    alignItems: 'center',
  },
  iconContainer: {
    position: "absolute",
    right: windowWidth * 0.05,
    top: windowHeight * 0.040,
  },
  buttonConnect: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.8, // Augmenté de 0.5 à 0.6
    height: windowHeight * 0.08, // Augmenté de 0.06 à 0.07
    marginTop: windowHeight * 0.04,
    backgroundColor: "#EC794C",
    borderRadius: 40,
    marginBottom: windowHeight * 0.0,
  },
  buttonSignUp: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.5,
    marginTop: windowHeight * 0.01,
    backgroundColor: "#F6F8FE",
    borderRadius: 10,
  },
  textButtonConnect: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: Math.min(windowWidth, windowHeight) * 0.045, // Augmenté de 0.022 à 0.026
  },
  textContent: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonSignUp: {
    color: "blue",
    fontWeight: "600",
    fontSize: Math.min(windowWidth, windowHeight) * 0.030, // Augmenté de 0.022 à 0.026
  },
  textSignUp: {
    color: "black",
    fontWeight: "600",
    fontSize: Math.min(windowWidth, windowHeight) * 0.030, // Augmenté de 0.022 à 0.026
  },
});

export default Signin; // Exporte le composant Signin pour qu'il puisse être utilisé ailleurs dans l'application
