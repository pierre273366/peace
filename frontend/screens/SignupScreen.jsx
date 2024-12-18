import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, updatePhone, updateEmail } from "../reducers/users";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";

function Signup({ navigation }) {
  const dispatch = useDispatch();

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [signUpBirth, setSignUpBirth] = useState("");
  const [signUpFirstColoc, setSignUpFirstColoc] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [show, setShow] = useState(false);

  const dateSet = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
      const formatted = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      setSignUpBirth(formatted);
    }
  };

  const SignUpBtn = () => {
    const infos = {
      name: signUpName,
      username: signUpUsername,
      email: signUpEmail,
      phonenumber: signUpPhone,
      dateofbirth: signUpBirth,
      password: signUpPassword,
      firstcoloc: signUpFirstColoc,
    };

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (regexEmail.test(signUpEmail)) {
      dispatch(updateEmail(signUpEmail));
      setEmailInvalid(false);
    } else {
      setEmailInvalid(true);
      return;
    }

    const regexPhone = /^0[1-9]\d{8}$/;
    if (regexPhone.test(signUpPhone)) {
      dispatch(updatePhone(signUpPhone));
      setPhoneInvalid(false);
    } else {
      setPhoneInvalid(true);
      return;
    }

    fetch("http://10.9.1.137:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infos),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Réponse du serveur:", data);
          dispatch(
            login({
              username: signUpUsername,
              token: data.token,
            })
          );
          setSignUpName("");
          setSignUpUsername("");
          setSignUpPassword("");
          setSignUpEmail("");
          setSignUpBirth("");
          setSignUpPhone("");
          setSignUpFirstColoc("");
          navigation.navigate("Choice");
        } else {
          console.log("Aucune donnée retournée du serveur");
        }
      });
  };

  const toggleFirstColoc = () => {
    setSignUpFirstColoc((prev) => (prev === "Yes" ? "No" : "Yes"));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.signinContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Image
            style={styles.image}
            source={require("../assets/peacelogo.png")}
          />
          <Text style={styles.textAccount}>Inscription</Text>
          <TextInput
            placeholder="Name"
            onChangeText={(value) => setSignUpName(value)}
            value={signUpName}
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            onChangeText={(value) => setSignUpUsername(value)}
            value={signUpUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(value) => setSignUpEmail(value)}
            value={signUpEmail}
            style={styles.input}
          />
          {emailInvalid && <Text style={styles.errorText}>Invalid email address</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              onChangeText={(value) => setSignUpPassword(value)}
              value={signUpPassword}
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
          <TextInput
            placeholder="PhoneNumber"
            onChangeText={(value) => setSignUpPhone(value)}
            value={signUpPhone}
            style={styles.input}
          />
          {phoneInvalid && <Text style={styles.errorText}>Invalid phone number</Text>}
          <View style={styles.dateContainer}>
            {Platform.OS === 'ios' ? (
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={styles.dateButton} 
                  onPress={() => setShow(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dateInputWrapper}>
                    <TextInput 
                      style={[styles.input, styles.dateInput]}
                      placeholder="Date de naissance"
                      value={signUpBirth}
                      editable={false}
                      pointerEvents="none"
                    />
                  </View>
                </TouchableOpacity>
                {show && (
                  <View style={styles.iosPickerContainer}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={dateSet}
                      maximumDate={new Date()}
                    />
                    <TouchableOpacity 
                      style={styles.iosButton}
                      onPress={() => setShow(false)}
                    >
                      <Text style={styles.iosButtonText}>Valider</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={styles.dateButton} 
                  onPress={() => setShow(true)}
                >
                  <TextInput 
                    style={[styles.input, styles.dateInput]}
                    placeholder="Date de naissance"
                    value={signUpBirth}
                    editable={false}
                  />
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={dateSet}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleFirstColoc}
          >
            <Text style={styles.checkboxText}>
              As tu déjà fait de la colocation ?
            </Text>
            <View
              style={[
                styles.checkbox,
                signUpFirstColoc === "Yes" && styles.checked,
              ]}
            >
              {signUpFirstColoc === "Yes" && (
                <Text style={styles.checkmark}>✔</Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSignup}
            onPress={() => SignUpBtn()}
          >
            <Text style={styles.textButtonSignup}>S'inscrire</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    keyboardView: {
      width: '100%',
      alignItems: 'center',
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
    dateContainer: {
      width: '100%',
      alignItems: 'center',
    },
    dateInputContainer: {
      width: '100%',
      alignItems: 'center',
      position: 'relative',
    },
    dateButton: {
      width: 300,
      height: 60,
      justifyContent: 'center',
    },
    dateInput: {
      marginTop: 0,
      height: 40,
    },
    iosPickerContainer: {
      backgroundColor: 'white',
      width: Dimensions.get('window').width, // Utilise toute la largeur de l'écran
      position: 'absolute',
      bottom: 0,
      left: 0, // Compense le padding/margin du conteneur parent
      right: 0,
      zIndex: 1000,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iosButton: {
      backgroundColor: '#EC794C',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 20,
      alignSelf: 'center',
      marginVertical: 15,
    },
    iosButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
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
    errorText: {
      color: 'red',
      marginLeft: 10,
      marginTop: 5,
    },
  });
export default Signup;