import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import AgendaScreen from "./screens/AgendaScreen";
import TricountScreen from "./screens/TricountScreen";
import TricountCreaScreen from "./screens/TricountCreaScreen";
import DetailTricount from "./screens/DetailTricount";
import EventAddScreen from "./screens/EventAddScreen";
import ProfilScreen from "./screens/ProfilScreen";
import ProfilParamScreen from "./screens/ProfilParamScreen";
import TodoListScreen from "./screens/TodoListScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import users from "./reducers/users";

const store = configureStore({
  reducer: { users },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator pour Profil, avec headerHidden: true
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profil" component={ProfilScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator principal
const TabNavigator = () => {
  return (
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
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Tricount" component={TricountScreen} />
      <Tab.Screen name="TodoList" component={TodoListScreen} />
      {/* Nous excluons Profil de la Tab Bar en le plaçant dans un Stack Navigator */}
      <Tab.Screen
        name="Profil"
        component={ProfileStack} // Nous utilisons le Stack Navigator pour Profil
        options={{ tabBarButton: () => null }} // Masque l'icône Profil de la Tab Bar
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Pages de connexion */}
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* Pages Tricount */}
          <Stack.Screen name="DetailTricount" component={DetailTricount} />
          <Stack.Screen name="TricountCrea" component={TricountCreaScreen} />

          {/* Page pour ajouter un événement */}
          <Stack.Screen name="EventAdd" component={EventAddScreen} />

          {/* Page pour modifier le profil */}
          <Stack.Screen name="ProfilParam" component={ProfilParamScreen} />

          {/* TabNavigator qui contient Home, Agenda, Tricount */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
