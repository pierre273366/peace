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
  SafeAreaView,
  ScrollView,
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
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Signup({ navigation }) {
  const dispatch = useDispatch();
  const backendUrl = "https://peace-chi.vercel.app";

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  // States
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

  const cancelDate = () => {
    setShowPicker(false);
    setTempDate(date);
  };

  const confirmDate = () => {
    setShowPicker(false);
    setDate(tempDate);
    const formatted = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`;
    setSignUpBirth(formatted);
  };

  const dateSet = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (selectedDate) {
        setDate(selectedDate);
        const formatted = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        setSignUpBirth(formatted);
      }
    } else {
      setTempDate(selectedDate || date);
    }
  };

  const SignUpBtn = () => {
    let isValid = true;

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (regexEmail.test(signUpEmail)) {
      dispatch(updateEmail(signUpEmail));
      setEmailInvalid(false);
    } else {
      setEmailInvalid(true);
      isValid = false;
    }

    const regexPhone = /^0[1-9]\d{8}$/;
    if (regexPhone.test(signUpPhone)) {
      dispatch(updatePhone(signUpPhone));
      setPhoneInvalid(false);
    } else {
      setPhoneInvalid(true);
      isValid = false;
    }

    if (!signUpName.trim()) {
      setNameInvalid(true);
      isValid = false;
    } else {
      setNameInvalid(false);
      dispatch(updateName(signUpName));
    }

    if (!signUpUsername.trim()) {
      setUsernameInvalid(true);
      isValid = false;
    } else {
      setUsernameInvalid(false);
      dispatch(updateUsername(signUpUsername));
    }

    if (!signUpPassword.trim()) {
      setPasswordInvalid(true);
      isValid = false;
    } else {
      setPasswordInvalid(false);
      dispatch(updatePassword(signUpPassword));
    }

    if (!isValid) return;

    const infos = {
      name: signUpName,
      username: signUpUsername,
      email: signUpEmail,
      phonenumber: signUpPhone,
      dateofbirth: new Date(signUpBirth),
      password: signUpPassword,
      firstcoloc: signUpFirstColoc,
    };

    fetch(`${backendUrl}/users/signup`, {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.mainContent}>
            <Text style={styles.title}>Inscription</Text>
  
            <View style={styles.containerInput}>
              {/* Input Name */}
              <View style={styles.input}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color="#FD703C"
                  style={styles.icon}
                />
                <View style={styles.inputContent}>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput
                    placeholder="Entrez votre nom"
                    onChangeText={(value) => setSignUpName(value)}
                    value={signUpName}
                    style={styles.inputText}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              {nameInvalid && <Text style={styles.errorText}>Nom manquant ou invalide</Text>}
  
              {/* Input Username */}
              <View style={styles.input}>
                <MaterialIcons
                  name="alternate-email"
                  size={24}
                  color="#FD703C"
                  style={styles.icon}
                />
                <View style={styles.inputContent}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    placeholder="Choisissez un nom d'utilisateur"
                    onChangeText={(value) => setSignUpUsername(value)}
                    value={signUpUsername}
                    style={styles.inputText}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              {usernameInvalid && <Text style={styles.errorText}>Username manquant ou invalide</Text>}
  
              {/* Input Email */}
              <View style={styles.input}>
                <MaterialIcons
                  name="email"
                  size={24}
                  color="#FD703C"
                  style={styles.icon}
                />
                <View style={styles.inputContent}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="Entrez votre email"
                    onChangeText={(value) => setSignUpEmail(value)}
                    value={signUpEmail}
                    style={styles.inputText}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              {emailInvalid && <Text style={styles.errorText}>Email manquant ou invalide</Text>}
  
              {/* Input Password */}
              <View style={styles.input}>
                <MaterialIcons
                  name="lock"
                  size={24}
                  color="#FD703C"
                  style={styles.icon}
                />
                <View style={styles.inputContent}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <TextInput
                    placeholder="Choisissez un mot de passe"
                    onChangeText={(value) => setSignUpPassword(value)}
                    value={signUpPassword}
                    style={styles.inputText}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {passwordInvalid && <Text style={styles.errorText}>Mot de passe manquant ou invalide</Text>}
  
              {/* Input Phone */}
              <View style={styles.input}>
                <MaterialIcons
                  name="phone"
                  size={24}
                  color="#FD703C"
                  style={styles.icon}
                />
                <View style={styles.inputContent}>
                  <Text style={styles.label}>Téléphone</Text>
                  <TextInput
                    placeholder="Entrez votre numéro"
                    onChangeText={(value) => setSignUpPhone(value)}
                    value={signUpPhone}
                    style={styles.inputText}
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              {phoneInvalid && <Text style={styles.errorText}>Numéro de téléphone invalide</Text>}
  
              {/* Row pour Date et Expérience */}
              <View style={styles.rowContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowPicker(true)}>
                  <View style={styles.halfInput}>
                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color="#FD703C"
                      style={styles.icon}
                    />
                    <View style={styles.inputContent}>
                      <Text style={styles.label}>Naissance</Text>
                      <TextInput
                        placeholder="Date"
                        value={signUpBirth}
                        style={styles.inputTextDate}
                        editable={false}
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
  
                <View style={styles.halfInput}>
                  <MaterialIcons
                    name="home"
                    size={24}
                    color="#FD703C"
                    style={styles.icon}
                  />
                  <View style={styles.inputContent}>
                    <Text style={styles.label}>Expérience</Text>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={toggleFirstColoc}
                    >
                      <Text style={styles.checkboxText}>Oui</Text>
                      <View style={[styles.checkbox, signUpFirstColoc === "Yes" && styles.checked]}>
                        {signUpFirstColoc === "Yes" && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
  
            <View style={styles.bottomContent}>
              <TouchableOpacity
                onPress={() => SignUpBtn()}
                style={styles.buttonConnect}
                activeOpacity={0.8}
              >
                <Text style={styles.textButtonConnect}>S'inscrire</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                onPress={() => navigation.navigate("Signin")}
                style={styles.buttonSignUp}
                activeOpacity={0.8}
              >
                <View style={styles.textContent}>
                  <Text style={styles.textSignUp}>Déjà inscrit ? </Text>
                  <Text style={styles.textButtonSignUp}>Se connecter</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  
      {/* Date Picker pour iOS */}
      {Platform.OS === 'ios' && showPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            testID="dateTimePicker"
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={dateSet}
            maximumDate={new Date()}
          />
          <View style={styles.pickerButtonContainer}>
            <TouchableOpacity onPress={cancelDate} style={styles.pickerCancelButton}>
              <Text style={[styles.pickerButtonText, { color: '#666' }]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDate} style={styles.pickerValidateButton}>
              <Text style={styles.pickerButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
  
      {/* Date Picker pour Android */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={dateSet}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    width: "100%",
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
    width: "100%",
    marginTop: 50,
  },
  containerInput: {
    width: "100%",
    padding: 16,
    gap: 8,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    height: 75,
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  halfInput: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    height: 75,
    alignItems: "center",
  },
  icon: {
    width: 30,
    marginRight: 15,
    alignSelf: "center",
  },
  inputContent: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  inputText: {
    fontSize: 16,
    height: 30,
    color: "#000",
    textAlignVertical: "center",
    paddingVertical: 0,
    marginBottom: 6,
  },
  inputTextDate: {
    fontSize: 13,
    height: 30,
    color: "#000",
    textAlignVertical: "center",
    paddingVertical: 0,
    marginBottom: 6,
  },
  eyeIcon: {
    padding: 8,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 11,
    marginLeft: 16,
    marginTop: -8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#FD703C",
    borderColor: "#FD703C",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
  },
  checkboxText: {
    fontSize: 14,
    color: "#000",
    marginRight: 8,
  },
  bottomContent: {
    width: "100%",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "#F7F7FF",
  },
  buttonConnect: {
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#FD703C",
    padding: 20,
    marginBottom: 16,
  },
  textButtonConnect: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSignUp: {
    padding: 8,
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
  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pickerCancelButton: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  pickerValidateButton: {
    padding: 10,
    backgroundColor: "#FD703C",
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  pickerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});


