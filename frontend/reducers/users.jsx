import { createSlice } from '@reduxjs/toolkit'; // Importation de la fonction createSlice de Redux Toolkit pour créer un réducteur de manière simplifiée.

const initialState = {
  // Définition de l'état initial de l'utilisateur. 
  // L'utilisateur a un token, un nom d'utilisateur (username) et un mail, initialement définis sur null.
  value: { token: null, username: null},
};

export const userSlice = createSlice({
  // Création du "slice" (partie de l'état) appelé 'user' avec les valeurs et les reducers.
  name: 'user', // Nom du slice, ici 'user', utilisé pour identifier cette partie de l'état.
  initialState, // L'état initial que nous avons défini ci-dessus.
  reducers: {
    // Définition des actions de modification de l'état. Chaque action correspond à un cas dans un réducteur.

    updateEmail: (state, action) => {
      state.value.email = action.payload.email;  
    },

    updatePhone: (state, action) => {
      state.value.phonenumber = action.payload.phonenumber;  
    },

    login: (state, action) => {
      // Action de connexion : elle met à jour l'état de l'utilisateur avec les valeurs fournies par l'action.
      // Les informations (token, username) sont récupérées à partir de 'action.payload'.
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      
    },

    logout: (state) => {
      // Action de déconnexion : elle réinitialise l'état de l'utilisateur (les trois propriétés à null).
      state.value.token = null;
      state.value.username = null;
    },

    coloc: (state) => {
      state.value.name = action.payload.name;
      state.value.address = action.payload.address;
      state.value.peoples = action.payload.peoples
    }
  },
});

export const { login, logout, updateEmail, updatePhone } = userSlice.actions;
// Extraction des actions 'login' et 'logout' de l'objet userSlice.actions.
// Ces actions sont créées automatiquement par createSlice et sont exportées pour pouvoir être utilisées ailleurs dans l'application.

export default userSlice.reducer;
// Exporte le réducteur généré par createSlice. Ce réducteur sera utilisé pour gérer l'état du slice 'user' dans le store Redux.
