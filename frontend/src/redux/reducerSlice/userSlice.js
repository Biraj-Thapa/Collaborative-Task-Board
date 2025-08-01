"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, register, logout } = userSlice.actions;
export default userSlice.reducer;
