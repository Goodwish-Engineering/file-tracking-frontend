import React from "react";
import { FaStar } from "react-icons/fa6";

const NotificationsTab = ({ notifications, onNotificationClick }) => {
  return (
    <>
      <h2 className="text-lg font-semibold border-b border-gray-200 text-orange-800">
        <p className="px-6 pt-2 mt-2">Notifications</p>
      </h2>
      {notifications.length > 0 ? (
        <ul className=" list-none">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-3 px-6 py-6 bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-200 shadow rounded-sm list-none flex justify-between items-center"
              onClick={() => onNotificationClick(notification.related_file_id)}
            >
              <p className="font-normal text-black flex gap-2 items-center">
                <span>
                  <FaStar className=" text-black text-xl hover:text-orange-300" />
                </span>
                <div>
                  <span className="text-md font-semibold">
                    {notification.sender_username}
                  </span>
                  : {notification.message}
                </div>
              </p>
              <p className="text-xs text-gray-900">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-md p-4 border-b border-gray-200 text-gray-900">No new notifications</p>
      )}
    </>
  );
};

export default NotificationsTab;
