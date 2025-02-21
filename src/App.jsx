import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FileDetails from "./Components/FileDetails";

const App = () => {
  const isLogin = useSelector((state) => state.login?.isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    const level = localStorage.getItem("level"); // Retrieve inside useEffect

    if (isLogin) {
      if (level === "5") {
        navigate("/admindashboard");
      } else {
        navigate("/employee1");
      }
    } else {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    const clearStorage = () => localStorage.clear();
    window.addEventListener("beforeunload", clearStorage);

    return () => {
      window.removeEventListener("beforeunload", clearStorage); // ✅ Cleanup
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
