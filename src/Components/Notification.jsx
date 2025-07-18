import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  MdEmail, 
  MdOutlineMarkEmailRead, 
  MdMarkChatUnread 
} from "react-icons/md";
import { FaStar, FaBell, FaBellSlash } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";

import NotificationsTab from "./NotificationsTab";
import StarredTab from "./StarredTab";

const Notification = ({ onNotificationRead }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("notifications");
  const [unreadCount, setUnreadCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const unread = data.filter((notification) => !notification.is_read).length;
        const starred = data.filter((notification) => notification.is_starred).length;
        
        setUnreadCount(unread);
        setStarredCount(starred);
        
        if (onNotificationRead) {
          onNotificationRead();
        }
      } else {
        setError("सूचनाहरू लोड गर्न समस्या भयो");
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      setError("सूचनाहरू लोड गर्न समस्या भयो");
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStarredStatus = async (notificationId, currentStatus) => {
    try {
      const response = await fetch(
        `${baseUrl}/notification/${notificationId}/toggle-starred/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({ is_starred: !currentStatus }),
        }
      );

      if (response.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to update starred status");
      }
    } catch (error) {
      console.error("Error updating starred status:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return <NotificationsTab onToggleStarred={toggleStarredStatus} onNotificationRead={fetchNotifications} />;
      case "starred":
        return <StarredTab onToggleStarred={toggleStarredStatus} />;
      case "sent":
        return <div className="p-4 text-center text-gray-500">पठाइएका सूचनाहरू शीघ्र उपलब्ध हुनेछन्</div>;
      default:
        return <NotificationsTab onToggleStarred={toggleStarredStatus} onNotificationRead={fetchNotifications} />;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/mark-all-read/`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with improved styling */}
      <div className="bg-white shadow-md rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-3 sm:mb-0">
            <FaBell className="text-[#E68332] mr-2" /> 
            सूचना प्रणाली
          </h1>
          
          {activeTab === "notifications" && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#E68332] text-white rounded-lg hover:bg-[#d97729] transition-all flex items-center gap-2 text-sm"
            >
              <MdOutlineMarkEmailRead size={18} />
              सबै पढिएको रूपमा मार्क गर्नुहोस्
            </button>
          )}
        </div>
        
        {/* Tab navigation with improved design */}
        <div className="flex items-center overflow-x-auto scrollbar-thin p-1">
          <button
            className={`relative px-6 py-3 flex items-center font-medium text-lg mx-1 rounded-t-lg transition-colors focus:outline-none
              ${activeTab === "notifications"
                ? "text-[#E68332] bg-white border-b-2 border-[#E68332]"
                : "text-gray-600 hover:text-[#E68332] hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("notifications")}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {unreadCount > 0 ? <MdMarkChatUnread className="text-[#E68332]" /> : <MdEmail />}
              </span>
              <span>इनबक्स</span>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
          <button
            className={`relative px-6 py-3 flex items-center font-medium text-lg mx-1 rounded-t-lg transition-colors focus:outline-none
              ${activeTab === "starred"
                ? "text-[#E68332] bg-white border-b-2 border-[#E68332]"
                : "text-gray-600 hover:text-[#E68332] hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("starred")}
          >
            <div className="flex items-center">
              <span className="mr-2">
                <FaStar className={activeTab === "starred" ? "text-[#E68332]" : ""} />
              </span>
              <span>तारांकित</span>
              {starredCount > 0 && (
                <span className="ml-2 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {starredCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && activeTab === "notifications" && (
        <div className="flex justify-center items-center p-6">
          <div className="loader"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Content area with animation */}
      <div className="w-full overflow-y-auto bg-white rounded-lg shadow-md animate-fadeIn">
        {renderTabContent()}
      </div>
      
      {/* CSS for animations and scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 4px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #E68332;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Notification;
