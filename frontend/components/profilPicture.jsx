import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const backendUrl = "http://10.9.1.137:3000"; // URL du backend

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
      formData.append("file", {
        uri: uri,
        type: "",
        name: "profile_picture.jpg", // Nom du fichier (peut être dynamique si nécessaire)
      });

      const response = await fetch(`${backendUrl}/users/uploadpicture`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        // L'URL sécurisée de l'image est retournée par Cloudinary
        console.log("Image uploaded successfully: ", data.secure_url);
        setImage(data.secure_url); // Sauvegarder l'URL de l'image
      } else {
        console.log("Error", data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <Image
            source={require("../assets/utilisateur.png")} // Image par défaut
            style={styles.avatar}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
});
