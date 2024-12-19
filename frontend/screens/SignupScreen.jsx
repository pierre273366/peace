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
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  login,
  updatePhone,
  updateName,
  updateUsername,
  updatePassword,
  updateEmail,
} from "../reducers/users";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function Signup({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  const [signUpName, setSignUpName] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [signUpBirth, setSignUpBirth] = useState("");
  const [signUpFirstColoc, setSignUpFirstColoc] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const dateSet = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        setDate(selectedDate);
        const formatted = `${selectedDate.getDate()}/${
          selectedDate.getMonth() + 1
        }/${selectedDate.getFullYear()}`;
        setSignUpBirth(formatted);
      }
    } else {
      setTempDate(selectedDate || date);
    }
  };

  const SignUpBtn = () => {
    const infos = {
      name: signUpName,
      username: signUpUsername,
      email: signUpEmail,
      phonenumber: signUpPhone,
      dateofbirth: new Date(signUpBirth),
      password: signUpPassword,
      firstcoloc: signUpFirstColoc,
    };

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (regexEmail.test(signUpEmail)) {
      dispatch(updateEmail(signUpEmail));
      setEmailInvalid(false);
    } else {
      setEmailInvalid(true);
    }

    const regexPhone = /^0[1-9]\d{8}$/;
    if (regexPhone.test(signUpPhone)) {
      dispatch(updatePhone(signUpPhone));
      setPhoneInvalid(false);
    } else {
      setPhoneInvalid(true);
    }

    if (!signUpName.trim()) {
      setNameInvalid(true);
    } else {
      setNameInvalid(false);
      dispatch(updateName(signUpName));
    }

    if (!signUpUsername.trim()) {
      setUsernameInvalid(true);
    } else {
      setUsernameInvalid(false);
      dispatch(updateUsername(signUpUsername));
    }

    if (!signUpPassword.trim()) {
      setPasswordInvalid(true);
      return;
    } else {
      setPasswordInvalid(false);
      dispatch(updatePassword(signUpPassword));
    }

    fetch("http://10.9.1.137:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infos),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
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
          {nameInvalid && (
            <Text style={styles.errorText}>
              Nom et Prénom manquants ou invalides.
            </Text>
          )}

          <TextInput
            placeholder="Username"
            onChangeText={(value) => setSignUpUsername(value)}
            value={signUpUsername}
            style={styles.input}
          />
          {usernameInvalid && (
            <Text style={styles.errorText}>
              Username manquant ou invalide.
            </Text>
          )}

          <TextInput
            placeholder="Email"
            onChangeText={(value) => setSignUpEmail(value)}
            value={signUpEmail}
            style={styles.input}
          />
          {emailInvalid && (
            <Text style={styles.errorText}>
              Adresse mail manquante ou invalide.
            </Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              onChangeText={(value) => setSignUpPassword(value)}
              value={signUpPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            {passwordInvalid && (
              <Text style={styles.errorText}>
                Mot de passe manquant ou invalide.
              </Text>
            )}
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
          {phoneInvalid && (
            <Text style={styles.errorText}>
              Numéro de téléphone manquant ou invalide.
            </Text>
          )}

          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowPicker(true)}
          >
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="Date de naissance"
                value={signUpBirth}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={Platform.OS === 'ios' ? tempDate : date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={dateSet}
                maximumDate={new Date()}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.validateButton}
                  onPress={() => {
                    setShowPicker(false);
                    setDate(tempDate);
                    const formatted = `${tempDate.getDate()}/${
                      tempDate.getMonth() + 1
                    }/${tempDate.getFullYear()}`;
                    setSignUpBirth(formatted);
                  }}
                >
                  <Text style={styles.validateButtonText}>Valider</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleFirstColoc}
          >
            <Text style={styles.checkboxText}>
              As-tu déjà fait de la colocation ?
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: windowWidth * 0.35,
    height: windowHeight * 0.12,
    resizeMode: 'contain',
  },
  textAccount: {
    fontSize: windowHeight * 0.025,
    fontWeight: "600",
    marginVertical: windowHeight * 0.01,
  },
  input: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.045,
    marginTop: windowHeight * 0.01,
    paddingLeft: 15,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    backgroundColor: "white",
    fontSize: windowHeight * 0.018,
    borderRadius: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  inputContainer: {
    position: "relative",
    width: '100%',
    alignItems: 'center',
    height: windowHeight * 0.07,
  },
  iconContainer: {
    position: "absolute",
    right: windowWidth * 0.12,
    top: windowHeight * 0.02,
  },
  dateButton: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.055, // Augmenté de 0.045 à 0.055
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: windowHeight * 0.005,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
},
dateInputContainer: {
  width: '100%',
  height: '100%', // Prend toute la hauteur du parent
  justifyContent: 'center',
},
dateInput: {
  width: '100%',
  height: '100%',
  paddingLeft: 15,
  fontSize: windowHeight * 0.018,
  textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto', // Ajout uniquement de cette ligne
},
  pickerContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 0,
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
  buttonSignup: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.5,
    height: windowHeight * 0.055,
    backgroundColor: "#EC794C",
    borderRadius: 30,
    marginTop: windowHeight * 0.02,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textButtonSignup: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: windowHeight * 0.018,
  },
  validateButton: {
    backgroundColor: "#EC794C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 15,
  },
  validateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: windowHeight * 0.01,
  },
  checkbox: {
    width: windowWidth * 0.07,
    height: windowWidth * 0.07,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: windowWidth * 0.05,
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    fontSize: windowHeight * 0.016,
    color: "white",
  },
  checkboxText: {
    fontSize: windowHeight * 0.016,
  },
  errorText: {
    color: "red",
    fontSize: windowHeight * 0.012,
    marginTop: 2,
    alignSelf: 'flex-start',
    marginLeft: windowWidth * 0.12,
  },
});

export default Signup;