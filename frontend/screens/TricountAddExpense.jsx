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
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";

export default function TricountAddExpense({ navigation, route }) {
  const colocToken = useSelector((state) => state.users.coloc.token);
  const userToken = useSelector((state) => state.users.user.token);
  const backendUrl = "http://10.9.1.105:3000";

  const [title, setTitle] = useState("");
  const [value, setValue] = useState(0);
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);
  const tricountId = route.params?.tricountId;
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [userId, setUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState(null);

  useEffect(() => {
    if (tricountId) {
      fetch(
        `${backendUrl}/tricount/tricount-participants/${tricountId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setParticipants(data.participants);
          }
        });
    }
    fetchUserId(userToken);
  }, [tricountId]);

  const fetchUserId = async (token) => {
    const response = await fetch(
      `${backendUrl}/tricount/user/${token}`
    );
    const data = await response.json();
    setUserId(data.userId);
    setPaidBy(data.userId);
    const currentUser = participants.find((p) => p._id === data.userId);
    if (currentUser) {
      setSelectedPayer(currentUser);
    }
  };

  const handleParticipantSelection = (participantId) => {
    setSelectedParticipants((prevSelected) => {
      if (prevSelected.includes(participantId)) {
        return prevSelected.filter((id) => id !== participantId);
      } else {
        return [...prevSelected, participantId];
      }
    });
  };

  const handlePayerSelection = (payer) => {
    setSelectedPayer(payer);
    setPaidBy(payer._id);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!title || !value || selectedParticipants.length === 0 || !paidBy) {
      console.log("Veuillez remplir tous les champs");
      return;
    }

    const amountPerPerson = Number(value) / selectedParticipants.length;

    const expenseData = {
      tricountId,
      expense: {
        user: paidBy,
        amount: Number(value),
        description: title,
        share: selectedParticipants.map((participantId) => ({
          user: participantId,
          amountToPay: amountPerPerson,
        })),
      },
    };

    fetch(`${backendUrl}/tricount/add-expense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.goBack();
        } else {
          console.log("Erreur:", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter une dépense</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.containerInput}>
            <View style={styles.input}>
              <Text>⭐️</Text>
              <View style={styles.inputContent}>
                <Text>Titre</Text>
                <TextInput
                  placeholder="Bière"
                  onChangeText={(value) => setTitle(value)}
                  value={title}
                  style={styles.inputText}
                />
              </View>
            </View>

            <View style={styles.input}>
              <Text>⭐️</Text>
              <View style={styles.inputContent}>
                <Text>Montant</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="300€"
                  onChangeText={(value) => setValue(value)}
                  value={value}
                  style={styles.inputText}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setModalVisible(true)}
            >
              <Text>⭐️</Text>
              <View style={styles.inputContent}>
                <Text>Payé par</Text>
                <Text style={styles.selectedPayerText}>
                  {selectedPayer
                    ? selectedPayer.username
                    : "Sélectionner un payeur"}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.input}>
              <Text>⭐️</Text>
              <View style={styles.inputContent}>
                <View style={styles.participantsHeader}>
                  <Text>Participants</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedParticipants(participants.map((p) => p._id))
                    }
                    style={styles.selectAllButton}
                  >
                    <Text style={styles.selectAllText}>Tout sélectionner</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.participantsList}>
                  {participants.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.participantItem}
                      onPress={() => handleParticipantSelection(item._id)}
                    >
                      <View style={styles.participantInfo}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>
                            {item.username.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.participantName}>
                          {item.username}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          selectedParticipants.includes(item._id) &&
                            styles.checkboxSelected,
                        ]}
                      >
                        {selectedParticipants.includes(item._id) && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedParticipants.length > 0 && (
                  <Text style={styles.selectedCount}>
                    {selectedParticipants.length} participant
                    {selectedParticipants.length > 1 ? "s" : ""} sélectionné
                    {selectedParticipants.length > 1 ? "s" : ""}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.partager}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.white}>Créer</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Qui a payé ?</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={participants}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.payerItem,
                    paidBy === item._id && styles.selectedPayerItem,
                  ]}
                  onPress={() => handlePayerSelection(item)}
                >
                  <Text style={styles.payerItemText}>{item.username}</Text>
                  {paidBy === item._id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FF",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 30,
  },
  scrollView: {
    width: "100%",
    marginBottom: 80,
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
    alignItems: "flex-start",
    gap: 15,
    borderRadius: 8,
  },
  inputContent: {
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  partager: {
    alignItems: "center",
    width: "85%",
    borderRadius: 50,
    backgroundColor: "#FD703C",
    padding: 25,
    position: "absolute",
    bottom: 20,
  },
  white: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  modalView: {
    backgroundColor: "white",
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  payerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPayerItem: {
    backgroundColor: "#FD703C20",
  },
  payerItemText: {
    fontSize: 16,
  },
  selectedPayerText: {
    fontSize: 16,
    color: "#333",
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
  participantsList: {
    width: "100%",
    gap: 10,
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
