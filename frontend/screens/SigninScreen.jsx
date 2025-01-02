import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, coloc } from "../reducers/users";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function Signin() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.value);
  const backendUrl = "http://192.168.1.20:3000";

  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignIn = () => {
    let isValid = true;

    if (!signInUsername) {
      setUsernameError("Nom d'utilisateur requis.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!signInPassword) {
      setPasswordError("Mot de passe requis.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    fetch(`${backendUrl}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Données reçues:", data)
        if (data.result) {
          console.log("Dispatching login with:", {
            token: data.token,
            username: signInUsername,
            name: data.name
          });
          dispatch(
            login({
              token: data.token,
              username: data.username || signInUsername,
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
        } else {
          if (data.message === "Invalid username") {
            setUsernameError("Nom d'utilisateur invalide.");
          } else if (data.message === "Invalid password") {
            setPasswordError("Mot de passe invalide.");
          }
        }
      });
  };

  const content = (
    <>
      <View style={styles.logoContainer}>
        <Image
          style={styles.image}
          source={require("../assets/peacelogo.png")}
          resizeMode="contain"
        />
        <Text style={styles.title}>Connexion</Text>
      </View>

      <View style={styles.containerInput}>
        <View style={styles.input}>
          <MaterialIcons
            name="person"
            size={24}
            color="#FD703C"
            style={styles.icon}
          />
          <View style={styles.inputContent}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              onChangeText={setSignInUsername}
              value={signInUsername}
              style={styles.inputText}
              placeholderTextColor="#999"
            />
          </View>
        </View>
        {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

        <View style={styles.input}>
          <MaterialIcons
            name="lock"
            size={24}
            color="#FD703C"
            style={styles.icon}
          />
          <View style={styles.inputContent}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              onChangeText={setSignInPassword}
              value={signInPassword}
              style={styles.inputText}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <View style={styles.bottomContent}>
        <TouchableOpacity
          onPress={handleSignIn}
          style={styles.buttonConnect}
          activeOpacity={0.8}
        >
          <Text style={styles.textButtonConnect}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.buttonSignUp}
          activeOpacity={0.8}
        >
          <View style={styles.textContent}>
            <Text style={styles.textSignUp}>Vous n'avez pas de compte ? </Text>
            <Text style={styles.textButtonSignUp}>S'inscrire</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>{content}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    width: "100%",
  },
  containerInput: {
    width: "100%",
    padding: 16,
    gap: 15,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    height: 90,
    alignItems: "center",
  },
  icon: {
    width: 30,
    marginRight: 20,
    alignSelf: "center",
  },
  inputContent: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  label: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  inputText: {
    fontSize: 18,
    height: 35,
    color: "#000",
    textAlignVertical: "center",
    paddingVertical: 0,
    marginBottom: 8,
  },
  eyeIcon: {
    padding: 8,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 16,
    marginTop: -10,
  },
  bottomContent: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F7F7FF",
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
    marginTop: "auto",
  },
  buttonConnect: {
    alignItems: "center",
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#FD703C",
    padding: 25,
    marginBottom: 16,
  },
  textButtonConnect: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  buttonSignUp: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  textContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textSignUp: {
    color: "#666",
    fontSize: 14,
  },
  textButtonSignUp: {
    color: "#FD703C",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Signin;
