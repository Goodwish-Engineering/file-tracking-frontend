import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StarredTab = ({ onToggleStarred }) => {
  const [starredNotifications, setStarredNotifications] = useState([]);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStarredNotifications();
  }, []);

  const fetchStarredNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStarredNotifications(
          data.filter((notification) => notification.is_starred)
        );
      } else {
        console.error("Failed to fetch starred notifications");
      }
    } catch (error) {
      console.error("Error fetching starred notifications:", error);
    }
  };

  // const getUserColor = (firstName, lastName) => {
  //   const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  //   const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700'];
  //   return colors[initials.charCodeAt(0) % colors.length];
  // };

  // const getInitials = (firstName, lastName) => {
  //   return `${firstName[0]}${lastName[0]}`.toUpperCase();
  // };

  return (
    <div className="">
      <h2 className="text-lg font-normal mt-3 mb-1 mx-5">तारांकित सूचना</h2>
      {starredNotifications.length > 0 ? (
        <ul className="list-none">
          {starredNotifications.map((notification) => {
            const firstName = notification.related_file.present_by.first_name;
            const lastName = notification.related_file.present_by.last_name;

            return (
              <li
                key={notification.id}
                className={`p-3 px-6 py-6 hover:bg-[#e8e6e6] cursor-pointer border bg-white mb-3 rounded-md border-gray-100 shadow list-none text-nowrap items-center w-[100%]
                  ${
                    notification.is_read
                      ? "bg-white"
                      : "bg-[#F8F8F8] font-semibold"
                  }`}
                  onClick={() => {
                    navigate(`/file-details/${notification.related_file.id}/`);
                  }}>
                <div className="flex justify-between items-center border-gray-300 text-nowrap">
                  <div className="flex items-center justify-around gap-6">
                    <div className="flex items-center gap-3">
                    </div>
                    <div className="flex gap-20 items-center justify-around">
                      <div className="flex items-center gap-3 justify-around">
                        <h3>
                          {firstName} {lastName}
                        </h3>
                      </div>
                      <div className="flex gap-20 items-center justify-around">
                        <h3>{notification.related_file.file_number}</h3>
                        <h3>{notification.related_file.subject}</h3>
                      </div>
                    </div>
                  </div>
                  <div>
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-md p-4 border-b border-gray-200 text-gray-900">
          No new notifications
        </p>
      )}
    </div>
  );
};

export default StarredTab;
