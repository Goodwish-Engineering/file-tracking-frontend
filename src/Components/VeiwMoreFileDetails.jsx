import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { FaFileAlt, FaRegClipboard, FaRegFileAlt, FaMapMarkerAlt, FaHistory, FaPencilAlt, FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin } from '../utils/constants';

// Import tab components
import FileInfoTab from "./Tabs/FileInfoTab";
import TippaniTab from "./Tabs/TippaniTab";
import DocumentsTab from "./Tabs/DocumentsTab";
import LandDetailsTab from "./Tabs/LandDetailsTab";
import FileHistoryTab from "./Tabs/FileHistoryTab";

const ViewMoreFileDetails = () => {
  const { id } = useParams();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [landDetails, setLandDetails] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [fileHistory, setFileHistory] = useState([]);
  const navigate = useNavigate();

  // Modal state
  const [isPageCountModalOpen, setIsPageCountModalOpen] = useState(false);
  const [pageCountModalType, setPageCountModalType] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const token = localStorage.getItem("token");

  // Fetch data on component mount
  useEffect(() => {
    fetchFileDetails();
    fetchLandDetails();
    fetchFileHistory();
  }, []);

  // Fetch file details
  const fetchFileDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        headers: { Authorization: `token ${token}` },
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

      const data = await response.json();
      if (!data) throw new Error("No data received from server");

      // Normalize tippani data if it exists
      if (data.tippani) {
        data.tippani = normalizeAndSanitizeTippani(data.tippani);
      }

      setFileDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file details:", error);
      setLoading(false);
      handleFetchError(error);
    }
  };

  // Fetch land details
  const fetchLandDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/land-details/?related_file=${id}`, {
        headers: { Authorization: `token ${token}` },
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      setLandDetails(data || []);
    } catch (error) {
      console.error("Error fetching land details:", error);
      toast.error("जग्गा विवरण प्राप्त गर्न असफल");
    }
  };

  // Fetch file history
  const fetchFileHistory = async () => {
    try {
      const response = await fetch(`${baseUrl}/files/${id}/history/`, {
        headers: { Authorization: `token ${token}` },
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      
      // Process the data format
      let processedData = Array.isArray(data) ? data : 
                         (data && typeof data === "object") ? (data.history || []) : [];
      
      setFileHistory(processedData);
    } catch (error) {
      console.error("Error fetching file history:", error);
      setFileHistory([]);
    }
  };

  // Normalize tippani data
  const normalizeAndSanitizeTippani = (tippaniData) => {
    if (!tippaniData) return [];
    
    if (!Array.isArray(tippaniData)) {
      if (typeof tippaniData === "object") {
        tippaniData = [tippaniData];
      } else {
        return [{
          subject: String(tippaniData),
          submitted_by: "",
          submitted_date: "",
          approved_by: "",
          approved_date: "",
          remarks: "",
          tippani_date: "",
          page_no: "",
        }];
      }
    }

    if (tippaniData.length === 0) return [];

    return tippaniData.map((tip) => {
      const normalizedTip = {
        subject: "",
        submitted_by: "",
        submitted_date: "",
        approved_by: "",
        approved_date: "",
        remarks: "",
        tippani_date: "",
        page_no: "",
      };

      if (typeof tip === "string") {
        normalizedTip.subject = tip;
      } else if (typeof tip === "object" && tip !== null) {
        Object.keys(normalizedTip).forEach((key) => {
          if (tip[key] !== undefined) normalizedTip[key] = tip[key];
        });

        Object.keys(tip).forEach((key) => {
          if (normalizedTip[key] === undefined) normalizedTip[key] = tip[key];
        });
      }
      return normalizedTip;
    });
  };

  // Handle fetch errors
  const handleFetchError = (error) => {
    if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
      toast.error("नेटवर्क त्रुटि: सर्भरसँग जडान गर्न असमर्थ");
    } else {
      toast.error(`फाइल विवरण प्राप्त गर्न असफल: ${error.message}`);
    }
  };

  // Toggle edit mode
  const handleEditToggle = () => setEditable(!editable);

  // Save changes
  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          tippani: fileDetails?.tippani || [],
          letters_and_documents: fileDetails?.letters_and_documents || [],
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      await fetchFileDetails();
      setEditable(false);
      toast.success("परिवर्तनहरू सफलतापूर्वक सुरक्षित गरियो!");
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error(`परिवर्तनहरू सुरक्षित गर्न असफल: ${error.message}`);
    }
  };

  // Navigation handler
  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    navigate(isAdmin(level) ? "/admindashboard" : "/employeeheader");
  };

  // Tab data
  const tabs = [
    { id: 0, name: "फाइल जानकारी", icon: <FaFileAlt className="mr-2" /> },
    { id: 1, name: "टिप्पणी", icon: <FaRegClipboard className="mr-2" /> },
    { id: 2, name: "पत्रहरू र कागजातहरू", icon: <FaRegFileAlt className="mr-2" /> },
    { id: 3, name: "जग्गा विवरण", icon: <FaMapMarkerAlt className="mr-2" /> },
    { id: 4, name: "फाइल इतिहास", icon: <FaHistory className="mr-2" /> },
  ];

  // Loading view
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-4 border-[#E68332] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">लोड गर्दै...</p>
      </div>
    );
  }

  // File not found view
  if (!fileDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">फाइल फेला परेन</h2>
          <p className="text-gray-600 mb-6">अनुरोध गरिएको फाइल उपलब्ध छैन वा हटाइएको हुन सक्छ।</p>
          <button onClick={handleNavigate} className="px-6 py-2 bg-[#E68332] text-white rounded-md shadow-md hover:bg-[#c36f2a] transition-all">
            होम पृष्ठमा फर्कनुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleNavigate}
        className="fixed top-4 left-4 z-10 group"
      >
        <div className="flex items-center px-4 py-2 bg-[#E68332] text-white rounded-md shadow-md hover:bg-[#c36f2a] cursor-pointer transition-all">
          <IoMdArrowRoundBack className="mr-2 group-hover:animate-pulse" />
          <span className="font-medium">होम</span>
        </div>
      </motion.div>

      {/* Page Header */}
      <motion.div
        className="mb-6 pt-10 md:pt-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[#E68332] mb-3 text-center">फाइल विवरण</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center">
            <span className="text-gray-500 mr-2">फाइल नं:</span>
            <span className="font-semibold text-gray-800">{fileDetails.file_number}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center">
            <span className="text-gray-500 mr-2">फाइल नाम:</span>
            <span className="font-semibold text-gray-800">{fileDetails.file_name}</span>
          </div>
        </div>
      </motion.div>

      {/* Edit Controls */}
      <motion.div
        className="flex justify-center mb-6 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className={`px-6 py-2 rounded-md shadow-md transition-all flex items-center ${
            editable ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-[#E68332] text-white hover:bg-[#c36f2a]"
          }`}
          onClick={handleEditToggle}
        >
          {editable ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              रद्द गर्नुहोस्
            </>
          ) : (
            <>
              <FaPencilAlt className="mr-2" />
              सम्पादन गर्नुहोस्
            </>
          )}
        </button>

        {editable && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-all flex items-center"
            onClick={handleSave}
          >
            <FaSave className="mr-2" />
            परिवर्तनहरू सुरक्षित गर्नुहोस्
          </motion.button>
        )}
      </motion.div>

      {/* Main content tabs */}
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-6 font-medium cursor-pointer transition-colors outline-none ${
                activeTab === tab.id
                  ? "text-[#E68332] border-b-2 border-[#E68332] bg-[#f9f1e9]"
                  : "text-gray-700 border-transparent hover:text-[#E68332] border-b-2"
              } flex items-center whitespace-nowrap`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* File Information Tab */}
            {activeTab === 0 && <FileInfoTab fileDetails={fileDetails} />}

            {/* Tippani Tab */}
            {activeTab === 1 && (
              <TippaniTab
                editable={editable}
                fileDetails={fileDetails}
                setFileDetails={setFileDetails}
                baseUrl={baseUrl}
                token={token}
                id={id}
                fetchFileDetails={fetchFileDetails}
              />
            )}

            {/* Documents Tab */}
            {activeTab === 2 && (
              <DocumentsTab
                editable={editable}
                fileDetails={fileDetails}
                setFileDetails={setFileDetails}
                baseUrl={baseUrl}
                token={token}
                id={id}
                fetchFileDetails={fetchFileDetails}
              />
            )}

            {/* Land Details Tab */}
            {activeTab === 3 && (
              <LandDetailsTab
                editable={editable}
                landDetails={landDetails}
                setLandDetails={setLandDetails}
                baseUrl={baseUrl}
                token={token}
                id={id}
                fetchLandDetails={fetchLandDetails}
              />
            )}

            {/* File History Tab */}
            {activeTab === 4 && <FileHistoryTab fileHistory={fileHistory} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewMoreFileDetails;
