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
        <TouchableOpacity style={styles.btnGo} onPress={() => GoBtn()}>
            <Text>GO !</Text> 
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
      justifyContent: "center",
      alignItems: "center",
      width: 250,
      height: 150,
      paddingLeft: 55,
  },
  image:{
    justifyContent: "center",
      alignItems: "center",
      width: 400 ,
      height: 300,
  },
  btnGo:{
    justifyContent:'center',
    alignItems:'center',
height:70,
width:70,
backgroundColor:'pink',
borderRadius:100,
borderWidth: 2,
  borderColor: 'blue',

  },
});


