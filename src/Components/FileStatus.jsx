import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaSpinner,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsFiles, BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";
import axios from "axios";

const FileStatus = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("सबै फाइलहरू");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false
  });

  // Simplified animation handling without framer-motion
  const [animateList, setAnimateList] = useState(false);

  // Add filter date state
  const [showFilters, setShowFilters] = useState(false);
  const [fileTypes, setFileTypeData] = useState([]);
  const [fileTypesWithIds, setFileTypesWithIds] = useState([]);

  useEffect(() => {
    fetchFileTypes();
  }, []);

  useEffect(() => {
    fetchData(pagination.currentPage);
  }, [activeTab, pagination.currentPage]);

  useEffect(() => {
    // Trigger animation after data loads
    if (!loading && fileStatuses.length > 0) {
      setAnimateList(true);
    }
  }, [loading, fileStatuses]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let apiUrl = `${baseUrl}/file/?page=${page}`;
      
      // Add file type filter if not "सबै फाइलहरू"
      if (activeTab !== "सबै फाइलहरू") {
        const selectedFileType = fileTypesWithIds.find(ft => ft.name === activeTab);
        if (selectedFileType) {
          apiUrl += `&file_type=${selectedFileType.id}`;
        }
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle paginated response structure
      if (data.data) {
        const filteredData = data.data.filter((file) => file.is_disabled === false);
        setFileStatuses(filteredData);
        
        setPagination({
          currentPage: data.current_page || 1,
          totalPages: data.total_pages || 1,
          totalItems: data.total_items || 0,
          pageSize: data.page_size || 10,
          hasNext: !!data.next,
          hasPrevious: !!data.previous
        });
      } else {
        // Fallback for non-paginated response
        const filteredData = Array.isArray(data) ? data.filter((file) => file.is_disabled === false) : [];
        setFileStatuses(filteredData);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: filteredData.length
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFileStatuses([]);
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchFileTypes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/file-type/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data) {
        setFileTypesWithIds(response.data);
        // Ensure we only extract the name strings, not objects
        const names = response.data.map((item) => typeof item === 'object' && item.name ? item.name : String(item));
        setFileTypeData(names);
      }
    } catch (error) {
      console.error("Error fetching File Types data:", error);
      setFileTypesWithIds([]);
      setFileTypeData([]);
    }
  };

  // Handle tab change and reset to first page
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle file row click to navigate to file details
  const handleRowClick = (fileId) => {
    navigate(`/file-details/${fileId}`);
  };

  // Sort function - now works on current page data only
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Enhanced filter function for client-side filtering (search only)
  const getFilteredFiles = () => {
    let filteredFiles = fileStatuses;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredFiles = filteredFiles.filter((file) =>
        searchQuery
          .toLowerCase()
          .split(" ")
          .every((query) =>
            [
              file.file_name?.toLowerCase() || "",
              file.subject?.toLowerCase() || "",
              String(file.id),
              String(file.file_number),
            ].some((field) => field.includes(query))
          )
      );
    }

    // Apply sorting if configured
    if (sortConfig.key) {
      filteredFiles.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredFiles;
  };

  const filteredFiles = getFilteredFiles();

  // Get appropriate sort direction indicator with better icons
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <BsSortAlphaDown className="inline ml-1 text-[#E68332]" />
      ) : (
        <BsSortAlphaUp className="inline ml-1 text-[#E68332]" />
      );
    }
    return null;
  };

  // Pagination component
  const PaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            कुल {pagination.totalItems} मध्ये {((pagination.currentPage - 1) * pagination.pageSize) + 1}-
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} देखाइएको
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              pagination.hasPrevious
                ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                page === pagination.currentPage
                  ? "text-white bg-[#E68332] border border-[#E68332]"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              pagination.hasNext
                ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
            }`}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Show empty state when no files match filters
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
      <BsFiles className="text-gray-400 text-6xl mb-4" />
      <p className="text-lg text-gray-600 font-medium">
        कुनै फाइलहरू फेला परेनन्
      </p>
      <p className="text-sm text-gray-500 mt-2">
        कृपया आफ्नो खोज मापदण्ड परिवर्तन गर्नुहोस् वा फिल्टर हटाउनुहोस्
      </p>
      <button
        onClick={() => {
          setSearchQuery("");
          setActiveTab("all");
          setSortConfig({ key: null, direction: "asc" });
        }}
        className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
      >
        फिल्टरहरू रिसेट गर्नुहोस्
      </button>
    </div>
  );

  // Simple ActiveIndicator component as a replacement for framer-motion
  const ActiveIndicator = ({ isActive }) =>
    isActive && (
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E68332]"
        style={{
          animation: "fadeIn 0.3s ease-in-out",
        }}
      />
    );

  // Enhanced tooltip component with better text wrapping and sizing
  const TextWithTooltip = ({ text, maxLength = 30 }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);
    
    // Ensure text is always a string
    const safeText = text && typeof text === 'object' ? 
      (text.name || text.toString()) : 
      (text || "N/A");
    
    const isLongText = safeText && String(safeText).length > maxLength;

    // Calculate optimal position for tooltip when it becomes visible
    useEffect(() => {
      if (showTooltip && tooltipRef.current && containerRef.current) {
        const tooltip = tooltipRef.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Calculate position - position tooltip ABOVE the text by default to avoid overlap with table content
        tooltip.style.position = "absolute";
        tooltip.style.bottom = "100%"; // Position above the text
        tooltip.style.left = "0";
        tooltip.style.marginBottom = "10px"; // Space between tooltip and text
        tooltip.style.maxWidth = "300px";
        tooltip.style.width = "max-content";
        tooltip.style.maxHeight = "200px"; // Limit max height
        tooltip.style.overflowY = "auto"; // Add scrolling for very long text
        tooltip.style.wordBreak = "break-word"; // Ensure text breaks properly

        // Ensure tooltip doesn't go off-screen horizontally
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
          tooltip.style.left = "auto";
          tooltip.style.right = "0";
        }
      }
    }, [showTooltip]);

    // Only apply tooltip behavior if text is long enough
    if (!isLongText) {
      return <span className="text-sm">{String(safeText)}</span>;
    }

    return (
      <div
        ref={containerRef}
        className="relative inline-block w-full cursor-default group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="truncate block w-full text-sm">{String(safeText)}</span>

        {showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute p-3 rounded-md shadow-lg bg-white border border-gray-200 text-sm text-gray-800 whitespace-normal z-50"
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              wordBreak: "break-word",
              hyphens: "auto",
              textAlign: "left",
            }}
          >
            {String(safeText)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#E68332] transition-all duration-300 hover:shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          फाइल स्थिति
        </h1>
        <p className="text-gray-600">
          सबै फाइलहरूको स्थिति हेर्नुहोस् र व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      {/* Tab navigation with refined styling */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto bg-white rounded-t-lg shadow-md">
        {fileTypes.length > 0 &&
          ["सबै फाइलहरू", ...fileTypes].map((tab) => (
            <button
              key={tab}
              className={`py-3 px-6 font-medium text-sm md:text-base relative ${
                activeTab === tab
                  ? "text-[#E68332] font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E68332]"
                  style={{
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                />
              )}
            </button>
          ))}{" "}
      </div>

      {/* Search and filter section - Enhanced */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="आईडी, फाइल नम्बर, नाम, वा विषयद्वारा खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border ${
                showFilters
                  ? "bg-[#E68332] text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } transition-colors duration-200`}
            >
              <FaFilter size={14} />
              <span>फिल्टरहरू</span>
            </button>
          </div>

          <div className="text-right text-gray-600 flex items-center justify-end">
            <FaFileAlt className="text-[#E68332] mr-2" />
            <span className="font-medium">{pagination.totalItems}</span> फाइलहरू
            फेला परे
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("सबै फाइलहरू");
                    setSortConfig({ key: null, direction: "asc" });
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                >
                  फिल्टरहरू रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instruction text with enhanced styling */}
      <div className="bg-blue-50 p-3 rounded-md mb-6 border-l-4 border-blue-400 flex items-center shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-blue-600 text-sm">
          फाइल विवरण हेर्न कुनै पनि पङ्क्तिमा क्लिक गर्नुहोस्
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col justify-center items-center p-16 bg-white rounded-lg shadow-md animate-pulse">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        /* Files table with improved styling and interactions */
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          {filteredFiles.length > 0 ? (
            <>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full table-fixed border-collapse">
                  {/* Improved table header with bold text */}
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[8%]"
                        onClick={() => requestSort("id")}
                      >
                        <div className="flex items-center">
                          <span>आईडी</span>
                          {getSortDirectionIndicator("id")}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[10%]"
                        onClick={() => requestSort("file_number")}
                      >
                        <div className="flex items-center">
                          <span>फाइल नं</span>
                          {getSortDirectionIndicator("file_number")}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[25%]"
                        onClick={() => requestSort("file_name")}
                      >
                        <div className="flex items-center">
                          <span>फाइलको नाम</span>
                          {getSortDirectionIndicator("file_name")}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[26%]"
                        onClick={() => requestSort("subject")}
                      >
                        <div className="flex items-center">
                          <span>विषय</span>
                          {getSortDirectionIndicator("subject")}
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">
                        <div className="flex items-center">
                          <span>फाइल प्रकार</span>
                        </div>
                      </th>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[16%]"
                        onClick={() => requestSort("days_submitted")}
                      >
                        <div className="flex items-center">
                          <span>फाइल आएको समय</span>
                          {getSortDirectionIndicator("days_submitted")}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {/* Enhanced table body */}
                  <tbody className="divide-y divide-gray-200">
                    {filteredFiles.map((file, index) => (
                      <tr
                        key={file.id}
                        onClick={() => handleRowClick(file.id)}
                        className="group hover:bg-[#FFF8F3] transition-all duration-200 cursor-pointer"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                          animation: "fadeIn 0.5s ease-in-out",
                        }}
                      >
                        <td className="p-4 text-sm text-gray-900">{file.id}</td>
                        <td className="p-4 text-sm text-gray-900">
                          {file.file_number}
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center">
                            <FaFileAlt className="text-gray-400 mr-2 group-hover:text-[#E68332] transition-colors duration-200 flex-shrink-0" />
                            <TextWithTooltip
                              text={file.file_name}
                              maxLength={25}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <TextWithTooltip text={file.subject} maxLength={30} />
                        </td>
                        <td className="p-4">
                          {file.file_type ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center border border-green-200">
                              <span className="w-2 h-2 rounded-full mr-1.5 bg-green-500"></span>
                              {typeof file.file_type === 'object' ? 
                                (file.file_type.name || String(file.file_type)) : 
                                String(file.file_type)}
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center border border-gray-200">
                              <span className="w-2 h-2 rounded-full mr-1.5 bg-gray-500"></span>
                              अवर्गीकृत
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <div className="flex justify-between items-center">
                            <span>{String(file.days_submitted || 0)}</span>
                            <FaExternalLinkAlt className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <PaginationControls />
            </>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <BsFiles className="text-gray-300 text-6xl mb-4" />
                <p className="text-xl font-medium mb-2">कुनै फाइल फेला परेन</p>
                <p className="text-gray-500 max-w-md mx-auto">
                  तपाईंको खोज मापदण्ड अनुसार कुनै फाइल फेला परेन। कृपया
                  फिल्टरहरू परिवर्तन गर्नुहोस् वा अर्को खोज प्रयास गर्नुहोस्。
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("सबै फाइलहरू");
                    setSortConfig({ key: null, direction: "asc" });
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="mt-4 px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
                >
                  फिल्टरहरू रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default FileStatus;

