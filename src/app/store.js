import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice"; // ✅ Use the default export

export const store = configureStore({
  reducer: {
    login: loginReducer, // ✅ Register the reducer correctly
  },
});
