import React, { useState, useContext } from "react";
import { ApiContext } from "../config/baseUrl";
import logo from "/logo192.png";
import { useDispatch, useSelector } from "react-redux";
import { addLogin } from "../app/loginSlice";

const Login = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login?.isLogin);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("empId", data.user.id);
      dispatch(addLogin(true));
      if (data.user.is_admin) {
        localStorage.setItem("level", 5);
      } else {
        localStorage.setItem("level", data.user.user_type);
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
