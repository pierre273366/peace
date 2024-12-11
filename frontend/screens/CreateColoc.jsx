import { StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from "react"; // Importation de React et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour interagir avec le store
import { login, logout, coloc } from "../reducers/users"; // Importation des actions login et logout de Redux
import FontAwesome from 'react-native-vector-icons/FontAwesome';




function CreateColocScreen({navigation}) {

    const userToken = useSelector((state) => state.users.user.token);
    const [houseName, setHouseName] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState(0);
    const dispatch = useDispatch()
    
    const createBtn = async  () => {
        
        const infos = {
            name: houseName, // Envoie le nom de la maison
            address: address, // Envoie l'addresse de la maison'
            peoples: number, //envoie le nombre de coloc
            user: userToken
        }
        
        const resp = await fetch ("http://10.9.1.105:3000/users/createcoloc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(infos)
        })
        const data = await resp.json()
        if (data.result){
            console.log(data)
           dispatch(coloc({name: data.coloc.name, address: data.coloc.address, peoples: data.coloc.peoples, token: data.coloc.token}));
            // Réinitialisation des champs du formulaire
            setHouseName("");
            setAddress("");
            setNumber("");
            // Redirection vers la page /share après la création de la nouvelle colocation
            navigation.navigate('ShareColoc')
            
        }
        
    }

    return (

        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>

            <Image style={styles.image} source={require('../assets/peacelogo.png')} />


            <TextInput style={styles.input}
                placeholder="  Nom de la coloc'"
                onChangeText={(value) => setHouseName(value)}
                value={houseName}
            />
            <TextInput style={styles.input}
                placeholder="  Adresse"
                onChangeText={(value) => setAddress(value)}
                value={address}
            />
            <TextInput style={styles.input}
                placeholder="  Nombre de colocataires"
                onChangeText={(value) => setNumber(value)}
                value={number}
            />
            <TouchableOpacity
                onPress={() => createBtn()}
                style={styles.btnNext}
                activeOpacity={0.8}
            >
                <Text style={styles.btnText}>Suivant </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F8FE',
        flexDirection: 'column'
    },
    image: {
        width: 300,
        height: 200,
    },
    input: {
        width: 300,
        height: 40,
        marginTop: 25,
        marginLeft: 10,
        borderBottomColor: '#ec6e5b',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        fontSize: 18,
        borderRadius: 15,
    },
    btnNext: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 70,
        marginTop: 30,
        backgroundColor: '#EC794C',
        borderRadius: 40,
    },
    btnText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default CreateColocScreen;