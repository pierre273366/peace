import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InputSondage = () => {
    return (
   
            <TextInput placeholder='Ajoute une nouvelle réponse'></TextInput>
        
    );
  };

  const styles = StyleSheet.create({
    sondageContainer: {
        flex: 1,
        backgroundColor: "#F6F8FE",
        alignItems: "center",
        justifyContent: "center",
    },

sondageBloc:{
    width: 340,
    height: 200,
    borderRadius:30,
    backgroundColor:'#E6E6FC'
}
});


export default InputSondage;