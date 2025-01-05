import { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

export default function ImagePickerExample(props) {
  const [image, setImage] = useState(null);
  const user = useSelector((state) => state.users.user); // Récupération de l'utilisateur depuis Redux
  const backendUrl = "http://192.168.1.20:3000"; // URL du backend

  useEffect(() => {
    if (props?.profilpicture) {
      setImage(props.profilpicture);
    } else {
      setImage(null);
    }
  }, [props]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);

      // Upload de l'image sur Cloudinary
      uploadImageToCloudinary(selectedImage.uri);
    }
  };

  // Fonction pour télécharger l'image sur Cloudinary
  const uploadImageToCloudinary = async (uri) => {
    try {
      // Créer un form-data pour envoyer l'image à Cloudinary
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: uri,
        type: "image/jpeg",
        name: "photo.jpg", // Nom du fichier (peut être dynamique si nécessaire)
      });

      const response = await fetch(
        `${backendUrl}/users/uploadpicture/${user.token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.result) {
        // L'URL sécurisée de l'image est retournée par Cloudinary
        console.log("Image uploaded successfully: ", data.url);
        setImage(data.url); // Sauvegarder l'URL de l'image
      } else {
        console.log("Error front result fault", data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.imageContainer}>
        {image !== "default-image-url" && image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <Image
            source={require("../assets/utilisateur2.jpg")} // Image par défaut
            style={styles.avatar}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer:{
    alignItems:'center',
    justifyContent:'center',
  },
  avatar: {
    width: 215,
    height: 215,
    borderRadius: 50,
  },
});
