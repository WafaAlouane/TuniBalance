import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      loginSuccess: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Stocker les données dans localStorage
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Nettoyer le localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      },
    },
  });

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
