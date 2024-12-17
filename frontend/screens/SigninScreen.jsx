import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, coloc } from "../reducers/users";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function Signin() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.value);

  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Correction de la fonction handleSignIn
  const handleSignIn = () => {
    fetch("http://10.9.1.140:3000/users/signin", {
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
      >
        <Image
          style={styles.image}
          source={require("../assets/peacelogo.png")}
        />
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
              size={20}
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
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 150,
    paddingLeft: 55,
  },
  title: {
    width: "80%",
    fontSize: 28,
    fontWeight: "600",
  },
  input: {
    width: 300,
    height: 50,
    marginTop: 25,
    paddingLeft: 20,
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
    right: 10,
    top: 38,
  },

  buttonConnect: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    width: 200,
    height: 50,
    marginTop: 30,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    marginBottom: 80,
    marginLeft: 50,
  },
  buttonSignUp: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "#F6F8FE",
    borderRadius: 10,
    marginBottom: 80,
  },
  textButtonConnect: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  textContent: {
    flex: 1,
    flexDirection: "row",
  },

  textButtonSignUp: {
    color: "blue",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  textSignUp: {
    color: "black",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Signin; // Exporte le composant Signin pour qu'il puisse être utilisé ailleurs dans l'application
