import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";

import NotificationsTab from "./NotificationsTab";
import StarredTab from "./StarredTab";
import SentTab from "./SentTab";

const Notification = () => {  
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("notifications");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.filter(notification => !notification.is_read).length);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleStarredStatus = async (notificationId, currentStatus) => {
    try {
      const response = await fetch(`${baseUrl}/notification/${notificationId}/toggle-starred/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ is_starred: !currentStatus }),
      });

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
        return <NotificationsTab onToggleStarred={toggleStarredStatus} />;
      case "starred":
        return <StarredTab onToggleStarred={toggleStarredStatus} />;
      case "sent":
        return <SentTab />;
      default:
        return <NotificationsTab onToggleStarred={toggleStarredStatus} />;
    }
  };

  return (
    <div className="flex">
      <div className="fixed left-0 top-0 w-[15%] h-full border-r-2 border-blue-400">
        <ul className="mt-28">
          <li
            className={`px-6 py-3 flex items-center text-gray-700 font-normal text-lg rounded-r-lg border-blue-400 hover:bg-blue-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "notifications" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <div className="flex items-center w-full">
              <span className="w-8"><MdEmail /></span>
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </li>
          <li
            className={`px-6 py-3 flex items-center text-gray-700 font-normal text-lg rounded-r-lg border-blue-400 hover:bg-blue-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "starred" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("starred")}
          >
            <div className="flex items-center w-full">
              <span className="w-8"><FaStar /></span>
              <span>Starred</span>
            </div>
          </li>
          {/* <li
            className={`px-6 py-3 flex items-center text-gray-700 font-normal text-lg rounded-r-lg border-blue-400 hover:bg-blue-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "sent" ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("sent")}
          >
            <div className="flex items-center w-full">
              <span className="w-8"><PiPaperPlaneRightFill /></span>
              <span>Sent</span>
            </div>
          </li> */}
        </ul>
      </div>

      <div className="ml-[15%] w-[85%] overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Notification;
