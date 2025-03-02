import React, { useState, useEffect } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { addLogin, removeLogin, addUser, removeUser } from "../app/loginSlice"; // Assuming your slice has these actions
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsername = async () => {
    const token = localStorage.getItem("token");
    // console.log(token);
    const userid = localStorage.getItem('userId');
    // console.log(userid);
    
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

  // Logout function that clears localStorage and updates Redux state
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
    navigate("/login"); // Redirect to login page after logout
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUsername();
  }, [baseUrl]);

  return (
    <div>
      <div className="relative">
        {isLoggedin ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative mt-2 md:mt-0"
            >
              <FaUserCircle size={30} className="text-white" />
            </button>
            {menuOpen && (
              <div className="absolute md:right-1 md:ml-5 z-40 w-40 mt-28 bg-white border border-gray-300 rounded-lg shadow-md">
                <div className="p-2 text-gray-700 text-center">
                  <h2 className="font-poppins text-sm text-gray-800">
                    {username}
                  </h2>
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default UserDetails;
