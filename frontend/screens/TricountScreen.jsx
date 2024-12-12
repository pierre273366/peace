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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';




export default function TricountScreen({ navigation }) {

  const [tricounts, setTricounts] = useState([])
  const userToken = useSelector((state) => state.users.user.token);


  useFocusEffect( // Permet de rafraichir la page afin de recupérer tous les nouveaux tricounts
    useCallback(() => {
      fetchTricounts();
    }, [])
  );

  const fetchTricounts = () => {
    fetch(`http://10.9.1.140:3000/tricount/recuptricounts/${userToken}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTricounts(data.tricounts);
        }
      });
  };

  
  const handleNavigateToDetails = (_id, title) => {
    navigation.navigate("DetailTricount", {
    tricountId: _id,
    tricountTitle: title
  });
}


  
// CREATION DES CARD TRICOUNT EN FONCTION DE LA BDD
  const cardTricount = tricounts.map((data, i) => {
    return (
      <TouchableOpacity key={i} style={styles.card} onPress={()=>handleNavigateToDetails(data._id, data.title)}>
        
        <Text style={{fontSize:30}}>💳</Text>
          <Text style={styles.name}>{data.title}</Text>
        
      </TouchableOpacity>
    );
  });



  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.containerView}>
      
      <View style={styles.containerBtnTitle}>

        <Text style={styles.title}>Tricount</Text>

        <TouchableOpacity style={styles.Add} onPress={()=>  navigation.navigate("TricountCrea")}>
            <Text style={styles.white}>+</Text>
        </TouchableOpacity>

      </View>
    </View>
      
      <View style={styles.containerCard}>
        {cardTricount}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    
  },
  containerView:{
    width:'100%',
    padding:16,
  },
  containerText:{
    width:'100%',
    padding:16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  containerBtnTitle:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'

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
  containerCard:{
    height:'100%',
    width:'100%',
    padding:16
  },
  card:{
    backgroundColor:'#F7F7FF',
    width:'100%',
    flexDirection:'row',
    padding:16,
    height: '10%',
    alignItems:'center',
    gap:15
  },
  name:{
    fontSize: 16
  }


  
  
});
