import React, { useState, useEffect } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faClose } from "@fortawesome/free-solid-svg-icons";
import UserDetails from "./UserDetails";
import logo from "/logo192.png";
import NonTransferFile from "../Components/NonTranferFile";
// import Notification from "../Components/Notification";
import FileRequest from "../Components/FileRequest";
import TransferedFile from "../Components/TransferedFiles";
import EmployeeHome from "./EmployeeHome";
import Notification from "../Components/Notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmployeHeader = () => {
  const [tab, setTab] = useState("notification");
  const [menue, setMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const level = localStorage.getItem("level");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Calculate unread notifications count
  const unreadCount = notifications.filter(
    notification => !readNotifications.includes(notification.id)
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
    // Add to read notifications if not already read
    if (!readNotifications.includes(notificationId)) {
      const updatedReadNotifications = [...readNotifications, notificationId];
      setReadNotifications(updatedReadNotifications);
      
      // Save to localStorage for persistence
      localStorage.setItem("readNotifications", JSON.stringify(updatedReadNotifications));
      
      // Optionally notify backend that notification was read
      updateNotificationOnServer(notificationId);
    }
  };
  
  const updateNotificationOnServer = async (notificationId) => {
    try {
      // You can implement this to update the read status on your backend
      await fetch(`${baseUrl}/notification/${notificationId}/read/`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark the notification as read
    markAsRead(notification.id);
    
    // Navigate to the file details page if there's a related file
    if (notification.related_file_id) {
      navigate(`/file-details/${notification.related_file_id}/`);
    }
    
    setShowNotifications(false);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setMenu(false); // Close the menu when a tab is selected
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Large Screen Top Bar - Full Width */}
      <div className="w-full sticky top-0 z-10 hidden md:flex bg-[#3F84E5] p-2 justify-between items-center">
        <div className="flex items-center">
          <img
            // onClick={() => setTab("employeehome")}
            src={logo}
            className="w-16 h-16 object-cover rounded-full cursor-pointer"
            alt="Logo"
          />
        </div>
        <div className="flex gap-5">
          {level === "1" && (
            <h3
              onClick={() => setTab("uploadTippani")}
              className={`cursor-pointer ${
                tab === "uploadTippani" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
            >
              Upload File
            </h3>
          )}
          <h3
            onClick={() => setTab("veiwStatus")}
            className={`cursor-pointer ${
              tab === "veiwStatus" ? "bg-[#3571C5]" : ""
            } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
          >
            File Status
          </h3>
          <h3
            onClick={() => setTab("notification")}
            className={`cursor-pointer ${
              tab === "notification" ? "bg-[#3571C5]" : ""
            } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
          >
            Notification
          </h3>
          {level === "1" ? (
            <>
              <h3
              onClick={() => setTab("nontransfer")}
              className={`cursor-pointer ${
                tab === "nontransfer" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
            >
              Non-transfer file
            </h3>
            <h3
              onClick={() => setTab("transfered")}
              className={`cursor-pointer ${
                tab === "transfered" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
            >
              Transfered file
            </h3>
            </>
          ) : (
            <h3
              onClick={() => setTab("filerequest")}
              className={`cursor-pointer ${
                tab === "filerequest" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-1 rounded-md`}
            >
              File Request
            </h3>
          )}
          <div>
            <UserDetails />
          </div>
        </div>
      </div>

      {/* Small Screen Header */}
      <div className="md:hidden sticky top-0 z-10 flex bg-[#3F84E5] p-4 justify-between items-center">
        <div className="flex items-center">
          <img
            // onClick={() => handleTabChange("employeehome")}
            src={logo}
            className="w-10 h-10 object-cover rounded-full cursor-pointer"
            alt="Logo"
          />
          {/* <h2 className="ml-2 text-white font-bold text-lg">File System</h2> */}
        </div>
        <FontAwesomeIcon
          className="text-2xl text-white cursor-pointer"
          icon={menue ? faClose : faBars}
          onClick={() => setMenu(!menue)}
        />
      </div>

      {/* Small Screen Sliding Navigation Menu */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-[#3F84E5] z-50 shadow-lg transition-all duration-300 ease-in-out ${
          menue ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex justify-end p-4">
          <FontAwesomeIcon
            className="text-2xl text-white cursor-pointer"
            icon={faClose}
            onClick={() => setMenu(false)}
          />
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <img
            src={logo}
            onClick={() => setTab("employeehome")}
            className="w-20 h-20 object-cover rounded-full"
            alt="Logo"
          />
          {/* <h2 className="text-white font-bold text-xl mt-2">File System</h2> */}
        </div>
          <div className="mt-4 flex items-center justify-center">
            <UserDetails />
          </div>
        
        <div className="flex flex-col mt-8 px-4 gap-4">
          
          {level === "1" && (
            <h3
              onClick={() => handleTabChange("uploadTippani")}
              className={`cursor-pointer ${
                tab === "uploadTippani" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
            >
              Upload File
            </h3>
          )}
          
          <h3
            onClick={() => handleTabChange("veiwStatus")}
            className={`cursor-pointer ${
              tab === "veiwStatus" ? "bg-[#3571C5]" : ""
            } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
          >
            File Status
          </h3>
          
          {level === "1" ? (
            <>
              <h3
              onClick={() => handleTabChange("nontransfer")}
              className={`cursor-pointer ${
                tab === "nontransfer" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
            >
              Non-transfer file
            </h3>
            <h3
              onClick={() => handleTabChange("transfered")}
              className={`cursor-pointer ${
                tab === "transfered" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
            >
              Transfered file
            </h3>
            </>           
          ) : (
            <h3
              onClick={() => handleTabChange("filerequest")}
              className={`cursor-pointer ${
                tab === "filerequest" ? "bg-[#3571C5]" : ""
              } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
            >
              File Request
            </h3>
          )}
          
          <h3
            onClick={() => handleTabChange("notification")}
            className={`cursor-pointer ${
              tab === "notification" ? "bg-[#3571C5]" : ""
            } hover:bg-[#3571C5] text-white font-semibold text-lg px-3 py-2 rounded-md text-center`}
          >
            Notifications
          </h3>
        </div>
      </div>

      {/* Semi-transparent overlay when menu is open */}
      {menue && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenu(false)}
        ></div>
      )}

      {/* Large Screen Notification Icon - Bottom Left */}
      {/* <div className="hidden md:flex fixed bottom-5 left-5 z-30"> */}
        {/* <div className="relative">
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-[#3F84E5] rounded-full shadow-lg hover:bg-orange-500 transition"
          >
            <FontAwesomeIcon icon={faBell} className="text-white text-2xl" />
          </button>
        </div> */}

        {/* Large Screen Notification Popup */}
        {/* {showNotifications && (
          <div className="absolute bottom-16 left-0 w-80 bg-white shadow-lg rounded-md p-4 z-50 border border-gray-200">
            <h3 className="text-lg font-semibold text-orange-700">Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="mt-2 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-3 ${
                      readNotifications.includes(notification.id) 
                        ? "bg-gray-100 border-l-4 border-gray-400" 
                        : "bg-orange-100 border-l-4 border-orange-500"
                    } shadow-md rounded-md cursor-pointer mb-2`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className="text-sm font-medium text-orange-900">
                      <span className="font-bold">{notification.sender_username}</span>: {notification.message}
                    </p>
                    <p className="text-xs text-orange-700">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-orange-700 mt-2">No new notifications</p>
            )}
          </div>
        )}
      </div> */}

      {/* Small Screen Notification Icon - Bottom Right */}
      {/* <div className="md:hidden fixed bottom-5 right-5 z-30"> */}
        {/* <div className="relative">
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-[#3F84E5] rounded-full shadow-lg hover:bg-orange-500 transition"
          >
            <FontAwesomeIcon icon={faBell} className="text-white text-xl" />
          </button>
        </div> */}

        {/* Small Screen Notification Popup */}
        {/* {showNotifications && (
          <div className="absolute bottom-16 right-0 w-72 bg-white shadow-lg rounded-md p-4 z-50 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-orange-700">Notifications</h3>
              <FontAwesomeIcon
                className="text-orange-700 cursor-pointer"
                icon={faClose}
                onClick={() => setShowNotifications(false)}
              />
            </div>
            {notifications.length > 0 ? (
              <ul className="mt-2 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-3 ${
                      readNotifications.includes(notification.id) 
                        ? "bg-gray-100 border-l-4 border-gray-400" 
                        : "bg-orange-100 border-l-4 border-orange-500"
                    } shadow-md rounded-md cursor-pointer mb-2`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className="text-sm font-medium text-orange-900">
                      <span className="font-bold">{notification.sender_username}</span>: {notification.message}
                    </p>
                    <p className="text-xs text-orange-700">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-orange-700 mt-2">No new notifications</p>
            )}
          </div>
        )}
      </div> */}

      {/* Content Area */}
      <div className="w-full flex flex-col">
        {tab === "uploadTippani" && <UploadTipanni />}
        {tab === "veiwStatus" && <FileStatus />}
        {tab === "nontransfer" && <NonTransferFile />}
        {tab === "filerequest" && <FileRequest />}
        {/* {tab === "notification" && <Notification />} */}
        {tab === "employeehome" && <EmployeeHome />}
        {tab === "notification" && <Notification/>}
        {tab === "transfered" && <TransferedFile/>}
      </div>
    </div>
  );
};

export default EmployeHeader;