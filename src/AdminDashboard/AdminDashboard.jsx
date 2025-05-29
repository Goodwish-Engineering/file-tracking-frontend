import React, { useState, useEffect } from "react";
import EmployeeDetails from "./EmployeeDetails";
import Registration from "../Components/Register";
import FileStatus from "../Components/FileStatus";
import Notification from "../Components/Notification";
import UserDetails from "../EmployeeDashboard/UserDetails";
import AddOffice from "./AddOffice";
import DeletedFile from "../Components/DeletedFile";
import { 
  FaBuilding, 
  FaUserCog, 
  FaFileAlt, 
  FaUserPlus, 
  FaExchangeAlt,
  FaTrashAlt,
  FaBell,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logo from "/logo192.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeLogin, removeUser } from "../app/loginSlice";
import NonTransferFile3 from "../Components/NonTransfer3";
import TransferedFile from "../Components/TransferedFiles";
import AdminDashboardHome from "./AdminDashboardHome"; // We'll create this component later

const AdminDashboard = () => {
  const [tab, setTab] = useState(localStorage.getItem("adminTab") || "dashboard");
  const [menue, setMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Save selected tab to localStorage
  useEffect(() => {
    localStorage.setItem("adminTab", tab);
  }, [tab]);
  
  // Listen for tab change events from AdminDashboardHome
  useEffect(() => {
    const handleAdminTabChange = () => {
      const newTab = localStorage.getItem("adminTab");
      setTab(newTab);
    };
    
    window.addEventListener('adminTabChange', handleAdminTabChange);
    
    return () => {
      window.removeEventListener('adminTabChange', handleAdminTabChange);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for notifications every 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(intervalId);
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
      
      // Count unread notifications
      const unreadCount = data.filter(n => !n.is_read).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setMenu(false);
  };

  const handleLogout = () => {
    setIsLoading(true);
    
    // Clear localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("readNotifications");
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("level");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminTab");

    // Update Redux state
    dispatch(removeUser());
    dispatch(removeLogin());

    // Navigate to login page
    navigate("/login");
  };

  // Sidebar navigation items
  const navItems = [
    { id: "dashboard", label: "डास्हबोर्ड", icon: <MdDashboard /> },
    { id: "empdetails", label: "कर्मचारी विवरण", icon: <FaUserCog /> },
    { id: "filedetails", label: "फाइल विवरण", icon: <FaFileAlt /> },
    { id: "register", label: "कर्मचारी दर्ता", icon: <FaUserPlus /> },
    { id: "add-office", label: "शाखा व्यवस्थापन", icon: <FaBuilding /> },
    { id: "nontransfer3", label: "स्थानान्तरण नगरिएको", icon: <FaExchangeAlt /> },
    { id: "transfered", label: "स्थानान्तरण गरिएको", icon: <FaExchangeAlt /> },
    { id: "deleted-files", label: "मेटिएका फाइलहरू", icon: <FaTrashAlt /> },
    { id: "notification", label: "सूचनाहरू", icon: <FaBell />, badge: unreadCount }
  ];

  const renderContent = () => {
    switch (tab) {
      case "dashboard": 
        return <AdminDashboardHome />;
      case "empdetails":
        return <EmployeeDetails />;
      case "filedetails":
        return <FileStatus />;
      case "register":
        return <Registration />;
      case "notification":
        return <Notification onNotificationRead={fetchNotifications} />;
      case "add-office":
        return <AddOffice />;
      case "nontransfer3":
        return <NonTransferFile3 />;
      case "transfered":
        return <TransferedFile />;
      case "deleted-files":
        return <DeletedFile />;
      default:
        return <AdminDashboardHome />;
    }
  };

  // NavItem Component for sidebar
  const NavItem = ({ item, onClick }) => (
    <div
      onClick={() => onClick(item.id)}
      className={`cursor-pointer transition-all duration-200 mb-1 ${
        tab === item.id
          ? "bg-gradient-to-r from-[#E68332] to-[#FF9F4A] text-white shadow-md"
          : "text-gray-700 hover:bg-[#f0ebe7]"
      } font-medium px-4 py-3 rounded-md flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-xl ${tab === item.id ? "text-white" : "text-[#E68332]"}`}>
          {item.icon}
        </span>
        <span>{item.label}</span>
      </div>
      
      {item.badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen bg-white shadow-lg overflow-y-auto fixed left-0">
        <div className="flex flex-col h-full">
          {/* Logo and header */}
          <div className="flex items-center justify-center space-x-2 py-5 px-4 border-b border-gray-200">
            <img
              src={logo}
              className="w-12 h-12 object-cover rounded-full border-2 border-[#E68332]"
              alt="Logo"
            />
            <div>
              <h2 className="text-lg font-bold text-[#E68332]">फाइल ट्र्याकिंग</h2>
              <p className="text-xs text-gray-500">प्रशासक पोर्टल</p>
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="flex-grow py-5 px-2">
            <div className="space-y-1">
              {navItems.map(item => (
                <NavItem key={item.id} item={item} onClick={handleTabChange} />
              ))}
            </div>
          </div>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-center mb-3">
              <UserDetails />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              disabled={isLoading}
            >
              <FaSignOutAlt />
              <span>{isLoading ? "निष्कासन गर्दै..." : "लग आउट गर्नुहोस्"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-[#E68332]"
            />
            <div>
              <h1 className="font-bold text-[#E68332]">फाइल ट्र्याकिंग</h1>
              <p className="text-xs text-gray-500">प्रशासक</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleTabChange("notification")}
              className="relative text-[#E68332]"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenu(!menue)} className="text-[#E68332]">
              {menue ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          menue ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenu(false)}
      ></div>

      <div
        className={`fixed top-0 bottom-0 right-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menue ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#E68332]">प्रशासक मेनू</h2>
            <button onClick={() => setMenu(false)} className="text-gray-500">
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          {/* Mobile Navigation Links */}
          <div className="flex-grow overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map(item => (
                <NavItem key={item.id} item={item} onClick={handleTabChange} />
              ))}
            </div>
          </div>
          
          {/* User section in mobile menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-center mb-3">
              <UserDetails />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              disabled={isLoading}
            >
              <FaSignOutAlt />
              <span>{isLoading ? "निष्कासन गर्दै..." : "लग आउट गर्नुहोस्"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:ml-64 pt-16 md:pt-0 px-4 pb-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
