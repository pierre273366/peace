import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
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


export default function TricountCreaScreen({ navigation, route }) {

    const [title, setTitle]= useState('')
    const [description, setDescription]= useState('')
    const [users, setUsers]= useState([])
    const [selectedUsers, setSelectedUsers]= useState([])



      /*
      //RECHERCHE D'UN ID COLOC 
      useEffect(() => {
        // Recherche des participants associés à l'idColoc
        const group = GROUPS.find((group) => group.idColoc === idColoc);
        setParticipants(group ? group.participants : []);
      }, [idColoc]);
    */


      const toggleSelection = (userId) => {
        setSelectedUsers((prev) => ({
          ...prev,
          [userId]: !prev[userId],
        }));
      };
      

      const handleCreate = () => {
        const selectedUserIds = Object.keys(selectedUsers).filter((id) => selectedUsers[id]);
        console.log("Creating Tricount with:", {
          idColoc,
          title,
          description,
          participants: selectedUserIds,
        });
        // Logique pour envoyer ces données à une API ou les stocker localement
      };



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
                    onChangeText={(value) => setDescription(value)} 
                    value={description} 
                    style={styles.inputText}
                    />
                </View>
            </View>

            <View style={styles.input}>
                <Text>⭐️</Text>
                <View style={styles.inputContent}>
                    <Text>Participants</Text>

                    <View style={styles.containerCheck}>
                        <Checkbox
                            style={styles.checkbox}
                        />
                        <Text>User 1 (moi)</Text>
                    </View>

                    <View style={styles.containerCheck}>
                        <Checkbox
                            style={styles.checkbox}
                            
                        />
                        <Text>User 2</Text>
                    </View>

                    <View style={styles.containerCheck}>
                        <Checkbox
                            style={styles.checkbox}
                            
                        />
                        <Text>User 3</Text>
                    </View>
                    <View style={styles.containerCheck}>
                        <Checkbox
                            style={styles.checkbox}
                        />
                        <Text>User 4</Text>
                    </View>

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
  },
  containerCheck:{
    flexDirection:'row',
    gap: 15,
    alignItems:'center'
  }

  
  
});
