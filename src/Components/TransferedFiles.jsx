import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaFileAlt, FaTrash, FaEye, FaExclamationTriangle, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const TransferedFile = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [TransferedFiles, setTransferedFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const token = localStorage.getItem("token");
  const Empid = localStorage.getItem("token");
  const [deparetments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${baseUrl}/users/dropdown/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();

      setAdmins(data); // Set the fetched admin data
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      console.log("All files:", data.length); // Debug logging

      // Filtering only files where at least one approval has is_transferred: true
      const filteredData = data.filter(
        (file) =>
          file.approvals && file.approvals.some((approval) => approval.is_transferred)
      );
      
      console.log("Transferred files:", filteredData.length); // Debug logging

      setTransferedFiles(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
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
  
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
  
      setTransferedFiles((prevFiles) => prevFiles.filter((file) => file.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Filter function for search
  const getFilteredFiles = () => {
    return TransferedFiles.filter((file) =>
      // Search by name, subject, id
      (searchQuery === "" || 
        file.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.id?.toString().includes(searchQuery)) &&
      // Filter by date if provided
      (filterDate === "" || file.present_date?.includes(filterDate))
    );
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#E68332] transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          स्थानान्तरण गरिएको फाइल
        </h2>
        <p className="text-gray-600">यहाँ सबै स्थानान्तरण गरिएका फाइलहरूको सूची रहेको छ</p>
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
              placeholder="फाइल नाम वा विषय खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${showFilters ? 'bg-[#E68332] text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              <FaFilter size={14} />
              <span>फिल्टरहरू</span>
            </button>
          </div>
          
          <div className="text-right text-gray-600 flex items-center justify-end">
            <FaFileAlt className="text-[#E68332] mr-2" />
            <span>{filteredFiles.length} फाइल(हरू) फेला पर्‍यो</span>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
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
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setFilterDate("");
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                >
                  फिल्टरहरू रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-lg shadow-md animate-pulse">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs uppercase font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">आईडी</th>
                  <th className="px-6 py-4 text-left text-gray-700">फाइलको नाम</th>
                  <th className="px-6 py-4 text-left text-gray-700">विषय</th>
                  <th className="px-6 py-4 text-left text-gray-700">पेश गर्ने</th>
                  <th className="px-6 py-4 text-left text-gray-700">पेश गरेको मिति</th>
                  <th className="px-6 py-4 text-center text-gray-700">कार्यहरू</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2 flex justify-center">
                        <button
                          onClick={() => navigate(`/file-details/${file.id}`)}
                          className="text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 rounded-md px-4 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaEye className="mr-2" /> हेर्नुहोस्
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-md px-4 py-2 transition-all duration-200 inline-flex items-center"
                        >
                          <FaTrash className="mr-2" /> मेटाउनुहोस्
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaFileAlt className="text-gray-300 text-6xl mb-4" />
                        <p className="text-xl font-medium mb-2">कुनै फाइल फेला परेन</p>
                        <p className="text-gray-500 max-w-md mx-auto">
                          तपाईंको खोज मापदण्ड अनुसार कुनै स्थानान्तरण गरिएको फाइल फेला परेन। कृपया फिल्टरहरू परिवर्तन गर्नुहोस् वा अर्को खोज प्रयास गर्नुहोस्。
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      `}</style>
    </div>
  );
};

export default TransferedFile;
