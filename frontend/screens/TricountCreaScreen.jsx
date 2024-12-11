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


export default function TricountCreaScreen({ navigation, route }) {

  
  const userToken = useSelector((state) => state.users.user.token);

    const [title, setTitle]= useState('')
    const [description, setDescription]= useState('')
    const [users, setUsers]= useState([]) //personnes de la coloc
    const [selectedUsers, setSelectedUsers]= useState([])



      
      //RECHERCHE D'UN ID COLOC 
      useEffect(() => {
        const getUsers = async () => {
          if (!userToken) return; // Protection si le token n'est pas encore disponible
          
          const usersData = await fetchUsers(userToken);
          if (usersData) {
            setUsers(usersData);
          }
        };
        getUsers();
      }, [userToken])
    

      //fetch de tous les utilisateurs de la colocs 
      const fetchUsers = async (userToken) => {
        const response = await fetch(`http://10.9.1.140:3000/tricount/getcolocusers/${userToken}`);
        const data = await response.json();
          
        if (data.result) {
          console.log(data.users);
         return data.users
        }
        return null;
      };

      const userChoice = users.map((user, i) => {
        return (
          <View key={i} style={styles.containerCheck}>
            <Checkbox
              style={styles.checkbox}
              value={selectedUsers.includes(user._id)}
              onValueChange={() => handleCheckboxChange(user)}
              // Ajoutez ces props pour une meilleure visibilité
              color={selectedUsers.includes(user._id) ? '#FD703C' : undefined}
            />
            <Text>{user.username}</Text>
          </View>
        );
      });


      const handleCheckboxChange = (user) => {
        if (selectedUsers.includes(user._id)) {
          setSelectedUsers(selectedUsers.filter(id => id !== user._id));
        } else {
          setSelectedUsers([...selectedUsers, user._id]);
        }
      };
    console.log(selectedUsers)

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
                    {userChoice}

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
  },
  checkbox:{
    color:'red'
  }

  
  
});
