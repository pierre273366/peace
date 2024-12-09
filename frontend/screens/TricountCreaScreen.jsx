import { useState } from "react";
import {View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  
} from "react-native";


export default function TricountCreaScreen({ navigation }) {

    const [title, setTitle]= useState('')



  return (
    <SafeAreaView  style={styles.container}>
      
      
        <Text style={styles.title}>Créer un Tricount</Text>

        <View style={styles.containerInput}>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Titre</Text>
                    <TextInput 
                    placeholder="New city" 
                    onChangeText={(value) => setTitle(value)} 
                    value={title} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Description</Text>
                    <TextInput 
                    placeholder="Donnez plus d'informations" 
                    onChangeText={(value) => setTitle(value)} 
                    value={title} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Participants</Text>
                    <TextInput 
                    placeholder="New city" 
                    onChangeText={(value) => setTitle(value)} 
                    value={title} 
                    style={styles.inputText}
                    />
                </View>
            </View>

        </View>
      
      
        <TouchableOpacity style={styles.partager}>
            <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    alignItems: "center",
  },
  containerInput:{
    width:'100%',
    padding:16,
    gap:15
  },
  input:{
    flexDirection:'row',
    backgroundColor:'white',
    padding:16,
    alignItems:'center',
    gap:15
  },
  inputContent:{
    gap:10
  },
  title:{
    fontSize:24,
    fontWeight:'bold'
  },
  partager:{
    alignItems:'center',
    width:'85%',
    borderRadius:50,
    backgroundColor:'#FD703C',
    padding:25
  },
  white:{
    color:'white',
    fontSize:20,
    fontWeight:'600'
  }

  
  
});
