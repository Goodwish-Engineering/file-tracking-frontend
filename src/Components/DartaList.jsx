import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaSpinner,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaPlus,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import { BsFiles, BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";
import { MdSubject } from "react-icons/md";
import AddDarta from "./AddDarta.jsx";

const DartaList = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [dartaRecords, setDartaRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDartaOpen, setIsAddDartaOpen] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    next: null,
    previous: null,
  });

  // Filter state
  const [filters, setFilters] = useState({
    related_file_id: "",
    related_department_id: "",
    related_office_id: "",
    related_faat_id: "",
  });

  // Dropdown data for filters
  const [filterOptions, setFilterOptions] = useState({
    files: [],
    offices: [],
    departments: [],
    faats: [],
  });

  const navigate = useNavigate();
  const [animateList, setAnimateList] = useState(false);

  useEffect(() => {
    fetchDartaData();
    fetchFilterOptions();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    if (!loading && dartaRecords.length > 0) {
      setAnimateList(true);
    }
  }, [loading, dartaRecords]);

  const fetchDartaData = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        page_size: pagination.pageSize.toString(),
      });

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${baseUrl}/darta/?${params.toString()}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch darta records");
      }

      const data = await response.json();

      // Update pagination state
      setPagination({
        totalItems: data.total_items,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        pageSize: data.page_size,
        next: data.next,
        previous: data.previous,
      });

      // Set records from data array
      setDartaRecords(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching darta data:", error);
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [filesRes, officesRes] = await Promise.all([
        fetch(`${baseUrl}/file/`, {
          headers: { Authorization: `token ${token}` },
        }),
        fetch(`${baseUrl}/offices/`, {
          headers: { Authorization: `token ${token}` },
        }),
      ]);

      if (filesRes.ok) {
        const filesData = await filesRes.json();
        const actualFiles = filesData.data || filesData;
        setFilterOptions((prev) => ({
          ...prev,
          files: Array.isArray(actualFiles) ? actualFiles : [],
        }));
      }

      if (officesRes.ok) {
        const officesData = await officesRes.json();
        setFilterOptions((prev) => ({
          ...prev,
          offices: Array.isArray(officesData) ? officesData : [],
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      related_file_id: "",
      related_department_id: "",
      related_office_id: "",
      related_faat_id: "",
    });
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Client-side search functionality
  const getFilteredRecords = () => {
    if (!searchQuery) return dartaRecords;

    return dartaRecords.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        searchQuery
          .toLowerCase()
          .split(" ")
          .every((query) =>
            [
              record.darta_number?.toLowerCase() || "",
              record.subject?.toLowerCase() || "",
              record.sender_name?.toLowerCase() || "", // Updated field name
              record.sender_address?.toLowerCase() || "", // Added from model
              record.related_file_detail?.file_name?.toLowerCase() || "",
              record.remarks?.toLowerCase() || "",
              record.pana_sankhya?.toLowerCase() || "", // From model
            ].some((field) => field.includes(query))
          );

      return matchesSearch;
    });
  };

  const filteredRecords = getFilteredRecords();

  // Get appropriate sort direction indicator
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

  // Enhanced tooltip component
  const TextWithTooltip = ({ text, maxLength = 30 }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);
    const isLongText = text && text.length > maxLength;

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
        <span className="truncate block w-full text-sm">{text}</span>

        {showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute p-3 rounded-md shadow-lg bg-white border border-gray-200 text-sm text-gray-800 whitespace-normal z-50"
            style={{
              bottom: "100%",
              left: "0",
              marginBottom: "10px",
              maxWidth: "300px",
              wordBreak: "break-word",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };

  const handleAddDartaSuccess = () => {
    fetchDartaData();
  };

  // Pagination component
  const PaginationComponent = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">
          देखाइएको{" "}
          <span className="font-medium">
            {(pagination.currentPage - 1) * pagination.pageSize + 1}
          </span>{" "}
          देखि{" "}
          <span className="font-medium">
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalItems
            )}
          </span>{" "}
          कुल <span className="font-medium">{pagination.totalItems}</span> मध्ये
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.previous}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          अघिल्लो
        </button>

        <div className="flex space-x-1">
          {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.currentPage === pageNum
                    ? "bg-[#E68332] text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.next}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          अर्को
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#E68332] transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              दर्ता रेकर्डहरू
            </h1>
            <p className="text-gray-600">
              सबै दर्ता रेकर्डहरूको विवरण हेर्नुहोस् र व्यवस्थापन गर्नुहोस्
            </p>
          </div>
          <button
            onClick={() => setIsAddDartaOpen(true)}
            className="px-6 py-3 bg-[#E68332] text-white rounded-lg hover:bg-[#c36f2a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 text-lg font-medium"
          >
            <FaPlus />
            नयाँ दर्ता थप्नुहोस्
          </button>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="दर्ता नम्बर, विषय, पत्र संख्या, वा फाइल नामद्वारा खोज्नुहोस्..."
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
            <span className="font-medium">{pagination.totalItems}</span> दर्ता
            रेकर्डहरू फेला परे
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  फाइलद्वारा फिल्टर गर्नुहोस्
                </label>
                <select
                  value={filters.related_file_id}
                  onChange={(e) =>
                    handleFilterChange("related_file_id", e.target.value)
                  }
                  className="w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                >
                  <option value="">सबै फाइलहरू</option>
                  {filterOptions.files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.file_name} (#{file.file_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  कार्यालयद्वारा फिल्टर गर्नुहोस्
                </label>
                <select
                  value={filters.related_office_id}
                  onChange={(e) =>
                    handleFilterChange("related_office_id", e.target.value)
                  }
                  className="w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                >
                  <option value="">सबै कार्यालयहरू</option>
                  {filterOptions.offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                >
                  फिल्टरहरू रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col justify-center items-center p-16 bg-white rounded-lg shadow-md animate-pulse">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        /* Records table */
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          {filteredRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full table-fixed border-collapse">
                  {/* Table header */}
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[12%]"
                        onClick={() => requestSort("darta_number")}
                      >
                        <div className="flex items-center">
                          <span>दर्ता नम्बर</span>
                          {getSortDirectionIndicator("darta_number")}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-[12%]"
                        onClick={() => requestSort("darta_date")}
                      >
                        <div className="flex items-center">
                          <span>दर्ता मिति</span>
                          {getSortDirectionIndicator("darta_date")}
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[20%]">
                        <div className="flex items-center">
                          <span>विषय</span>
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[12%]">
                        <div className="flex items-center">
                          <span>पठाउने व्यक्ति</span>
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[12%]">
                        <div className="flex items-center">
                          <span>पाना संख्या</span>
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">
                        <div className="flex items-center">
                          <span>सम्बन्धित फाइल</span>
                        </div>
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[17%]">
                        <div className="flex items-center">
                          <span>कैफियत</span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {/* Table body */}
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.map((record, index) => (
                      <tr
                        key={record.id}
                        onClick={() => navigate(`/darta-details/${record.id}`)}
                        className="group hover:bg-[#FFF8F3] transition-all duration-200 cursor-pointer"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                          animation: "fadeIn 0.5s ease-in-out",
                        }}
                      >
                        <td className="p-4 text-sm text-gray-900 font-medium">
                          <div className="flex items-center">
                            <FaFileAlt className="text-[#E68332] mr-2 opacity-70" />
                            {record.darta_number || "N/A"}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            {record.darta_date || "N/A"}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center">
                            <MdSubject className="text-gray-400 mr-2 flex-shrink-0" />
                            <TextWithTooltip
                              text={record.subject}
                              maxLength={22}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2" />
                            <TextWithTooltip
                              text={record.sender_name}
                              maxLength={15}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {record.pana_sankhya || "N/A"}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaFileAlt className="text-gray-400 mr-2" />
                            <TextWithTooltip
                              text={
                                record.related_file_detail?.file_name ||
                                "कुनै फाइल छैन"
                              }
                              maxLength={15}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaExternalLinkAlt className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2" />
                            <TextWithTooltip
                              text={record.remarks}
                              maxLength={20}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <PaginationComponent />
            </>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <BsFiles className="text-gray-300 text-6xl mb-4" />
                <p className="text-xl font-medium mb-2">
                  कुनै दर्ता रेकर्ड फेला परेन
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  तपाईंको खोज मापदण्ड अनुसार कुनै दर्ता रेकर्ड फेला परेन। कृपया
                  फिल्टरहरू परिवर्तन गर्नुहोस् वा अर्को खोज प्रयास गर्नुहोस्。
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
                >
                  फिल्टरहरू रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Darta Modal */}
      <AddDarta
        isOpen={isAddDartaOpen}
        onClose={() => setIsAddDartaOpen(false)}
        onSuccess={handleAddDartaSuccess}
      />

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

export default DartaList;
