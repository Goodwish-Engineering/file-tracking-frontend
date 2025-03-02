import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";

import NotificationsTab from "./NotificationsTab";
import Compose from './FileDetails';
// import InboxTab from "./InboxTab";
import StarredTab from "./StarredTab";
import SentTab from "./SentTab";

const Notification = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
      console.log(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNavigateToFileDetails = (fileId) => {
    console.log(`Navigating to file details: ${fileId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return <NotificationsTab 
          notifications={notifications} 
          onNotificationClick={handleNavigateToFileDetails} 
          baseUrl={baseUrl}
          token={token}
        />;
      case "compose":
        return <Compose />;
      case "inbox":
        return <InboxTab baseUrl={baseUrl} token={token} />;
      case "starred":
        return <StarredTab baseUrl={baseUrl} token={token} />;
      case "sent":
        return <SentTab baseUrl={baseUrl} token={token} />;
      default:
        return <NotificationsTab 
          notifications={notifications} 
          onNotificationClick={handleNavigateToFileDetails}
          baseUrl={baseUrl}
          token={token}
        />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar (Fixed Left) */}
      <div className="fixed left-0 top-0 w-[15%] h-full border-r-2 border-orange-400">
        <ul className="mt-24">
          {/* <li
            className={`px-6 py-3 flex items-center justify-center gap-2 text-gray-700 font-normal text-lg rounded-r-lg border-orange-400 hover:bg-orange-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "compose" ? "bg-orange-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("compose")}
          >
             Compose
          </li> */}
          <li
            className={`px-6 flex justify-center items-center gap-2 py-3 text-gray-700 font-normal text-lg rounded-r-lg border-orange-400 hover:bg-orange-400 hover:text-white text-center mb-2 mr-5 cursor-pointer ${
              activeTab === "notifications" ? "bg-orange-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <MdEmail /> Inbox
          </li>
          <li
            className={`px-6 py-3 flex items-center justify-center gap-2 text-gray-700 font-normal text-lg rounded-r-lg border-orange-400 hover:bg-orange-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "starred" ? "bg-orange-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("starred")}
          >
            <FaStar /> Starred
          </li>
          <li
            className={`px-6 py-3 flex items-center justify-center gap-2 text-gray-700 font-normal text-lg rounded-r-lg border-orange-400 hover:bg-orange-400 hover:text-white mb-2 mr-5 cursor-pointer ${
              activeTab === "sent" ? "bg-orange-400 text-white" : ""
            }`}
            onClick={() => setActiveTab("sent")}
          >
            <PiPaperPlaneRightFill /> Sent
          </li>
        </ul>
      </div>

      {/* Main Content (Right Side) */}
      <div className="ml-[15%] w-[85%] overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Notification;