import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaFileAlt, FaExchangeAlt, FaTrash, FaEye, FaExclamationTriangle, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const NonTransferFile3 = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const [departments, setDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Added new state for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchAdmins();
    fetchOffices();
  }, []);

  // Reset department when office changes
  useEffect(() => {
    setSelectedDepartment("");
    if (selectedOffice) {
      fetchDepartments(selectedOffice);
    } else {
      setDepartments([]);
    }
  }, [selectedOffice]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${baseUrl}/users/dropdown/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      const departId = localStorage.getItem("depart_id");
      
      const filteredData = data.filter((file) => {
        const isTransferred = file.approvals?.some(
          (approval) => approval.is_transferred
        );
        const belongsToFilteredDepartment =
          file.related_department?.id == departId;
        return !isTransferred && !belongsToFilteredDepartment;
      });

      setNonTransferredFiles(filteredData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setIsLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error("Error fetching offices:", error);
      setOffices([]);
    }
  };

  const fetchDepartments = async (officeId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/offices/${officeId}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTransferModal = (fileId) => {
    setFileToTransfer(fileId);
    setIsModalOpen(true);
    setSelectedOffice("");
    setSelectedDepartment("");
    setDepartments([]);
  };

  const handleTransfer = async () => {
    if (!selectedOffice) {
      alert("Please select an office");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        related_office: selectedOffice
      };
      
      if (selectedDepartment) {
        payload.related_department = selectedDepartment;
      }

      const response = await fetch(
        `${baseUrl}/files/${fileToTransfer}/transfer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("File transferred successfully");
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error transferring file");
        console.error("Error transferring file:", response.statusText);
      }
    } catch (error) {
      console.error("Error transferring file:", error);
      alert("Failed to transfer file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Added new filter function
  const getFilteredFiles = () => {
    return nonTransferredFiles.filter((file) =>
      // Search by name, subject, id, file number
      (searchQuery === "" || 
        file.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(file.id).includes(searchQuery) ||
        String(file.file_number).includes(searchQuery)) &&
      // Filter by date if provided
      (filterDate === "" || file.present_date?.includes(filterDate))
    );
  };

  const filteredFiles = getFilteredFiles();

  // Updated delete handler to use confirmation modal
  const handleDelete = (fileId) => {
    setConfirmDelete(fileId);
  };

  const confirmDeleteFile = async () => {
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`${baseUrl}/files/${confirmDelete}/disable/`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        setNonTransferredFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== confirmDelete)
        );
        setConfirmDelete(null);
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file");
    }
  };

  // Add TextWithTooltip component for long text
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
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#E68332] transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          स्थानान्तरण नगरिएको फाइल
        </h2>
        <p className="text-gray-600">कार्यालय बाहिर स्थानान्तरण नगरिएका फाइलहरूको सूची</p>
      </div>
      
      {/* Search and Filter Controls */}
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border ${showFilters ? 'bg-[#E68332] text-white' : 'bg-white text-gray-700 border-gray-300'} transition-colors duration-200`}
            >
              <FaFilter size={14} />
              <span>फिल्टरहरू</span>
            </button>
          </div>
          
          <div className="text-right text-gray-600 flex items-center justify-end">
            <FaFileAlt className="text-[#E68332] mr-2" />
            <span className="font-medium">{filteredFiles.length}</span> फाइलहरू फेला परे
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">मितिद्वारा फिल्टर गर्नुहोस्</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setFilterDate("");
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-lg shadow-md animate-pulse">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">आईडी</th>
                  <th className="px-6 py-3 text-left text-gray-700">फाइलको नाम</th>
                  <th className="px-6 py-3 text-left text-gray-700">फाइलको नम्बर</th>
                  <th className="px-6 py-3 text-left text-gray-700">विषय</th>
                  <th className="px-6 py-3 text-left text-gray-700">पेश गर्ने</th>
                  <th className="px-6 py-3 text-left text-gray-700">पेश गरेको मिति</th>
                  <th className="px-6 py-3 text-center text-gray-700">कार्यहरू</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <tr 
                      key={file.id} 
                      className="hover:bg-gray-50 transition-all duration-200"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "both",
                        animation: "fadeIn 0.5s ease-in-out"
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <div className="flex items-center">
                          <FaFileAlt className="text-[#E68332] mr-2 opacity-70" />
                          <TextWithTooltip text={file.file_name} maxLength={25} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{file.file_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <TextWithTooltip text={file.subject} maxLength={30} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {file.present_by?.first_name} {file.present_by?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          {file.present_date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/file-details/${file.id}`)}
                          className="text-[#E68332] hover:text-white hover:bg-[#E68332] bg-orange-50 border border-orange-200 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaEye className="mr-1" /> हेर्नुहोस्
                        </button>
                        <button
                          onClick={() => handleOpenTransferModal(file.id)}
                          className="text-green-600 hover:text-white hover:bg-green-600 bg-green-50 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaExchangeAlt className="mr-1" /> ट्रान्सफर
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaTrash className="mr-1" /> मेटाउनुहोस्
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaFileAlt className="text-gray-300 text-6xl mb-4" />
                        <p className="text-xl font-medium mb-2">कुनै फाइल फेला परेन</p>
                        <p className="text-gray-500 max-w-md mx-auto">
                          तपाईंको खोज मापदण्ड अनुसार कुनै स्थानान्तरण नगरिएका फाइल फेला परेन。
                        </p>
                        {(searchQuery || filterDate) && (
                          <button 
                            onClick={() => {
                              setSearchQuery("");
                              setFilterDate("");
                            }}
                            className="mt-4 px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
                          >
                            फिल्टरहरू रिसेट गर्नुहोस्
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all animate-scaleIn">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center">
              <FaExchangeAlt className="mr-2 text-[#E68332]" />
              फाइल ट्रान्सफर गर्नुहोस्
            </h3>
            <div className="mb-4 space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">कार्यालय छान्नुहोस्:</span>
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-[#E68332] transition-colors"
                  disabled={isLoading}
                >
                  <option value="">कार्यालय छान्नुहोस्</option>
                  {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </label>
              
              <label className="block">
                <span className="text-gray-700 font-medium mb-1 block">विभाग छान्नुहोस्:</span>
                <select
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  value={selectedDepartment}
                  className="mt-1 block w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-[#E68332] transition-colors"
                  disabled={!selectedOffice || isLoading}
                >
                  <option value="">विभाग छान्नुहोस्</option>
                  {departments.length > 0 ? (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      {isLoading
                        ? "विभागहरू लोड हुँदैछन्..."
                        : selectedOffice
                        ? "यस कार्यालयको लागि कुनै विभाग उपलब्ध छैन"
                        : "कृपया पहिले कार्यालय चयन गर्नुहोस्"}
                    </option>
                  )}
                </select>
              </label>
            </div>
            <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOffice("");
                  setSelectedDepartment("");
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-[#E68332] hover:bg-[#dd7a29] text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#E68332] flex items-center"
                disabled={!selectedOffice || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    प्रक्रिया हुँदैछ...
                  </>
                ) : (
                  <>
                    <FaExchangeAlt className="mr-2" />
                    ट्रान्सफर गर्नुहोस्
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full transform transition-all animate-scaleIn">
            <div className="flex items-center text-red-500 mb-6">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold">फाइल मेटाउन पुष्टि गर्नुहोस्</h3>
            </div>
            <p className="mb-8 text-gray-600">
              के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो फाइल मेटाउन चाहनुहुन्छ? यो कार्य पछि उल्ट्याउन सकिँदैन。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={confirmDeleteFile}
                className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                मेटाउनुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
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
        
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default NonTransferFile3;