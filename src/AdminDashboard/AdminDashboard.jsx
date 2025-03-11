import React, { useState, useEffect } from "react";
import EmployeeDetails from "./EmployeeDetails";
import Registration from "../Components/Register";
import FileStatus from "../Components/FileStatus";
import Notification from "../Components/Notification";
import UserDetails from "../EmployeeDashboard/UserDetails";
import AddOffice from "./AddOffice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faClose,
  faSignOut,
  faUser,
  faFileAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import logo from "/logo192.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeLogin, removeUser } from "../app/loginSlice"; // Import the actions

const AdminDashboard = () => {
  const [tab, setTab] = useState("empdetails");
  const [menue, setMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch

  // Calculate unread notifications count
  const unreadCount = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  ).length;

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();

    // Load read notifications from localStorage
    const savedReadNotifications = localStorage.getItem("readNotifications");
    if (savedReadNotifications) {
      setReadNotifications(JSON.parse(savedReadNotifications));
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = (notificationId) => {
    if (!readNotifications.includes(notificationId)) {
      const updatedReadNotifications = [...readNotifications, notificationId];
      setReadNotifications(updatedReadNotifications);

      localStorage.setItem(
        "readNotifications",
        JSON.stringify(updatedReadNotifications)
      );
      updateNotificationOnServer(notificationId);
    }
  };

  const updateNotificationOnServer = async (notificationId) => {
    try {
      await fetch(`${baseUrl}/notification/${notificationId}/read/`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.related_file_id) {
      navigate(`/file-details/${notification.related_file_id}/`);
    }

    setShowNotifications(false);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setMenu(false); // Close the menu when a tab is selected
  };

  const handleLogout = () => {
    // Clear localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("readNotifications");
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("level");
    localStorage.removeItem("userId");

    // Update Redux state
    dispatch(removeUser());
    dispatch(removeLogin());

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Large Screen Sidebar - Fixed and 17% width */}
      <div className="hidden md:flex flex-col justify-between fixed left-0 top-0 w-[17%] h-screen bg-[#e7e6e4] p-2 shadow-md z-10">
        <div className="w-[94%]"> 
        <div className="flex justify-center items-center">
          <img
            src={logo}
            className="w-16 h-16 object-cover rounded-full cursor-pointer"
            alt="Logo"
          />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <h3
            onClick={() => handleTabChange("empdetails")}
            className={`cursor-pointer ${
              tab === "empdetails" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md flex items-center gap-2`}
          >
            Employee Details
          </h3>
          <h3
            onClick={() => handleTabChange("filedetails")}
            className={`cursor-pointer ${
              tab === "filedetails" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md flex items-center gap-2`}
          >
            File Details
          </h3>
          <h3
            onClick={() => handleTabChange("register")}
            className={`cursor-pointer ${
              tab === "register" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md flex items-center gap-2`}
          >
            Register Employee
          </h3>
          <h3
            onClick={() => handleTabChange("add-office")}
            className={`cursor-pointer ${
              tab === "add-office" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md flex items-center gap-2`}
          >
            Add Office
          </h3>
          <button
            onClick={() => handleTabChange("notification")}
            className={`cursor-pointer ${
              tab === "notification" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md flex items-center gap-2 relative`}
          >
            <span>Notifications</span>
          </button>
        </div>
        </div>
        <div className="flex items-center justify-center mt-5 mb-3">
          <UserDetails />
        </div>
      </div>

      {/* Small Screen Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex justify-between items-center bg-[#e7e6e4] p-2 w-full shadow-md">
        <img
          src={logo}
          className="w-10 h-10 object-cover rounded-full cursor-pointer"
          alt="Logo"
        />
        <FontAwesomeIcon
          className="text-2xl text-black cursor-pointer"
          icon={menue ? faClose : faBars}
          onClick={() => setMenu(!menue)}
        />
      </div>

      {/* Small Screen Sliding Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#e7e6e4] z-50 shadow-lg transition-all duration-300 ease-in-out ${
          menue ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex justify-end p-4">
          <FontAwesomeIcon
            className="text-2xl text-black cursor-pointer"
            icon={faClose}
            onClick={() => setMenu(false)}
          />
        </div>

        <div className="flex flex-col items-center mt-4">
          <img
            src={logo}
            className="w-20 h-20 object-cover rounded-full"
            alt="Logo"
          />
        </div>

        <div className="flex flex-col mt-8 px-4 gap-4">
          <div className="flex items-center justify-center">
            <UserDetails />
          </div>
          <h3
            onClick={() => handleTabChange("empdetails")}
            className={`cursor-pointer ${
              tab === "empdetails" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md text-center flex items-center gap-2 justify-center`}
          >
            Employee Details
          </h3>

          <h3
            onClick={() => handleTabChange("filedetails")}
            className={`cursor-pointer ${
              tab === "filedetails" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md text-center flex items-center gap-2 justify-center`}
          >
            File Details
          </h3>

          <h3
            onClick={() => handleTabChange("register")}
            className={`cursor-pointer ${
              tab === "register" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md text-center flex items-center gap-2 justify-center`}
          >
            Register Employee
          </h3>

          <h3
            onClick={() => handleTabChange("add-office")}
            className={`cursor-pointer ${
              tab === "add-office" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md text-center flex items-center gap-2 justify-center`}
          >
            Add Office
          </h3>

          <button
            onClick={() => handleTabChange("notification")}
            className={`cursor-pointer ${
              tab === "notification" ? "bg-[#E68332] text-white" : ""
            } hover:bg-[#E68332] text-black hover:text-white font-normal text-lg px-3 py-2 rounded-md text-center flex items-center gap-2 justify-center relative w-full`}
          >
            <span>Notifications</span>
            {/* <FontAwesomeIcon icon={faBell} /> */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-600 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Semi-transparent overlay when menu is open */}
      {menue && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenu(false)}
        ></div>
      )}

      {/* Content Area - Properly positioned relative to sidebar */}
      <div className="w-full mt-12 md:mt-2 md:ml-[17%] md:w-[83%] overflow-y-auto p-4 h-full">
        {tab === "empdetails" && <EmployeeDetails />}
        {tab === "filedetails" && <FileStatus />}
        {tab === "register" && <Registration />}
        {tab === "notification" && <Notification />}
        {tab === "add-office" && <AddOffice />}
      </div>
    </div>
  );
};

export default AdminDashboard;
