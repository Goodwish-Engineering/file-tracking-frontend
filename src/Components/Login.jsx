import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLogin, addUser } from "../app/loginSlice";
import logo from "/logo192.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login?.isLogin);
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");

  // Reset login status on component mount (useful for development/testing)
  useEffect(() => {
    dispatch(addLogin(false));
  }, [dispatch]);

  // Check localStorage for existing login state on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedLoginStatus = JSON.parse(localStorage.getItem("isLogin"));
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (storedUser && storedLoginStatus) {
      const now = new Date().getTime();
      if (tokenExpiry && now > tokenExpiry) {
        // Logout if token is expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("level");
        localStorage.removeItem("empId");
      } else {
        dispatch(addUser(storedUser));
        dispatch(addLogin(true));
        // Redirect based on user role
        if (storedUser.is_admin) {
          navigate("/admindashboard"); // Redirect to admin dashboard if admin
        } else {
          navigate("/employeeheader"); // Redirect to employee page if employee
        }
      }
    }
  }, [dispatch, navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Store user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLogin", true);
      localStorage.setItem("empId", data.user.id);
      localStorage.setItem("officeid", data.user.office);
      localStorage.setItem("depart_id",data.user.department);
      localStorage.setItem("username", data.user.username);
      
      // Set expiry time for token (24 hours)
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("token_expiry", expiryTime);

      dispatch(addUser(data.user));
      dispatch(addLogin(true));

      // Store the user's access level based on their role
      // If manual level is selected (for testing), use that instead
      let userLevel;
      
      if (selectedLevel && data.user.is_admin) {
        // Allow admins to switch to lower levels for testing
        userLevel = selectedLevel;
      } else if (data.user.is_admin) {
        userLevel = 5;
      } else {
        userLevel = data.user.user_type;
      }
      
      localStorage.setItem("level", userLevel);
      
      // Redirect based on level
      if (userLevel == 5) {
        navigate("/admindashboard");
      } else {
        navigate("/employeeheader");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="w-full flex justify-center items-center">
          <img src={logo} className="h-10" alt="Logo" />
        </div>
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              className="mt-1 w-full p-3 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full p-3 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;