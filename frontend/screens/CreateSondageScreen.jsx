import {StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native'



export default function CreateSondage({ navigation }) {

    const [title, setTitle] = useState('');
    const [responses, setResponses] = useState(['']);
    
    const addInput = () => {
        setResponses([...responses, '']);
      };



        

    return(
        <View style={styles.container}>
            <Image style={styles.imageLogo} source={require("../assets/peacelogo.png")}/>
      <View style={styles.textContainer}>  
          <Text style={styles.text}>Create Sondage</Text>
    </View> 
    <View style={styles.sondageContainer}>
        <View style={styles.sondageBloc}>
            <TextInput placeholder='Sondage Title'> </TextInput>
            <TextInput placeholder='Réponse 1'> </TextInput>
            <TextInput placeholder='Réponse 2'> </TextInput>
            {input}
            <TouchableOpacity style={styles.AddBtn} onPress={() => addInput()}></TouchableOpacity>
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


