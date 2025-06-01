import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const isLogin = false;
  return (
    <ApiContext.Provider value={{ baseUrl, isLogin }}>
      {children}
    </ApiContext.Provider>
  );
};
