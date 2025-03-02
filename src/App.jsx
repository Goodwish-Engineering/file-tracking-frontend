import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addLogin } from "./app/loginSlice"; // Import action

const App = () => {
  const isLogin = useSelector((state) => state.login?.isLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load login state from localStorage on first render
  useEffect(() => {
    const storedLoginStatus = JSON.parse(localStorage.getItem("isLogin")) || false;
    if (storedLoginStatus) {
      dispatch(addLogin(true)); // Restore login state
    }
  }, [dispatch]);

  useEffect(() => {
    const level = localStorage.getItem("level"); // Retrieve inside useEffect
    const currentPath = window.location.pathname; // Get current route

    if (isLogin) {
      if (level === "5") {
        navigate(currentPath !== "/" ? currentPath : "/admindashboard");
      } else {
        navigate(currentPath !== "/" ? currentPath : "/employeeheader");
      }
    } else {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return <Outlet />;
};

export default App;
