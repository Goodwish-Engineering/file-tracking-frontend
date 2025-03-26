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
        setUnreadCount(
          data.filter((notification) => !notification.is_read).length
        );
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
    <div className="">
      <div className="sticky top-0 bg-white w-full flex items-center">
        <ul className="flex flex-row items-center w-full">
          <li
            className={`px-6 py-3 flex items-center text-gray-900 font-semibold text-lg rounded-t-lg hover:text-[#E68332] mr-2 cursor-pointer ${
              activeTab === "notifications" ? "text-[#E68332]" : "text-[#E68332]"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {/* <MdEmail /> */}
              </span>
              <span>इनबक्स</span>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </li>
          <li
            className={`px-6 py-3 flex items-center text-gray-900 font-semibold text-lg rounded-t-lg hover:text-[#E68332] mr-2 cursor-pointer ${
              activeTab === "starred" ? "text-[#E68332]" : "text-[#E68332]"
            }`}
            onClick={() => setActiveTab("starred")}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {/* <FaStar /> */}
              </span>
              <span>तारांकित</span>
            </div>
          </li>
        </ul>
      </div>

      <div className=" w-full overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
};

export default Notification;
