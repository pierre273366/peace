import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Modal, View, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import ChoiceScreen from "./screens/ChoiceScreen";
import JoinColocScreen from "./screens/JoinColocScreen";
import CreateColocScreen from "./screens/CreateColoc";
import ShareScreen from "./screens/ShareScreen";
import DetailTricount from "./screens/DetailTricount";
import TricountCreaScreen from "./screens/TricountCreaScreen";
import EventAddScreen from "./screens/EventAddScreen";
import AgendaScreen from "./screens/AgendaScreen";
import TricountScreen from "./screens/TricountScreen";
import TodoListScreen from "./screens/TodoListScreen";
import ProfilScreen from "./screens/ProfilScreen";
import AccueilScreen from "./screens/AccueilScreen";
import ProfilParamScreen from "./screens/ProfilParamScreen";
import TricountAddExpense from "./screens/TricountAddExpense";
import SondageScreen from "./screens/SondageScreen";
import CreateSondageScreen from "./screens/CreateSondageScreen";
import DetailSondageScreen from "./screens/DetailSondageScreen";
import TodoListCreaScreen from "./screens/TodoListCreaScreen";
import GroceryListScreen from "./screens/GroceryListScreen";
import AjoutProductScreen from "./screens/AjoutProductScreen";
import WheelOfFortune from "./screens/WheelScreen";
import { useState } from "react";
import { Feather } from '@expo/vector-icons';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import users from "./reducers/users";

const store = configureStore({
  reducer: { users },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profil" component={ProfilScreen} />
    </Stack.Navigator>
  );
}

const TabNavigator = ({ navigation }) => {
  const [currentTab, setCurrentTab] = useState("Home");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Agenda") {
              iconName = "calendar";
            } else if (route.name === "Tricount") {
              iconName = "money";
            } else if (route.name === "TodoList") {
              iconName = "th-list";
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "rgb(253, 112, 60)",
          tabBarInactiveTintColor: "#335561",
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            zIndex: 0,
            elevation: 0,
          },
        })}
        screenListeners={{
          state: (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            setCurrentTab(currentRoute.name);
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Agenda" component={AgendaScreen} />
        <Tab.Screen name="Tricount" component={TricountScreen} />
        <Tab.Screen name="TodoList" component={TodoListScreen} />
        <Tab.Screen
          name="Profil"
          component={ProfileStack}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="GroceryList" component={GroceryListScreen} options={{ tabBarButton: () => null }}/>
          <Tab.Screen name="Sondage" component={SondageScreen} options={{ tabBarButton: () => null }}/>
          <Tab.Screen name="WheelScreen" component={WheelOfFortune} options={{ tabBarButton: () => null }}/>
      </Tab.Navigator>

      {currentTab === "Home" && (
        <>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 55,
              left: "50%",
              transform: [{ translateX: -25 }], // La moitié de la largeur du bouton (50/2)
              backgroundColor: "#000",
              width: 50,
              height: 50,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              elevation: 99,
            }}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="plus" size={24} color="#FFF" />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "flex-end",
              }}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  minHeight: 200,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
                >
                  Que voulez-vous créer ?
                </Text>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("CreateSondage");
                  }}
                >
                  <FontAwesome
                    name="question-circle"
                    size={24}
                    color="rgb(253, 112, 60)"
                  />
                  <Text style={{ marginLeft: 15, fontSize: 16 }}>Sondage</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("EventAdd");
                  }}
                >
                  <FontAwesome
                    name="calendar-plus-o"
                    size={24}
                    color="rgb(253, 112, 60)"
                  />
                  <Text style={{ marginLeft: 15, fontSize: 16 }}>
                    Événement
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 15,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("TodoCrea");
                  }}
                >
                  <FontAwesome
                    name="list"
                    size={24}
                    color="rgb(253, 112, 60)"
                  />
                  <Text style={{ marginLeft: 15, fontSize: 16 }}>Todo</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Accueil" component={AccueilScreen} />
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="DetailTricount" component={DetailTricount} />
          <Stack.Screen name="TricountCrea" component={TricountCreaScreen} />
          <Stack.Screen name="EventAdd" component={EventAddScreen} />
          <Stack.Screen name="Choice" component={ChoiceScreen} />
          <Stack.Screen name="JoinColoc" component={JoinColocScreen} />
          <Stack.Screen name="CreateColoc" component={CreateColocScreen} />
          <Stack.Screen name="ShareColoc" component={ShareScreen} />
          <Stack.Screen name="ProfilParams" component={ProfilParamScreen} />
          <Stack.Screen name="TodoCrea" component={TodoListCreaScreen} />
          <Stack.Screen
            name="TricountAddExpense"
            component={TricountAddExpense}
          />
          <Stack.Screen name="CreateSondage" component={CreateSondageScreen} />
          <Stack.Screen name="DetailSondage" component={DetailSondageScreen} />
          <Stack.Screen name="AjoutProduct" component={AjoutProductScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
