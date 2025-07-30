import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addLogin } from "./app/loginSlice"; // Import action
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAdmin } from "./utils/constants";

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
      if (isAdmin(level)) {
        navigate(currentPath !== "/" ? currentPath : "/admindashboard");
      } else {
        navigate(currentPath !== "/" ? currentPath : "/employeeheader");
      }
    } else {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
