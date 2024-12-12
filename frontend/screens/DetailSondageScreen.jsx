import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'



export default function DetailSondage({ navigation }) {



    return(
        <View style={styles.container}>
            <Image style={styles.imageLogo} source={require("../assets/peacelogo.png")}/>
      <View style={styles.textContainer}>  
          <Text style={styles.text}>Detail Sondage</Text>
    </View> 
    <View style={styles.sondageContainer}>
        <View style={styles.sondageBloc}>
            <Text>Sondage Title</Text>
        </View>
    </View>
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
      width: 250,
      height: 200,
  },
sondageBloc:{
    width: 340,
    height: 200,
    borderRadius:30,
    backgroundColor:'#E6E6FC'
}
});


