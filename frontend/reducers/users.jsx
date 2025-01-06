import { createSlice } from "@reduxjs/toolkit"; // Importation de la fonction createSlice de Redux Toolkit pour créer un réducteur de manière simplifiée.

const initialState = {
  // Définition de l'état initial de l'utilisateur.
  // L'utilisateur a un token, un nom d'utilisateur (username) et un mail, initialement définis sur null.
  user: {
    token: null,
    username: null,
    email: null,
    phoneNumber: null,
    name: null,
    password: null,
  },
  coloc: {
    name: null,
    address: null,
    peoples: null,
    codeWifi: null,
    loyer: null,
    infoVoisinage: null,
    regleColoc: null,
    token: null,
  },
};

export const userSlice = createSlice({
  // Création du "slice" (partie de l'état) appelé 'user' avec les valeurs et les reducers.
  name: "user", // Nom du slice, ici 'user', utilisé pour identifier cette partie de l'état.
  initialState, // L'état initial que nous avons défini ci-dessus.
  reducers: {
    // Définition des actions de modification de l'état. Chaque action correspond à un cas dans un réducteur.

    updateEmail: (state, action) => {
      state.user.email = action.payload.email;
    },

    updatePhone: (state, action) => {
      state.user.phoneNumber = action.payload.phonenumber;
    },

    updateName: (state, action) => {
      state.user.name = action.payload.name;
    },

    updateUsername: (state, action) => {
      state.user.name = action.payload.name;
    },

    updatePassword: (state, action) => {
      state.user.password = action.payload.password;
    },

    login: (state, action) => {
      state.user.token = action.payload.token;
      state.user.username = action.payload.username;
      state.user.name = action.payload.name;
    },

    logout: (state) => {
      state.coloc = initialState.coloc;
      // Garder state.user.token inchangé
      state.user = {
        ...initialState.user,
        token: state.user.token,
      };
    },

    coloc: (state, action) => {
      const {
        name,
        address,
        peoples,
        codeWifi,
        loyer,
        infoVoisinage,
        regleColoc,
        token,
      } = action.payload;
      state.coloc.name = name;
      state.coloc.address = address;
      state.coloc.peoples = peoples;
      state.coloc.codeWifi = codeWifi;
      state.coloc.loyer = loyer;
      state.coloc.infoVoisinage = infoVoisinage;
      state.coloc.regleColoc = regleColoc;
      state.coloc.token = token;
    },
    supColoc: (state, action) => {
      state.coloc.name = null;
      state.coloc.address = null;
      state.coloc.peoples = null;
      state.coloc.codeWifi = null;
      state.coloc.loyer = null;
      state.coloc.infoVoisinage = null;
      state.coloc.regleColoc = null;
      state.coloc.token = null;
    },
  },
});

export const {
  login,
  logout,
  updateEmail,
  updatePhone,
  updateName,
  coloc,
  supColoc,
  updateUsername,
  updatePassword,
} = userSlice.actions;
// Extraction des actions 'login' et 'logout' de l'objet userSlice.actions.
// Ces actions sont créées automatiquement par createSlice et sont exportées pour pouvoir être utilisées ailleurs dans l'application.

export default userSlice.reducer;
// Exporte le réducteur généré par createSlice. Ce réducteur sera utilisé pour gérer l'état du slice 'user' dans le store Redux.
