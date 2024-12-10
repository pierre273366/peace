import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import ChoiceScreen from "./screens/ChoiceScreen"
import JoinColocScreen from "./screens/JoinColocScreen"
import CreateColocScreen from "./screens/CreateColoc"
import ShareScreen from "./screens/ShareScreen"

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import users from './reducers/users';

const store = configureStore({
  reducer: { users },
});
import AgendaScreen from "./screens/AgendaScreen";
import TricountScreen from "./screens/TricountScreen"
import TricountCreaScreen from "./screens/TricountCreaScreen"
import DetailTricount from "./screens/DetailTricount";


import EventAddScreen from "./screens/EventAddScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
          } else if (route.name ==="Tricount")
            iconName ="money"

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
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="DetailTricount" component={DetailTricount} />
        <Tab.Screen name="TricountCrea" component={TricountCreaScreen} />
        <Stack.Screen name="EventAdd" component={EventAddScreen} />
        <Stack.Screen name="Choice" component={ChoiceScreen} />
        <Stack.Screen name="JoinColoc" component={JoinColocScreen} />
        <Stack.Screen name="CreateColoc" component={CreateColocScreen} />
        <Stack.Screen name="ShareColoc" component={ShareScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
