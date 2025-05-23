import React, { useState, useEffect } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faSignOutAlt, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import UserDetails from "./UserDetails";
import logo from "/logo192.png";
import NonTransferFile from "../Components/NonTranferFile";
import FileRequest from "../Components/FileRequest";
import TransferedFile from "../Components/TransferedFiles";
import EmployeeHome from "./EmployeeHome";
import Notification from "../Components/Notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFile, FaRegFileAlt, FaUserCircle } from "react-icons/fa";
import { AiFillAppstore } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { FiShieldOff } from "react-icons/fi";
import { MdOutlineTurnRight, MdDashboard } from "react-icons/md";
import NonTransferFile3 from "../Components/NonTransfer3";

const EmployeHeader = () => {
  // Get activeTab from localStorage if exists, otherwise default to notification
  const [tab, setTab] = useState(localStorage.getItem("activeTab") || "employeehome");
  const [menue, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fileUploadDropdownOpen, setFileUploadDropdownOpen] = useState(false);
  const level = localStorage.getItem("level");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // New state for notification count
  const [notificationCount, setNotificationCount] = useState(0);

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
      
      // Count unread notifications
      const unreadCount = data.filter(n => !n.is_read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for notifications every 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Clear the activeTab in localStorage when user manually changes tabs
  const handleTabChange = (newTab) => {
    localStorage.removeItem("activeTab"); // Clear stored tab when user navigates
    setTab(newTab);
    setMenu(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    navigate("/login");
  };

  // Reusable NavItem component with enhanced styling
  const NavItem = ({ onClick, isActive, icon, label, badge, section }) => {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer transition-all duration-300 mb-1 ${
          isActive
            ? "bg-gradient-to-r from-[#E68332] to-[#f39b58] text-white shadow-md"
            : "text-gray-700 hover:bg-[#f0ebe7]"
        } font-normal text-lg px-4 py-3 rounded-md flex items-center justify-between relative group`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl ${isActive ? "text-white" : "text-[#E68332]"}`}>
            {icon}
          </span>
          <span className={`${isActive ? "font-medium" : ""}`}>{label}</span>
        </div>
        
        {badge > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
        
        {section && (
          <div className="absolute left-0 w-1 h-full bg-[#E68332] rounded-r-md transform scale-y-0 origin-left group-hover:scale-y-100 transition-transform duration-300"></div>
        )}
      </div>
    );
  };
  
  // Section title component
  const SectionTitle = ({ title }) => (
    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">
      {title}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full relative">
      {/* Large Screen Sidebar - hidden on mobile */}
      <div className="h-screen rounded-lg left-0 sticky w-[18%] top-0 z-10 hidden md:flex flex-col bg-white p-2 shadow-lg border-r">
        <div className="h-full flex flex-col justify-between">
          {/* Logo and app name */}
          <div>
            <div className="flex items-center justify-center gap-2 py-6 border-b mb-2">
              <img
                src={logo}
                className="w-12 h-12 object-cover rounded-full cursor-pointer border-2 border-[#E68332]"
                alt="Logo"
              />
              <div>
                <h2 className="text-lg font-bold text-[#E68332]">फाइल ट्र्याकिंग</h2>
                <p className="text-xs text-gray-500">प्रशासनिक प्रणाली</p>
              </div>
            </div>
            
            {/* Dashboard section */}
            <SectionTitle title="ड्यासबोर्ड" />
            <NavItem
              onClick={() => setTab("employeehome")}
              isActive={tab === "employeehome"}
              icon={<MdDashboard />}
              label="होम"
            />
            
            {/* File Management Section */}
            <SectionTitle title="फाइल व्यवस्थापन" />
            
            {level === "1" && (
              <NavItem
                onClick={() => setTab("uploadTippani")}
                isActive={tab === "uploadTippani"}
                icon={<FaFile />}
                label="फाइल अपलोड"
              />
            )}
            
            <NavItem
              onClick={() => setTab("veiwStatus")}
              isActive={tab === "veiwStatus"}
              icon={<AiFillAppstore />}
              label="फाइलको स्थिति"
            />
            
            {/* Conditional sections based on level */}
            {level !== "1" && (
              <>
                {level === "2" && (
                  <NavItem
                    onClick={() => setTab("nontransfer")}
                    isActive={tab === "nontransfer"}
                    icon={<FiShieldOff />}
                    label="स्थानान्तरण नगरिएको फाइल"
                  />
                )}
                {(level === "3" || level === "4") && (
                  <NavItem
                    onClick={() => handleTabChange("nontransfer3")}
                    isActive={tab === "nontransfer3"}
                    icon={<FiShieldOff />}
                    label="स्थानान्तरण नगरिएको"
                  />
                )}
                <NavItem
                  onClick={() => setTab("transfered")}
                  isActive={tab === "transfered"}
                  icon={<MdOutlineTurnRight />}
                  label="स्थानान्तरण गरिएको"
                />
                <NavItem
                  onClick={() => setTab("filerequest")}
                  isActive={tab === "filerequest"}
                  icon={<FaRegFileAlt />}
                  label="फाइल अनुरोध"
                />
              </>
            )}
            
            {/* Notifications section */}
            <SectionTitle title="सूचना" />
            <NavItem
              onClick={() => setTab("notification")}
              isActive={tab === "notification"}
              icon={<IoIosNotifications />}
              label="सूचनाहरू"
              badge={notificationCount}
            />
          </div>
          
          {/* User info and logout section */}
          <div className="mt-auto">
            <div className="border-t pt-4 px-2">
              <UserDetails />
              <div 
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 hover:bg-red-50 p-3 rounded-md cursor-pointer mt-2 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>लग आउट</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - only visible on small screens */}
      <div className="sticky top-0 z-20 md:hidden w-full bg-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              className="w-10 h-10 object-cover rounded-full border-2 border-[#E68332]"
              alt="Logo"
            />
            <h2 className="text-lg font-bold text-[#E68332]">फाइल ट्र्याकिंग</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" onClick={() => setTab("notification")}>
              <IoIosNotifications className="text-2xl text-[#E68332]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl text-[#E68332] cursor-pointer"
              onClick={() => setMenu(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu - appears only when menu state is true */}
      {menue && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMenu(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-screen bg-white z-40 transition-all duration-300 ease-in-out shadow-xl md:hidden ${
          menue ? "w-72" : "w-0 opacity-0"
        }`}
      >
        <div className="p-4 flex justify-end">
          <FontAwesomeIcon
            icon={faClose}
            className="text-2xl text-[#E68332] cursor-pointer"
            onClick={() => setMenu(false)}
          />
        </div>

        <div className="flex flex-col items-center border-b pb-4">
          <img
            src={logo}
            className="w-16 h-16 object-cover rounded-full border-2 border-[#E68332]"
            alt="Logo"
          />
          <h2 className="text-lg font-bold text-[#E68332] mt-2">फाइल ट्र्याकिंग सिस्टम</h2>
          <div className="mt-4 w-full px-4">
            <UserDetails />
          </div>
        </div>

        <div className="flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Dashboard section */}
          <SectionTitle title="ड्यासबोर्ड" />
          <NavItem
            onClick={() => handleTabChange("employeehome")}
            isActive={tab === "employeehome"}
            icon={<MdDashboard />}
            label="होम"
          />
          
          {/* File Management Section */}
          <SectionTitle title="फाइल व्यवस्थापन" />
          
          {level === "1" && (
            <NavItem
              onClick={() => handleTabChange("uploadTippani")}
              isActive={tab === "uploadTippani"}
              icon={<FaFile />}
              label="फाइल अपलोड"
            />
          )}
          
          <NavItem
            onClick={() => handleTabChange("veiwStatus")}
            isActive={tab === "veiwStatus"}
            icon={<AiFillAppstore />}
            label="फाइलको स्थिति"
          />
          
          {level !== "1" && (
            <>
              {level === "2" && (
                <NavItem
                  onClick={() => handleTabChange("nontransfer")}
                  isActive={tab === "nontransfer"}
                  icon={<FiShieldOff />}
                  label="स्थानान्तरण नगरिएको"
                />
              )}
              {(level === "3" || level === "4") && (
                <NavItem
                  onClick={() => handleTabChange("nontransfer3")}
                  isActive={tab === "nontransfer3"}
                  icon={<FiShieldOff />}
                  label="स्थानान्तरण नगरिएको"
                />
              )}
              <NavItem
                onClick={() => handleTabChange("transfered")}
                isActive={tab === "transfered"}
                icon={<MdOutlineTurnRight />}
                label="स्थानान्तरण गरिएको"
              />
              <NavItem
                onClick={() => handleTabChange("filerequest")}
                isActive={tab === "filerequest"}
                icon={<FaRegFileAlt />}
                label="फाइल अनुरोध"
              />
            </>
          )}
          
          {/* Notifications section */}
          <SectionTitle title="सूचना" />
          <NavItem
            onClick={() => handleTabChange("notification")}
            isActive={tab === "notification"}
            icon={<IoIosNotifications />}
            label="सूचनाहरू"
            badge={notificationCount}
          />
        </div>
        
        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-red-50 text-red-500 hover:bg-red-100 p-3 rounded-md cursor-pointer transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>लग आउट</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-[82%] flex flex-col p-4 bg-gray-50 min-h-screen">
        {tab === "employeehome" && <EmployeeHome />}
        {tab === "uploadTippani" && <UploadTipanni />}
        {tab === "veiwStatus" && <FileStatus />}
        {tab === "nontransfer" && <NonTransferFile />}
        {tab === "filerequest" && <FileRequest />}
        {tab === "notification" && <Notification onNotificationRead={fetchNotifications} />}
        {tab === "transfered" && <TransferedFile />}
        {tab === "nontransfer3" && <NonTransferFile3 />}
      </div>
    </div>
  );
};

export default EmployeHeader;
