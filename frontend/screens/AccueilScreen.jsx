import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function Accueil({ navigation }) {
 const GoBtn = () => {
    navigation.navigate("Signin");}
    
    return (
     <View style={styles.container}>
        <Image
          style={styles.imageLogo}
          source={require("../assets/peacelogo.png")}
          />
      <View style={styles.textContainer}>  
          <Text style={styles.text}>Bienvenue sur Peace!{'\n'}{'\n'}Gérer votre colocation n'a jamais été aussi facile. Organisez vos dépenses, événements et plus encore, en quelques clics </Text>
    </View>  
        <TouchableOpacity style={styles.btnGo} onPress={() => GoBtn()}>
            <FontAwesome style={styles.iconGo}
            name='arrow-circle-right'
            size={80}
            color="#FDB165">
            </FontAwesome>
            </TouchableOpacity>
        <Image
          style={styles.image}
          source={require("../assets/accueilPicture.png")}
          />
    </View>
        ) 
        }
  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F8FE",
        alignItems: "center",
        justifyContent: "center",
    },

  imageLogo: {
    paddingTop:10,
      justifyContent: "center",
      alignItems: "center",
      width: 300,
      height: 200,
  },

  image:{
    justifyContent: "center",
      alignItems: "center",
      width: 400 ,
      height: 400,
      marginTop:10,
      paddingLeft:20,
      paddingRight:20,
  },


  btnText:{
    fontSize:20,
    fontWeight:'bold',
  },

    textContainer:{
    padding:20,
    
  },

  text:{
    fontSize: 15,
    fontWeight: 'bold',
    textAlign:'center',
    
  },
  iconGo:{
    color:'#FD703C',
  },
});


