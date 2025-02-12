import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const baseUrl = "http://192.168.1.38:8000/api";
  const isLogin = false;
  return (
    <ApiContext.Provider value={{ baseUrl, isLogin }}>
      {children}
    </ApiContext.Provider>
  );
};
