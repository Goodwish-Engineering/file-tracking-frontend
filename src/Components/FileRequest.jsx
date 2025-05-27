import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaFileAlt, FaExchangeAlt, FaCheck, FaEye, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const FileRequest = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [fileToAccept, setFileToAccept] = useState(null);
  const [remarks, setRemarks] = useState("");
  const token = localStorage.getItem("token");
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const level = localStorage.getItem("level");
  const officeId = localStorage.getItem("officeid");

  useEffect(() => {
    fetchData();
    fetchAdmins();
    fetchOffices();
    
    // For level 2 users, fetch departments for their office immediately
    if (level === "2" && officeId) {
      fetchDepartments(officeId);
    }
  }, [level, officeId]);

  // Reset department when office changes (for non-level 2 users)
  useEffect(() => {
    if (level !== "2") {
      setSelectedDepartment("");
      if (selectedOffice) {
        fetchDepartments(selectedOffice);
      } else {
        setDepartments([]);
      }
    }
  }, [selectedOffice, level]);

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

      // Exclude files where is_transferred and is_approved are both true
      const filteredData = data.filter(
        (file) => !(file.is_transferred || file.is_approved)
      );

      setNonTransferredFiles(filteredData);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
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
      
      // For level 2 users, filter out office departments
      let departmentsToSet = data.departments || [];
      if (level === "2") {
        departmentsToSet = departmentsToSet.filter(
          department => department.type !== "office"
        );
      }
      
      setDepartments(departmentsToSet);
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
    
    if (level !== "2") {
      // Reset selections for non-level-2 users
      setSelectedOffice("");
      setSelectedDepartment("");
      setDepartments([]);
    } else {
      // For level 2 users, keep department selections but reset the selected department
      setSelectedDepartment("");
    }
  };

  const handleTransfer = async () => {
    // For level 2 users, validate department is selected
    if (level === "2") {
      if (!selectedDepartment) {
        alert("Please select a department");
        return;
      }
    } else {
      // For other users, validate office is selected
      if (!selectedOffice) {
        alert("Please select an office");
        return;
      }
    }

    setIsLoading(true);
    try {
      let payload = {};
      
      if (level === "2") {
        // For level 2 users, only send department
        payload = {
          related_department: selectedDepartment
        };
      } else {
        // For other users, send office and optionally department
        payload = {
          related_office: selectedOffice
        };
        
        if (selectedDepartment) {
          payload.related_department = selectedDepartment;
        }
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
        fetchData();
        setIsModalOpen(false);
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

  const handleAccept = async () => {
    const approvedDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(`${baseUrl}/files/${fileToAccept}/accept/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          accepted: fileToAccept,
          status: "approved",
          remarks,
          approved_date: approvedDate,
        }),
      });

      if (response.ok) {
        fetchData();
        setIsAcceptModalOpen(false);
      } else {
        console.error("Error accepting file:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting file:", error);
    }
  };

  // Add filter function
  const getFilteredFiles = () => {
    return nonTransferredFiles.filter((file) =>
      // Search by name, subject, id
      (searchQuery === "" || 
        file.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(file.id).includes(searchQuery)) &&
      // Filter by date if provided
      (filterDate === "" || file.present_date?.includes(filterDate))
    );
  };

  const filteredFiles = getFilteredFiles();
  
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">फाइल अनुरोध</h2>
        <p className="text-gray-600">आवश्यक फाइलहरू ट्रान्सफर वा स्वीकार गर्नुहोस्</p>
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
              placeholder="आईडी, फाइल नाम वा विषयद्वारा खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border ${showFilters ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300'} transition-colors duration-200`}
            >
              <FaFilter size={14} />
              <span>फिल्टरहरू</span>
            </button>
          </div>
          
          <div className="text-right text-gray-600 flex items-center justify-end">
            <FaFileAlt className="text-blue-500 mr-2" />
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
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs uppercase font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">आईडी</th>
                  <th className="px-6 py-3 text-left text-gray-700">फाइलको नाम</th>
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
                          <FaFileAlt className="text-blue-500 mr-2 opacity-70" />
                          {file.file_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-xs truncate">{file.subject}</div>
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
                          className="text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaEye className="mr-1" /> हेर्नुहोस्
                        </button>
                        <button
                          onClick={() => handleOpenTransferModal(file.id)}
                          className="text-green-600 hover:text-white hover:bg-green-600 bg-green-50 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaExchangeAlt className="mr-1" /> ट्रान्सफर
                        </button>
                        {level !== "2" && (
                          <button
                            onClick={() => {
                              setFileToAccept(file.id);
                              setIsAcceptModalOpen(true);
                            }}
                            className="text-purple-600 hover:text-white hover:bg-purple-600 bg-purple-50 rounded-md px-3 py-2 transition-all duration-200 inline-flex items-center"
                          >
                            <FaCheck className="mr-1" /> स्वीकार्नुहोस्
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaFileAlt className="text-gray-300 text-6xl mb-4" />
                        <p className="text-xl font-medium mb-2">कुनै फाइल अनुरोध फेला परेन</p>
                        <p className="text-gray-500 max-w-md mx-auto">
                          तपाईंको खोज मापदण्ड अनुसार कुनै फाइल अनुरोध फेला परेन。
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

      {/* Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl md:w-96 w-11/12 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">फाइल ट्रान्सफर गर्नुहोस्</h3>
            <div className="mb-4 space-y-4">
              {level === "2" ? (
                <>
                  <label className="block">
                    <span className="text-gray-700 font-medium mb-1 block">विभाग छान्नुहोस्:</span>
                    <select
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      value={selectedDepartment}
                      className="mt-1 block w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                      disabled={isLoading}
                    >
                      <option value="">विभाग छान्नुहोस्</option>
                      {departments.length > 0 ? (
                        departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>{isLoading ? "विभागहरू लोड हुँदैछन्..." : "कुनै विभाग उपलब्ध छैन"}</option>
                      )}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="text-gray-700 font-medium mb-1 block">कार्यालय छान्नुहोस्:</span>
                    <select
                      value={selectedOffice}
                      onChange={(e) => setSelectedOffice(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
                      className="mt-1 block w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
                </>
              )}
            </div>
            <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (level !== "2") {
                    setSelectedOffice("");
                  }
                  setSelectedDepartment("");
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                disabled={isLoading}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
                disabled={isLoading || (level === "2" ? !selectedDepartment : !selectedOffice)}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    प्रक्रिया हुँदैछ...
                  </>
                ) : (
                  <>ट्रान्सफर गर्नुहोस्</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl md:w-96 w-11/12">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">फाइल स्वीकार्नुहोस्</h3>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">कैफियत</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all outline-none resize-none"
                rows="4"
                placeholder="यहाँ कैफियत लेख्नुहोस्..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center"
              >
                <FaCheck className="mr-2" />
                स्वीकार्नुहोस्
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
      `}</style>
    </div>
  );
};

export default FileRequest;