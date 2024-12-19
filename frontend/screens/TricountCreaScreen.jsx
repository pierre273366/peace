import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function TricountCreaScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
  const backendUrl = "http://10.9.1.105:3000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [colocId, setColocId] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      if (!userToken) return;

      const usersData = await fetchUsers(userToken);
      if (usersData) {
        setUsers(usersData);
      }
    };
    getUsers();
  }, [userToken]);

  const fetchUsers = async (userToken) => {
    const response = await fetch(
      `${backendUrl}/tricount/getcolocusers/${userToken}`
    );
    const data = await response.json();

    if (data.result) {
      console.log(data.users);
      return data.users;
    }
    return null;
  };

  const handleCheckboxChange = (user) => {
    if (selectedUsers.includes(user._id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user._id]);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch(
      `${backendUrl}/tricount/createtricount`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          participants: selectedUsers,
          colocToken: colocToken,
        }),
      }
    );
    const data = await response.json();

    if (data.result) {
      console.log("Tricount créé !");
      navigation.goBack();
    }
  };

  const userChoice = (
    <View style={styles.participantsList}>
      <View style={styles.participantsHeader}>
        <Text style={styles.label}>Participants</Text>
        <TouchableOpacity
          onPress={() => setSelectedUsers(users.map((u) => u._id))}
          style={styles.selectAllButton}
        >
          <Text style={styles.selectAllText}>Tout sélectionner</Text>
        </TouchableOpacity>
      </View>
      {users.map((user) => (
        <TouchableOpacity
          key={user._id}
          style={styles.participantItem}
          onPress={() => handleCheckboxChange(user)}
        >
          <View style={styles.participantInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.participantName}>{user.username}</Text>
          </View>
          <View
            style={[
              styles.checkbox,
              selectedUsers.includes(user._id) && styles.checkboxSelected,
            ]}
          >
            {selectedUsers.includes(user._id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
      {selectedUsers.length > 0 && (
        <Text style={styles.selectedCount}>
          {selectedUsers.length} participant
          {selectedUsers.length > 1 ? "s" : ""} sélectionné
          {selectedUsers.length > 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
        name={"arrow-circle-left"}
        size={35}
        color="rgb(255, 139, 228)"
        />
        </TouchableOpacity>
        <Text style={styles.title}>Créer un Tricount</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.containerInput}>
          <View style={styles.input}>
            <MaterialIcons
              name="title"
              size={24}
              color="#FD703C"
              style={styles.icon}
            />
            <View style={styles.inputContent}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                placeholder="New city"
                onChangeText={(value) => setTitle(value)}
                value={title}
                style={styles.inputText}
              />
            </View>
          </View>

          <View style={styles.input}>
            <FontAwesome5
              name="users"
              size={20}
              color="#FD703C"
              style={styles.icon}
            />
            <View style={styles.inputContent}>{userChoice}</View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.partager}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 40 : 16,
  },
  content: {
    flex: 1,
  },
  containerInput: {
    width: "100%",
    padding: 16,
    gap: 15,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
  },
  icon: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginTop: 2,
  },
  inputContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  partager: {
    alignItems: "center",
    width: "85%",
    borderRadius: 50,
    backgroundColor: "#FD703C",
    padding: 25,
  },
  white: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  inputText: {
    fontSize: 16,
    height: 24,
  },
  // Nouveaux styles pour les participants
  participantsList: {
    width: "100%",
    gap: 10,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  selectAllButton: {
    padding: 4,
  },
  selectAllText: {
    color: "#FD703C",
    fontSize: 14,
    fontWeight: "600",
  },
  participantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FD703C20",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FD703C",
    fontSize: 18,
    fontWeight: "600",
  },
  participantName: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#FD703C",
    borderColor: "#FD703C",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedCount: {
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
});
