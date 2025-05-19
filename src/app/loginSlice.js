import { createSlice } from "@reduxjs/toolkit";

// Load stored login state from localStorage
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const storedLoginStatus = JSON.parse(localStorage.getItem("isLogin") || "false");

const initialState = {
  isLogin: storedLoginStatus, 
  user: storedUser, 
  baseUrl: "http://192.168.254.22:8000/api",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    addLogin: (state, action) => {
      state.isLogin = action.payload;
      localStorage.setItem("isLogin", JSON.stringify(action.payload));
    },
    removeLogin: (state) => {
      state.isLogin = false;
      localStorage.removeItem("isLogin");
    },
    removeUser: (state) => {
      state.user = {};
      localStorage.removeItem("user");
    },
  },
});

export const { addLogin, removeLogin, addUser, removeUser } = loginSlice.actions;
export default loginSlice.reducer;
