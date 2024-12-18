import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = () => {
    if (!email) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    fetch("http://10.9.1.140:3000/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setMessage(
            "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail."
          );
          setError("");
        } else {
          setError(data.message || "Une erreur est survenue.");
        }
      })
      .catch(() => {
        setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F6F8FE",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#EC794C",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#EC794C",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  message: {
    color: "green",
    marginBottom: 10,
  },
});

export default ForgotPassword;
