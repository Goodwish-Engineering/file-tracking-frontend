import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice"; // ✅ Use the default export
import patraReducer from "./patraSlice"; // ✅ Add patra reducer

export const store = configureStore({
  reducer: {
    login: loginReducer, // ✅ Register the reducer correctly
    patra: patraReducer, // ✅ Register the patra reducer
  },
});
