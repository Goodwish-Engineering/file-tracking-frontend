import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const baseUrl = "http://fts.guthisansthan.org.np/api";
  const isLogin = false;
  return (
    <ApiContext.Provider value={{ baseUrl, isLogin }}>
      {children}
    </ApiContext.Provider>
  );
};
