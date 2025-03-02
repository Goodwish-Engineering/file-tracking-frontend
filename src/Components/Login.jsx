import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLogin, addUser, removeLogin, removeUser } from "../app/loginSlice";
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

  // Check localStorage for existing login state on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedLoginStatus = JSON.parse(localStorage.getItem("isLogin"));
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (storedUser && storedLoginStatus) {
      const now = new Date().getTime();
      if (tokenExpiry && now > tokenExpiry) {
        handleLogout(); // Logout if token is expired
      } else {
        dispatch(addUser(storedUser));
        dispatch(addLogin(true));
        // Redirect based on user role
        if (storedUser.is_admin) {
          navigate("/admindashboard"); // Redirect to admin dashboard if admin
        } else {
          navigate("/employee1"); // Redirect to employee page if employee
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
      localStorage.setItem("userId", data.user.id);
      // const userid = localStorage.getItem('userId');
      // console.log(userid);

      dispatch(addUser(data.user));
      dispatch(addLogin(true));

      // Store the user's access level
      if (data.user.is_admin) {
        localStorage.setItem("level", 5);
        navigate("/admindashboard"); // Redirect to admin dashboard if admin
      } else {
        localStorage.setItem("level", data.user.user_type);
        navigate("/employeeheader"); // Redirect to employee page if employee
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
          <img src={logo} className="h-10" />
        </div>
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-6">
          {isLogin ? "Welcome Back!" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* {isLogin ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : ( */}
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
        {/* )}  */}
      </div>
    </div>
  );
};

export default Login;
