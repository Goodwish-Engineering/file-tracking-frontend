import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false, // ✅ Directly in the state, not inside "login"
  user: { id: 1 },
  baseUrl: "http://192.168.1.34:8000/api",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload; // ✅ Fix: directly modify state.user
    },
    addLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    removeLogin: (state) => {
      state.isLogin = false;
    },
    removeUser: (state) => {
      state.user = {}; // ✅ Reset user
    },
  },
});

export const { addLogin, removeLogin, addUser, removeUser } =
  loginSlice.actions;
export default loginSlice.reducer;
