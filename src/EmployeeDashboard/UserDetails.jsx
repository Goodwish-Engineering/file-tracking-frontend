import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { removeLogin, removeUser } from "../app/loginSlice"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsername = async () => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId");

    if (!token) {
      setIsLoggedin(false);
      setUsername("");
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/user/${userid}/details/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data) {
        setUsername(response.data.username);
        setIsLoggedin(true);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setIsLoggedin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("level");

    dispatch(removeUser());
    dispatch(removeLogin());
    setIsLoggedin(false);
    setUsername("");
    setMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    fetchUsername();
  }, [baseUrl]);

  return (
    <div className="relative">
      {isLoggedin && (
        <div className="flex flex-col items-center">
          {/* User Icon */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="relative">
            <FaUserCircle size={30} className="text-[#E68332]" />
          </button>

          {/* Dropdown Menu (below on small screens, above on large screens) */}
          {menuOpen && (
            <div
              className="absolute w-40 bg-white border border-gray-300 rounded-lg shadow-md 
                top-full mt-2 md:bottom-full md:mb-2 md:top-auto"
            >
              <div className="p-2 text-gray-700 text-center">
                <h2 className="font-poppins text-sm text-gray-800">{username}</h2>
                <button
                  onClick={handleLogout}
                  className="font-poppins text-center text-sm text-red-500 hover:text-red-700 w-full mt-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
