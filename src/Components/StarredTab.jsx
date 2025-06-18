import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdSearch,
  MdFilterList,
  MdCheck,
} from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";
import { FaFileAlt, FaExternalLinkAlt, FaRegStar } from "react-icons/fa";

const StarredTab = ({ onToggleStarred }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [starredNotifications, setStarredNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, read, unread
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest

  useEffect(() => {
    fetchStarredNotifications();
  }, []);

  useEffect(() => {
    // Apply filters and search whenever notifications change or filter settings change
    applyFiltersAndSearch();
  }, [starredNotifications, searchQuery, filterType, sortOrder]);

  const fetchStarredNotifications = async () => {
    if (!baseUrl) {
      console.error("Base URL is not defined");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch starred notifications");

      const data = await response.json();
      const starred = data.filter((notification) => notification.is_starred);
      setStarredNotifications(starred);
      setFilteredNotifications(starred);
    } catch (error) {
      console.error("Error fetching starred notifications:", error);
      setError("तारांकित सूचनाहरू लोड गर्न समस्या भयो");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and search based on current settings
  const applyFiltersAndSearch = () => {
    let results = [...starredNotifications];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (notification) =>
          (notification.message &&
            notification.message.toLowerCase().includes(query)) ||
          (notification.related_file?.file_number &&
            notification.related_file.file_number
              .toLowerCase()
              .includes(query)) ||
          (notification.related_file?.subject &&
            notification.related_file.subject.toLowerCase().includes(query)) ||
          (notification.related_file?.present_by?.first_name &&
            notification.related_file.present_by.first_name
              .toLowerCase()
              .includes(query)) ||
          (notification.related_file?.present_by?.last_name &&
            notification.related_file.present_by.last_name
              .toLowerCase()
              .includes(query))
      );
    }

    // Apply read/unread filter
    if (filterType === "read") {
      results = results.filter((notification) => notification.is_read);
    } else if (filterType === "unread") {
      results = results.filter((notification) => !notification.is_read);
    }

    // Apply sort order
    results.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifications(results);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.related_file || !notification.related_file.id) {
      console.error("Related file ID not found");
      return;
    }

    const fileId = notification.related_file.id;

    try {
      // Mark the notification as read if it's not already read
      if (!notification.is_read) {
        const response = await fetch(
          `${baseUrl}/notification/${notification.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify({ is_read: true }),
          }
        );

        if (response.ok) {
          // Update the UI to show the notification as read
          setStarredNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n
            )
          );
        }
      }

      // Navigate to file details page
      navigate(`/file-details/${fileId}/`);
    } catch (error) {
      console.error("Error in handleNotificationClick:", error);
    }
  };

  const toggleStarred = async (notification, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event

    try {
      const updatedStarredStatus = !notification.is_starred;

      const response = await fetch(
        `${baseUrl}/notification/${notification.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({ is_starred: updatedStarredStatus }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to update starred notification");

      // Since we're removing the star, remove it from the list
      if (!updatedStarredStatus) {
        setStarredNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n.id !== notification.id)
        );
      }

      // Call parent component's callback if available
      if (onToggleStarred) {
        onToggleStarred(notification.id, notification.is_starred);
      }
    } catch (error) {
      console.error("Error updating starred status:", error);
    }
  };

  const getUserColor = (username) => {
    // Create a simple hash from the user's name
    const name = `${username || ""}`;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // List of colors to choose from
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    // Use the hash to select a color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (username) => {
    if (username && username.length > 0) {
      return username[0].toUpperCase(); // Return the first character of the username as the initials
    }
    return "";
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      // Yesterday
      return "हिजो";
    } else if (diffDays < 7) {
      // Within last week
      const days = [
        "आइतबार",
        "सोमबार",
        "मंगलबार",
        "बुधबार",
        "बिहिबार",
        "शुक्रबार",
        "शनिबार",
      ];
      return days[date.getDay()];
    } else {
      // More than a week ago
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-200 h-10 w-10 mb-4"></div>
          <div className="h-2 bg-slate-200 rounded w-48 mb-2.5"></div>
          <div className="h-2 bg-slate-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={fetchStarredNotifications}
          className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
        >
          पुन: प्रयास गर्नुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto pb-6">
      {/* Search and filters bar */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200 p-4 mb-2">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] sm:text-sm transition duration-150 ease-in-out"
              placeholder="तारांकित सूचनाहरू खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center p-2 border ${
                showFilters
                  ? "bg-[#E68332] text-white border-[#E68332]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E68332]`}
              title="फिल्टरहरू"
            >
              <MdFilterList className="h-5 w-5" />
            </button>

            <button
              onClick={() =>
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E68332]"
              title={
                sortOrder === "newest"
                  ? "नयाँ देखि पुरानो"
                  : "पुरानो देखि नयाँ"
              }
            >
              <BiSortAlt2 className="h-5 w-5" />
              <span className="ml-1 text-xs">
                {sortOrder === "newest" ? "नयाँ" : "पुरानो"}
              </span>
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg animate-slideDown">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                  filterType === "all"
                    ? "bg-[#E68332] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <MdCheck
                  className={
                    filterType === "all" ? "opacity-100" : "opacity-0"
                  }
                />
                सबै
              </button>

              <button
                onClick={() => setFilterType("read")}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                  filterType === "read"
                    ? "bg-[#E68332] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <MdCheck
                  className={
                    filterType === "read" ? "opacity-100" : "opacity-0"
                  }
                />
                पढिएका
              </button>

              <button
                onClick={() => setFilterType("unread")}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                  filterType === "unread"
                    ? "bg-[#E68332] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <MdCheck
                  className={
                    filterType === "unread" ? "opacity-100" : "opacity-0"
                  }
                />
                नपढिएका
              </button>
            </div>
          </div>
        )}
      </div>

      {/* No results message */}
      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <FaRegStar className="text-gray-300 text-6xl mb-4" />
          <h3 className="text-xl font-medium mb-2">कुनै तारांकित सूचना फेला परेन</h3>
          <p className="text-center text-gray-500 max-w-md">
            {filterType !== "all" || searchQuery
              ? "तपाइँको खोज मापदण्ड अनुसार कुनै तारांकित सूचना फेला परेन।"
              : "तपाइँले अझै कुनै सूचनालाई तारांकित गर्नुभएको छैन। महत्वपूर्ण सूचनाहरूलाई तारांकित गर्नुहोस्।"}
          </p>
          {(filterType !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilterType("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              सबै तारांकित सूचनाहरू देखाउनुहोस्
            </button>
          )}
        </div>
      )}

      {/* Notifications list */}
      <ul className="divide-y divide-gray-200">
        {filteredNotifications.map((notification, index) => {
          const username =
            notification?.related_file?.present_by?.username || "N/A";
          const userColor = getUserColor(username);
          const initials = getInitials(username);
          const formattedDate = formatDate(notification.created_at);

          return (
            <li
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                !notification.is_read ? "bg-blue-50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: "both",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <div className="flex items-start gap-4">
                {/* User avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${userColor} flex items-center justify-center text-white font-medium`}
                >
                  {initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p
                        className={`text-sm font-medium ${
                          !notification.is_read
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification?.related_file?.present_by?.first_name}{" "}
                        {notification?.related_file?.present_by?.last_name}
                      </p>

                      {!notification.is_read && (
                        <span className="ml-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleStarred(notification, e)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors text-yellow-400"
                        title="तारांकित हटाउनुहोस्"
                      >
                        <MdOutlineStar className="text-xl" />
                      </button>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* File details */}
                  <div className="flex flex-wrap gap-2 mt-1 items-center text-xs text-gray-500">
                    {notification?.related_file?.file_number && (
                      <div className="flex items-center">
                        <FaFileAlt className="mr-1" />
                        <span>{notification.related_file.file_number}</span>
                      </div>
                    )}

                    {notification?.related_file?.subject && (
                      <div className="flex items-center">
                        <span className="mx-1">•</span>
                        <span className="truncate max-w-xs">
                          {notification.related_file.subject}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <p
                    className={`mt-2 text-sm ${
                      !notification.is_read ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {/* Action link */}
                  <div className="mt-2">
                    <span className="inline-flex items-center text-xs font-medium text-[#E68332]">
                      विवरण हेर्नुहोस्{" "}
                      <FaExternalLinkAlt className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StarredTab;
