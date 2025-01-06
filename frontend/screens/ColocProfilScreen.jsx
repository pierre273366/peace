import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const [colocDetails, setColocDetails] = useState(null); // Détails de la coloc

export default function ColocProfil({ navigation }) {
  const coloc = useSelector((state) => state.users.coloc); // Détails de la coloc

  const handleColocPress = () => {
    // Navigation vers la page ColocParams
    navigation.navigate("ColocParams");
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerButton}>
        <View style={styles.containerBtnTitle}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.iconContainer}
          >
            <FontAwesome name={"chevron-left"} size={35} color="#FD703C" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ColocParams")}
          style={styles.button}
        >
          <Text style={styles.buttonAdd}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.imageLogo}
            source={require("../assets/peacelogo.png")}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Ici tu retrouves toutes les infos utiles de la Coloc !
            </Text>
          </View>
          <View>
            <Text style={{ lineHeight: 40, fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Code wifi:</Text>{" "}
              {coloc.codeWifi}
            </Text>
            <Text style={{ lineHeight: 40, fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Montant du loyer:</Text>{" "}
              {coloc.loyer} €
            </Text>
            <Text style={{ lineHeight: 40, fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Infos voisinages:</Text>{" "}
              {coloc.infoVoisinage}
            </Text>
            <Text style={{ lineHeight: 40, fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Règlement :</Text>{" "}
              {coloc.regleColoc}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FE",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerButton: {
    width: "100%",
    alignItems: "flex-end",
    padding: windowWidth * 0.05,
    marginTop: windowHeight * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "rgb(0, 0, 0)",
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAdd: {
    color: "white",
    fontSize: Math.min(windowWidth, windowHeight) * 0.055,
    fontWeight: "bold",
    fontSize: 20,
  },
  logoContainer: {
    width: "100%",
    height: windowHeight * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLogo: {
    marginTop: 200,
    width: windowWidth * 1,
    height: windowHeight * 0.19,
  },
  textContainer: {
    width: "90%",
    paddingVertical: windowHeight * 0.02,
    alignItems: "center",
    marginTop: 5,
  },
});
