import React, { useState, useEffect } from "react";
import { FaUserCircle, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { removeLogin, removeUser } from "../app/loginSlice"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLevel, setUserLevel] = useState("");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsername = async () => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId");
    const level = localStorage.getItem("level");

    if (!token) {
      setIsLoggedin(false);
      setUsername("");
      return;
    }

    try {
      setUserLevel(level || "");
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
    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("level");
    localStorage.removeItem("userId");
    localStorage.removeItem("officeid");
    localStorage.removeItem("depart_id");
    localStorage.removeItem("username");
    localStorage.removeItem("activeTab");
    localStorage.removeItem("adminTab");

    // Update Redux state
    dispatch(removeUser());
    dispatch(removeLogin());
    
    // Reset component state
    setIsLoggedin(false);
    setUsername("");
    setMenuOpen(false);
    
    // Navigate to login
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    // Close menu when clicked outside
    if (menuOpen && e.target.closest('.user-menu') === null) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    fetchUsername();
    
    // Add event listener to close menu when clicking outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [baseUrl]);

  const handleProfileClick = () => {
    setMenuOpen(false);
    // Navigate to different profile areas based on user level
    if (userLevel === "5") {
      navigate("/admindashboard");
    } else {
      navigate("/employeeheader");
    }
  };

  return (
    <div className="relative user-menu">
      {isLoggedin && (
        <div className="flex flex-col items-center">
          {/* User Icon */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="relative flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <FaUserCircle className="text-[#E68332] text-2xl" />
            <span className="text-gray-700 font-medium hidden md:block">{username}</span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              className="absolute z-50 w-48 bg-white border border-gray-300 rounded-lg shadow-lg 
                top-full right-0 mt-1 py-1 animate-fadeIn"
            >
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="font-medium text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">
                  {userLevel === "1" ? "फाँट" : 
                   userLevel === "2" ? "शाखा प्रमुख" : 
                   userLevel === "3" ? "शाखा अधिकारी" :
                   userLevel === "4" ? "विभाग प्रमुख" :
                   userLevel === "5" ? "प्रशासक" : "कर्मचारी"}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center gap-2"
                >
                  <FaUserCog className="text-gray-500" />
                  <span>प्रोफाइल</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-red-500" />
                  <span>लग आउट</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;
