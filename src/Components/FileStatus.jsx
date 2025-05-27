import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaFileAlt, FaSpinner, FaSortAmountDown, FaSortAmountUp, FaExternalLinkAlt } from "react-icons/fa";
import { BsFiles, BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";

const FileStatus = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  // Simplified animation handling without framer-motion
  const [animateList, setAnimateList] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    // Trigger animation after data loads
    if (!loading && fileStatuses.length > 0) {
      setAnimateList(true);
    }
  }, [loading, fileStatuses]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter((file) => file.is_disabled === false);
      setFileStatuses(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Handle file row click to navigate to file details
  const handleRowClick = (fileId) => {
    navigate(`/file-details/${fileId}`);
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter files based on search query, active tab, and apply sorting
  const getFilteredFiles = () => {
    // First filter by search query
    let filteredFiles = fileStatuses.filter((file) =>
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

    // Then filter by file type
    if (activeTab === "chaalu") {
      filteredFiles = filteredFiles.filter((file) => file.file_type === "चालु");
    } else if (activeTab === "tameli") {
      filteredFiles = filteredFiles.filter((file) => file.file_type === "तामेली");
    }

    // Apply sorting if configured
    if (sortConfig.key) {
      filteredFiles.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
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
      return sortConfig.direction === 'asc' 
        ? <BsSortAlphaDown className="inline ml-1 text-[#E68332]" /> 
        : <BsSortAlphaUp className="inline ml-1 text-[#E68332]" />;
    }
    return null;
  };

  // Show empty state when no files match filters
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
      <BsFiles className="text-gray-400 text-6xl mb-4" />
      <p className="text-lg text-gray-600 font-medium">कुनै फाइलहरू फेला परेनन्</p>
      <p className="text-sm text-gray-500 mt-2">कृपया आफ्नो खोज मापदण्ड परिवर्तन गर्नुहोस् वा फिल्टर हटाउनुहोस्</p>
      <button 
        onClick={() => {
          setSearchQuery("");
          setActiveTab("all");
          setSortConfig({ key: null, direction: 'asc' });
        }}
        className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
      >
        फिल्टरहरू रिसेट गर्नुहोस्
      </button>
    </div>
  );

  // Simple ActiveIndicator component as a replacement for framer-motion
  const ActiveIndicator = ({ isActive }) => (
    isActive && (
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E68332]"
        style={{
          animation: "fadeIn 0.3s ease-in-out",
        }}
      />
    )
  );

  // Enhanced tooltip component with better text wrapping and sizing
  const TextWithTooltip = ({ text, maxLength = 30 }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);
    const isLongText = text && text.length > maxLength;
    
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
          tooltip.style.left = 'auto';
          tooltip.style.right = '0';
        }
      }
    }, [showTooltip]);
    
    // Only apply tooltip behavior if text is long enough
    if (!isLongText) {
      return <span className="text-sm">{text || "N/A"}</span>;
    }
    
    return (
      <div 
        ref={containerRef}
        className="relative inline-block w-full cursor-default group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="truncate block w-full text-sm">
          {text}
        </span>
        
        {showTooltip && (
          <div 
            ref={tooltipRef}
            className="absolute p-3 rounded-md shadow-lg bg-white border border-gray-200 text-sm text-gray-800 whitespace-normal z-50"
            style={{
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              wordBreak: 'break-word',
              hyphens: 'auto',
              textAlign: 'left'
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">फाइल स्थिति</h1>
        <p className="text-gray-600">सबै फाइलहरूको स्थिति हेर्नुहोस् र व्यवस्थापन गर्नुहोस्</p>
      </div>
      
      {/* Tab navigation with refined styling */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto bg-white rounded-t-lg shadow-sm">
        {["all", "chaalu", "tameli"].map((tab) => (
          <button
            key={tab}
            className={`py-3 px-6 font-medium text-sm md:text-base relative ${
              activeTab === tab
                ? "text-[#E68332] font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" ? "सबै फाइलहरू" : tab === "chaalu" ? "चालु फाइलहरू" : "तामेली फाइलहरू"}
            <ActiveIndicator isActive={activeTab === tab} />
          </button>
        ))}
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full md:w-2/5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="आईडी, फाइल नम्बर, नाम, वा विषयद्वारा खोज्नुहोस्..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#E68332] focus:ring focus:ring-[#E68332] focus:ring-opacity-20 transition duration-200"
          />
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-md">
          <FaFileAlt className="text-[#E68332]" />
          <span className="font-medium">{filteredFiles.length}</span> फाइलहरू फेला परे
        </div>
      </div>

      {/* Instruction text with enhanced styling */}
      <div className="bg-blue-50 p-3 rounded-md mb-6 border-l-4 border-blue-400 flex items-center shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-blue-600 text-sm">फाइल विवरण हेर्न कुनै पनि पङ्क्तिमा क्लिक गर्नुहोस्</p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col justify-center items-center p-16 bg-white rounded-lg shadow-md">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        /* Files table with improved styling and interactions */
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          {filteredFiles.length > 0 ? (
            <table className="w-full table-fixed border-collapse">
              {/* Improved table header */}
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0">
                <tr>
                  <th 
                    className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[8%]" 
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      <span>आईडी</span>
                      {getSortDirectionIndicator('id')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[10%]" 
                    onClick={() => requestSort('file_number')}
                  >
                    <div className="flex items-center">
                      <span>फाइल नं</span>
                      {getSortDirectionIndicator('file_number')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[25%]" 
                    onClick={() => requestSort('file_name')}
                  >
                    <div className="flex items-center">
                      <span>फाइलको नाम</span>
                      {getSortDirectionIndicator('file_name')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[26%]" 
                    onClick={() => requestSort('subject')}
                  >
                    <div className="flex items-center">
                      <span>विषय</span>
                      {getSortDirectionIndicator('subject')}
                    </div>
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[15%]">
                    <div className="flex items-center">
                      <span>फाइल प्रकार</span>
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[16%]" 
                    onClick={() => requestSort('days_submitted')}
                  >
                    <div className="flex items-center">
                      <span>फाइल आएको समय</span>
                      {getSortDirectionIndicator('days_submitted')}
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
                      opacity: animateList ? 1 : 0,
                      transform: animateList ? 'translateY(0)' : 'translateY(10px)',
                      transition: `all 0.3s ease-in-out ${index * 0.05}s`
                    }}
                  >
                    <td className="p-4 text-sm text-gray-900">{file.id}</td>
                    <td className="p-4 text-sm text-gray-900">{file.file_number}</td>
                    <td className="p-4 font-medium text-gray-900">
                      <div className="flex items-center">
                        <FaFileAlt className="text-gray-400 mr-2 group-hover:text-[#E68332] transition-colors duration-200 flex-shrink-0" />
                        <TextWithTooltip text={file.file_name} maxLength={25} />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <TextWithTooltip text={file.subject} maxLength={30} />
                    </td>
                    <td className="p-4">
                      {file.file_type ? (
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center ${
                            file.file_type === "चालु"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : file.file_type === "तामेली"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            file.file_type === "चालु" ? "bg-green-500" : 
                            file.file_type === "तामेली" ? "bg-yellow-500" : "bg-gray-500"
                          }`}></span>
                          {file.file_type}
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
                        <span>{file.days_submitted}</span>
                        <FaExternalLinkAlt className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        th {
          position: relative;
        }
        
        th:after {
          content: '';
          position: absolute;
          right: 0;
          top: 25%;
          height: 50%;
          width: 1px;
          background: #e5e7eb;
        }
        
        th:last-child:after {
          display: none;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          max-width: 100%;
        }

        /* New style for tooltips */
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Additional styling to ensure tooltips don't get cut off */
        tbody tr {
          position: relative;
        }
        
        /* Style to ensure tooltip visibility */
        [data-tooltip] {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default FileStatus;
