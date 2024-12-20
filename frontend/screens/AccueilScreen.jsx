import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Récupérer les dimensions de l'écran
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Accueil({ navigation }) {
  const GoBtn = () => {
    navigation.navigate("Signin");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.imageLogo}
            source={require("../assets/peacelogo.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.bienvenue}>
            Bienvenue sur Peace!{'\n'}
          </Text>
          <Text style={styles.text}>
            Gérer votre colocation n'a jamais été aussi facile. Organisez vos dépenses, 
            événements et plus encore, en quelques clics
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.btnGo} 
          onPress={GoBtn}
          activeOpacity={0.7}
        >
          <FontAwesome
            name='arrow-circle-right'
            size={windowWidth * 0.15} // Taille adaptative
            color="#FD703C"
          />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/accueilPicture.png")}
            resizeMode="contain"
          />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.02,
  },
  logoContainer: {
    width: '100%',
    height: windowHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLogo: {
    marginTop:90,
    width: windowWidth * 1,
    height: windowHeight * 0.19,
  },
  textContainer: {
    width: '90%',
    paddingVertical: windowHeight * 0.02,
    marginTop:50,
  },
  text: {
    fontSize: Math.min(windowWidth, windowHeight) * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: Math.min(windowWidth, windowHeight) * 0.06,
    color: '#333',
  },
  bienvenue:{
    fontSize:28,
    fontWeight:'bold',
    color:'black',
    textAlign:'center',
  },
  btnGo: {
    padding: windowWidth * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: windowHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});