import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'
import Sondage from "../components/sondage"


export default function SondageScreen({ navigation }) {



    return(
        <View style={styles.sondageContainer}>
            <Image style={styles.imageLogo} source={require("../assets/peacelogo.png")}/>
            <TouchableOpacity style={styles.Add} onPress={()=>  navigation.navigate("CreateSondage")}>
            <Text style={styles.white}>+</Text>
        </TouchableOpacity>
        <Sondage/>
        </View>
    )
}

const styles = StyleSheet.create({
    sondageContainer: {
        flex: 1,
        backgroundColor: "#F6F8FE",
        alignItems: "center",
        justifyContent: "center",
    },

  imageLogo: {
    paddingTop:10,
      justifyContent: "center",
      alignItems: "center",
      width: 250,
      height: 200,
  },
  Add:{
    backgroundColor:'black',
    borderRadius:50,
    height:56,
    width:56,
    justifyContent:'center',
    alignItems:'center'
  },
  white:{
    color:'white',
    fontSize:26
  },

});


