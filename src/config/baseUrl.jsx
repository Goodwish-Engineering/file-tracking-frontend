import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const isLogin = false;
  return (
    <ApiContext.Provider value={{ isLogin }}>
      {children}
    </ApiContext.Provider>
  );
};

