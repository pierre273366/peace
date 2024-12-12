import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
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


export default function TricountAddExpense({ navigation, route }) {


  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
    

  const [title, setTitle] = useState('')
  const [value, setValue] = useState(0)
  const [paidBy, setPaidBy] = useState('')
  const [date, setDate] = useState('')


  return (
    <SafeAreaView  style={styles.container}>
      
      
        <Text style={styles.title}>Ajouter une dépense</Text>

        <View style={styles.containerInput}>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Titre</Text>
                    <TextInput 
                    placeholder="Bière" 
                    onChangeText={(value) => setTitle(value)} 
                    value={title} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Montant</Text>
                    <TextInput 
                    placeholder="300€" 
                    onChangeText={(value) => setValue(value)} 
                    value={value} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Payé par</Text>
                    <TextInput 
                    placeholder="Brieuc" 
                    onChangeText={(value) => setPaidBy(value)} 
                    value={paidBy} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Quand ?</Text>
                    <TextInput 
                    placeholder="12 dec 2024" 
                    onChangeText={(value) => setDate(value)} 
                    value={date} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Participants</Text>

                    <View style={styles.containerCheck}>
                  

                </View>
            </View>

        </View>
        </View>
      
      
        <TouchableOpacity style={styles.partager} onPress={()=> handleSubmit()}>
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
  },
  containerCheck:{
    flexDirection:'row',
    gap: 15,
    alignItems:'center'
  },
  checkbox:{
    color:'red'
  }

  
  
});
