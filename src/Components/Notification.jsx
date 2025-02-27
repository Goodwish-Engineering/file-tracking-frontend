import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
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
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="p-4 bg-orange-100 rounded-md my-7 w-[90%] max-w-md mx-auto shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-orange-800">
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2 ">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-3 bg-orange-200 border-l-4 cursor-pointer border-orange-500 shadow rounded-md"
              onClick={() => {
                navigate(`/file-details/${notification.related_file_id}/`);
              }}
            >
              <p className="text-sm font-medium text-orange-900">
                <span className="font-bold">
                  {notification.sender_username}
                </span>
                : {notification.message}
              </p>
              <p className="text-xs text-orange-700">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-orange-700">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
