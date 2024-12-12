import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResponseSondage from './responseSondage';

const Sondage = () => {
    return (
   
        
        <View style={styles.sondageBloc}>
            <Text>Sondage Title</Text>
            <ResponseSondage/>
        </View>
    
    


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



  
  export default Sondage;