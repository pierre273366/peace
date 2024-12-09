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
import Checkbox from 'expo-checkbox'

export default function HomeScreen({ navigation }) {

  const [isChecked, setChecked] = useState(false);


  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.containerView}>
      <View style={styles.containerText}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.title}>dans ta coloc Pierre !</Text>
      </View>

      <View style={styles.containerTodo}>
         <Text style={styles.h2}>ToDo du jour</Text>

         <View style={styles.todo}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#FD703C' : undefined}
            />
             <Text style={styles.h2}>Faire qqc</Text>
        </View>

        <View style={styles.todo}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#FD703C' : undefined}
            />
             <Text style={styles.h2}>Faire qqc</Text>
        </View>
      <View>
        
        </View>

      </View>
      

      
      <View style={styles.containerWidget}>

          <View style={styles.agenda}>

          </View>

          <View style={styles.sondage}>
              <Text style={styles.h2White}>Sondage</Text>
          </View>

          <View style={styles.liste}>
          <Text style={styles.h2}>Liste de course</Text>
          </View>

          <View style={styles.roue}>
          <Text style={styles.h2}>Roue</Text>
          </View>
      </View>
        
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    alignItems: "center",
    
  },
  containerView:{
    width:'100%',
    padding:16
  },
  containerText:{
    width:'100%',
    padding:16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h2:{
    fontSize: 16,
    fontWeight: "700",
  },
  h2White:{
    color:'white',
    fontSize: 16,
    fontWeight: "700",
  },
  containerTodo:{
    backgroundColor:'white',
    width:'100%',
    padding:16
  },
  todo:{
    marginTop:15,
    flexDirection:'row',
    gap:15,
  },
  containerWidget:{
    backgroundColor: "red",
    width:'100%',
    height:'100%',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    marginTop:20
  },
  agenda:{
    backgroundColor:'purple',
    height:100,
    width:'48%',
    padding:16
  },
  sondage:{
    backgroundColor:'#5F6095',
    height:100,
    width:'48%',
    padding:16
  },
  liste:{
    backgroundColor:'green',
    height:100,
    width:'48%',
    padding:16
  },
  roue:{
    backgroundColor:'orange',
    height:100,
    width:'48%',
    padding:16
  }
  
  
  
});
