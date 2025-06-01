import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FileHistoryTimeline } from "./FileHistory";
import { MdSubject, MdClose, MdAdd } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { 
  FaRegFilePdf, 
  FaPencilAlt, 
  FaSave, 
  FaFileAlt, 
  FaRegClipboard, 
  FaRegFileAlt, 
  FaMapMarkerAlt, 
  FaRegClock, 
  FaHistory,
  FaCalendarAlt,
  FaCheck,
  FaTimes
} from "react-icons/fa";

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
  
  // New state variables for in-table editing
  const [isPageCountModalOpen, setIsPageCountModalOpen] = useState(false);
  const [pageCountModalType, setPageCountModalType] = useState(""); // "tippani" or "document"
  const [pageCount, setPageCount] = useState(1);
  const [addingNewTippani, setAddingNewTippani] = useState(false);
  const [addingNewDocuments, setAddingNewDocuments] = useState(false);
  const [newTippaniRows, setNewTippaniRows] = useState([]);
  const [newDocumentRows, setNewDocumentRows] = useState([]);
  
  const [newLandDetail, setNewLandDetail] = useState({
    district: "",
    municipality: "",
    ward_no: "",
    kitta_no: "",
    guthi_name: "",
    land_type: "",
    related_file: id,
  });
  
  const token = localStorage.getItem("token");

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tabVariant = {
    active: { 
      opacity: 1,
      y: 0, 
      transition: { duration: 0.5 }
    },
    inactive: { 
      opacity: 0, 
      y: 10,
      transition: { duration: 0.5 }
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchFileDetails();
    fetchLandDetails();
    fetchFileHistory();
  }, []);

  // Normalize and sanitize Tippani data
  const normalizeAndSanitizeTippani = (tippaniData) => {
    if (!tippaniData) return [];
    
    // Handle case where API might return a single item not in an array
    if (!Array.isArray(tippaniData)) {
      if (typeof tippaniData === 'object') {
        // If it's a single object, convert to array
        tippaniData = [tippaniData];
      } else {
        // If it's a string or other primitive, create a dummy object
        return [{
          subject: String(tippaniData),
          submitted_by: "",
          submitted_date: "",
          approved_by: "",
          approved_date: "",
          remarks: "",
          tippani_date: "",
          page_no: ""
        }];
      }
    }
    
    // If we got an empty array, return it
    if (tippaniData.length === 0) return [];
    
    // Process each item to ensure it has all required fields
    return tippaniData.map(tip => {
      // Create a base object with default values for all expected properties
      const normalizedTip = {
        subject: "",
        submitted_by: "",
        submitted_date: "",
        approved_by: "",
        approved_date: "",
        remarks: "",
        tippani_date: "",
        page_no: ""
      };
      
      // Handle different data structures
      if (typeof tip === 'string') {
        // If it's a string, use it as the subject
        normalizedTip.subject = tip;
      } else if (typeof tip === 'object' && tip !== null) {
        // Merge the tip object with our defaults
        Object.keys(normalizedTip).forEach(key => {
          if (tip[key] !== undefined) {
            normalizedTip[key] = tip[key];
          }
        });
        
        // Add any additional properties from the original object
        Object.keys(tip).forEach(key => {
          if (normalizedTip[key] === undefined) {
            normalizedTip[key] = tip[key];
          }
        });
      }
      
      return normalizedTip;
    });
  };

  // Add this debugging function right after normalizeAndSanitizeTippani
  const logTippaniData = (data) => {
    console.log("Tippani Data Structure:", data);
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        console.log(`Tippani Item ${index}:`, item);
      });
    } else {
      console.log("Tippani is not an array:", typeof data);
    }
  };

  // Fetch file details
  const fetchFileDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error("No data received from server");
      }
      
      // Log raw data to see structure
      console.log("Raw file data:", data);
      
      // Normalize tippani data if it exists
      if (data.tippani) {
        logTippaniData(data.tippani); // Log before normalization
        data.tippani = normalizeAndSanitizeTippani(data.tippani);
        logTippaniData(data.tippani); // Log after normalization
      }
      
      setFileDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file details:", error);
      setLoading(false);
      // Use more specific error messages based on error type
      if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
        toast.error("नेटवर्क त्रुटि: सर्भरसँग जडान गर्न असमर्थ");
      } else {
        toast.error(`फाइल विवरण प्राप्त गर्न असफल: ${error.message}`);
      }
    }
  };

  // Fetch land details
  const fetchLandDetails = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/land-details/?related_file=${id}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setLandDetails(data || []);
    } catch (error) {
      console.error("Error fetching land details:", error);
      toast.error("जग्गा विवरण प्राप्त गर्न असफल");
    }
  };

  // Fetch file history with improved error handling
  const fetchFileHistory = async () => {
    try {
      const response = await fetch(`${baseUrl}/files/${id}/history/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data to ensure we have a consistent format
      let processedData;
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && typeof data === 'object') {
        // If data is an object with a history property
        processedData = data.history || [];
      } else {
        processedData = [];
      }
      
      setFileHistory(processedData);
    } catch (error) {
      console.error("Error fetching file history:", error);
      // Don't show an error toast here as history might be optional
      setFileHistory([]);
    }
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setEditable(!editable);
  };

  // Handle form field changes for existing data
  const handleChange = (e, field, index, type) => {
    const value = e.target.value;
    if (type === "tippani" && fileDetails?.tippani) {
      const updatedTippani = [...fileDetails.tippani];
      updatedTippani[index][field] = value;
      setFileDetails({ ...fileDetails, tippani: updatedTippani });
    } else if (type === "document" && fileDetails?.letters_and_documents) {
      const updatedDocs = [...fileDetails.letters_and_documents];
      updatedDocs[index][field] = value;
      setFileDetails({ ...fileDetails, letters_and_documents: updatedDocs });
    }
  };

  const handleLandDetailChange = (e, field, index) => {
    const value = e.target.value;
    const updatedLandDetails = [...landDetails];
    updatedLandDetails[index][field] = value;
    setLandDetails(updatedLandDetails);
  };

  // Function to handle page count modal open
  const openPageCountModal = (type) => {
    setPageCountModalType(type);
    setPageCount(1);
    setIsPageCountModalOpen(true);
  };

  // Function to handle page count submit
  const handlePageCountSubmit = () => {
    if (pageCountModalType === "tippani") {
      // Create empty tippani rows based on page count
      const newRows = Array(pageCount).fill().map(() => ({
        subject: "",
        submitted_by: "",
        submitted_date: "",
        approved_by: "",
        approved_date: "",
        remarks: "",
        tippani_date: "",
        page_no: "",
      }));
      setNewTippaniRows(newRows);
      setAddingNewTippani(true);
    } else if (pageCountModalType === "document") {
      // Create empty document rows based on page count
      const newRows = Array(pageCount).fill().map(() => ({
        registration_no: "",
        invoice_no: "",
        date: "",
        subject: "",
        letter_date: "",
        office: "",
        page_no: "",
      }));
      setNewDocumentRows(newRows);
      setAddingNewDocuments(true);
    }
    
    setIsPageCountModalOpen(false);
  };

  // Function to handle change in new tippani row
  const handleNewTippaniChange = (e, field, index) => {
    const value = e.target.value;
    setNewTippaniRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Function to handle change in new document row
  const handleNewDocumentChange = (e, field, index) => {
    const value = e.target.value;
    setNewDocumentRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Function to save new tippani rows
  const saveNewTippani = async () => {
    try {
      // Validate required fields
      for (const row of newTippaniRows) {
        if (!row.subject) {
          toast.error("विषय फील्ड आवश्यक छ।");
          return;
        }
      }

      // Create a copy of the current tippani array or initialize if none exists
      const updatedTippani = [
        ...(fileDetails.tippani || []),
        ...newTippaniRows
      ];
      
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          tippani: updatedTippani
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Refetch file details to update the UI
      await fetchFileDetails();
      
      // Reset state
      setNewTippaniRows([]);
      setAddingNewTippani(false);
      
      toast.success("टिप्पणी सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding new tippani:", error);
      toast.error(`टिप्पणी थप्न असफल: ${error.message}`);
    }
  };

  // Function to save new document rows
  const saveNewDocuments = async () => {
    try {
      // Validate required fields
      for (const row of newDocumentRows) {
        if (!row.subject) {
          toast.error("विषय फील्ड आवश्यक छ।");
          return;
        }
      }

      // Create a copy of the current documents array or initialize if none exists
      const updatedDocuments = [
        ...(fileDetails.letters_and_documents || []),
        ...newDocumentRows
      ];
      
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          letters_and_documents: updatedDocuments
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Refetch file details to update the UI
      await fetchFileDetails();
      
      // Reset state
      setNewDocumentRows([]);
      setAddingNewDocuments(false);
      
      toast.success("कागजात सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding new documents:", error);
      toast.error(`कागजात थप्न असफल: ${error.message}`);
    }
  };

  // Function to cancel adding new rows
  const cancelAddingNewRows = (type) => {
    if (type === "tippani") {
      setNewTippaniRows([]);
      setAddingNewTippani(false);
    } else if (type === "document") {
      setNewDocumentRows([]);
      setAddingNewDocuments(false);
    }
  };

  const addLandDetail = () => {
    setLandDetails((prevState) => ([...prevState, newLandDetail]));
    setNewLandDetail({
      district: "",
      municipality: "",
      ward_no: "",
      kitta_no: "",
      guthi_name: "",
      land_type: "",
      related_file: id,
    });
  };

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
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      await fetchFileDetails();
      
      setEditable(false);
      toast.success("परिवर्तनहरू सफलतापूर्वक सुरक्षित गरियो!");
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error(`परिवर्तनहरू सुरक्षित गर्न असफल: ${error.message}`);
    }
  };

  const handleSaveLandDetails = async () => {
    try {
      // Update existing records
      for (const detail of landDetails) {
        if (detail.id) {
          await fetch(`${baseUrl}/land-details/${detail.id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify(detail),
          });
        } else {
          // Create new records
          await fetch(`${baseUrl}/land-details/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify({...detail, related_file: id}),
          });
        }
      }
      
      toast.success("जग्गा विवरण सफलतापूर्वक अद्यावधिक गरियो");
      fetchLandDetails();
    } catch (error) {
      console.error("Error updating land details:", error);
      toast.error("जग्गा विवरण अद्यावधिक गर्न असफल");
    }
  };

  // Navigation handler
  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    if (level === "5") {
      navigate("/admindashboard");
    } else {
      navigate("/employeeheader");
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-4 border-[#E68332] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">लोड गर्दै...</p>
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">फाइल फेला परेन</h2>
          <p className="text-gray-600 mb-6">अनुरोध गरिएको फाइल उपलब्ध छैन वा हटाइएको हुन सक्छ।</p>
          <button 
            onClick={handleNavigate}
            className="px-6 py-2 bg-[#E68332] text-white rounded-md shadow-md hover:bg-[#d9773b] transition-all"
          >
            होम पृष्ठमा फर्कनुहोस्
          </button>
        </div>
      </div>
    );
  }

  // Extracting properties safely from nested objects with default values
  const {
    file_name = "",
    subject = "",
    file = "",
    file_number = "",
    present_date = "",
    days_submitted = "",
    total_tippani_pages = "",
    total_documents_pages = "",
    total_page_count = "",
    letters_and_documents = [],
    tippani = [], 
    province = "",
    district = "",
    municipality = "",
    ward_no = "",
    tole = "",
  } = fileDetails || {};

  // Safely extract nested object properties
  const related_guthi_name = fileDetails?.related_guthi?.name || "N/A";
  const related_department_name = fileDetails?.related_department?.name || "N/A";
  const submitted_by_name = fileDetails?.submitted_by || "N/A";

  // Tab data for better organization
  const tabs = [
    { id: 0, name: "फाइल जानकारी", icon: <FaFileAlt className="mr-2" /> },
    { id: 1, name: "टिप्पणी", icon: <FaRegClipboard className="mr-2" /> },
    { id: 2, name: "पत्रहरू र कागजातहरू", icon: <FaRegFileAlt className="mr-2" /> },
    { id: 3, name: "जग्गा विवरण", icon: <FaMapMarkerAlt className="mr-2" /> },
    { id: 4, name: "फाइल इतिहास", icon: <FaHistory className="mr-2" /> },
  ];

  // Replace AnimatePresence with regular div
  const TabContent = ({ activeTab, children }) => {
    return (
      <div className="tab-content">
        {children}
      </div>
    );
  };

  // Replace motion.div with animated div
  const AnimatedDiv = ({ 
    children, 
    className = "", 
    animationType = "fade", 
    delay = 0,
    ...props 
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }, [delay]);
    
    const animationClass = isVisible ? "animate-" + animationType : "opacity-0";
    
    return (
      <div 
        className={`${className} ${animationClass} transition-all duration-500`}
        style={{ 
          transitionDelay: `${delay}s`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Back Button with improved styling */}
      <div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleNavigate}
        className="fixed top-4 left-4 z-10 group"
      >
        <div className="flex items-center px-4 py-2 bg-[#E68332] text-white rounded-md shadow-md hover:bg-[#d9773b] cursor-pointer transition-all">
          <IoMdArrowRoundBack className="mr-2 group-hover:animate-pulse" /> 
          <span className="font-medium">होम</span>
        </div>
      </div>
      
      {/* Page Header with slide-in animation */}
      <div 
        className="mb-6 pt-10 md:pt-16" 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[#E68332] mb-3 text-center">फाइल विवरण</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center">
            <span className="text-gray-500 mr-2">फाइल नं:</span> 
            <span className="font-semibold text-gray-800">{file_number}</span>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center">
            <span className="text-gray-500 mr-2">फाइल नाम:</span> 
            <span className="font-semibold text-gray-800">{file_name}</span>
          </div>
        </div>
      </div>

      {/* Edit Controls */}
      <div 
        className="flex justify-center mb-6 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className={`px-6 py-2 rounded-md shadow-md transition-all flex items-center ${
            editable 
              ? 'bg-gray-500 text-white hover:bg-gray-600' 
              : 'bg-[#E68332] text-white hover:bg-[#d9773b]'
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
          <div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-all flex items-center"
            onClick={handleSave}
          >
            <FaSave className="mr-2" />
            परिवर्तनहरू सुरक्षित गर्नुहोस्
          </div>
        )}
      </div>

      {/* Main content tabs - always show tabs now */}
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Enhanced Tab Navigation with icons */}
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

        {/* Tab Content with animations */}
        <div className="p-6">
          <TabContent activeTab={activeTab}>
            {/* File Information Tab */}
            {activeTab === 0 && (
              <AnimatedDiv 
                key="fileInfo"
                initial="inactive"
                animate="active"
                exit="inactive"
                animationType="fade"
                className="p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-[#E68332] hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-[#E68332] mb-4 flex items-center">
                      <FaFileAlt className="mr-2" />
                      मूल विवरण
                    </h3>
                    <div className="space-y-4">
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">फाइल नाम:</span> 
                        <span className="text-gray-900">{file_name}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">विषय:</span> 
                        <span className="text-gray-900">{subject}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">सम्बन्धित गुठी:</span> 
                        <span className="text-gray-900">{related_guthi_name}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">सम्बन्धित विभाग:</span> 
                        <span className="text-gray-900">{related_department_name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      स्थान विवरण
                    </h3>
                    <div className="space-y-4">
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">प्रदेश:</span> 
                        <span className="text-gray-900">{province}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">जिल्ला:</span> 
                        <span className="text-gray-900">{district}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">नगरपालिका/गाउँपालिका:</span> 
                        <span className="text-gray-900">{municipality}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">वार्ड नं:</span> 
                        <span className="text-gray-900">{ward_no}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">स्थानीय नाम:</span> 
                        <span className="text-gray-900">{tole}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                      <FaRegClock className="mr-2" />
                      पेश विवरण
                    </h3>
                    <div className="space-y-4">
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">प्रस्तुत मिति:</span> 
                        <span className="text-gray-900">{present_date}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">पेश गर्ने:</span> 
                        <span className="text-gray-900">{submitted_by_name}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">पेश भएका दिनहरू:</span> 
                        <span className="text-gray-900">{days_submitted}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center">
                      <FaRegFilePdf className="mr-2" />
                      पृष्ठ विवरण
                    </h3>
                    <div className="space-y-4">
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">कुल टिप्पणी पृष्ठहरू:</span> 
                        <span className="text-gray-900">{total_tippani_pages}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">कुल कागजात पृष्ठहरू:</span> 
                        <span className="text-gray-900">{total_documents_pages}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">कुल पृष्ठ संख्या:</span> 
                        <span className="text-gray-900">{total_page_count || "उपलब्ध छैन"}</span>
                      </p>
                      <p className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium text-gray-700">फाइल:</span> 
                        <span className="text-gray-900">{file || "उपलब्ध छैन"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            )}

            {/* Updated Tippani Tab with in-table editing */}
            {activeTab === 1 && (
              <AnimatedDiv 
                key="tippani"
                initial="inactive"
                animate="active"
                exit="inactive"
                animationType="fade"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#E68332] flex items-center">
                      <FaRegClipboard className="mr-2" />
                      टिप्पणी विवरण
                    </h3>
                    {editable && !addingNewTippani && (
                      <button
                        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                        onClick={() => openPageCountModal("tippani")}
                      >
                        <MdAdd className="text-xl" />
                        टिप्पणी थप्नुहोस्
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 mb-4">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">विषय</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">पेश गर्ने</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">पेश मिति</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">स्वीकृत गर्ने</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">स्वीकृत मिति</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">कैफियत</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">टिप्पणी मिति</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">पृष्ठ</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Existing Tippani Rows */}
                        {Array.isArray(tippani) && tippani.length > 0 ? (
                          tippani.map((tip, index) => (
                            <tr
                              key={`existing-tippani-${index}`}
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                                hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                            >
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.subject || ""}
                                    onChange={(e) => handleChange(e, "subject", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <div className="line-clamp-2 group-hover:line-clamp-none">
                                    {tip.subject || "N/A"}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.submitted_by || ""}
                                    onChange={(e) => handleChange(e, "submitted_by", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    {tip.submitted_by || "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.submitted_date || ""}
                                    onChange={(e) => handleChange(e, "submitted_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center text-gray-800">
                                    <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                    {tip.submitted_date || "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.approved_by || ""}
                                    onChange={(e) => handleChange(e, "approved_by", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                                    </svg>
                                    {tip.approved_by || "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.approved_date || ""}
                                    onChange={(e) => handleChange(e, "approved_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center text-gray-800">
                                    <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                    {tip.approved_date || "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.remarks || ""}
                                    onChange={(e) => handleChange(e, "remarks", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <div className="line-clamp-2">
                                    {tip.remarks || "N/A"}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.tippani_date || ""}
                                    onChange={(e) => handleChange(e, "tippani_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center text-gray-800">
                                    <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                    {tip.tippani_date || "N/A"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.page_no || ""}
                                    onChange={(e) => handleChange(e, "page_no", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{tip.page_no || "N/A"}</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : !addingNewTippani ? (
                          <tr className="bg-white">
                            <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                              कुनै टिप्पणी उपलब्ध छैन
                            </td>
                          </tr>
                        ) : null}

                        {/* New Tippani Rows for Adding */}
                        {addingNewTippani && newTippaniRows.map((row, index) => (
                          <tr key={`new-tippani-${index}`} className="bg-green-50 hover:bg-green-100 border-b border-gray-200">
                            <td className="px-4 py-3 text-sm border-l-2 border-green-500">
                              <input
                                type="text"
                                value={row.subject || ""}
                                onChange={(e) => handleNewTippaniChange(e, "subject", index)}
                                placeholder="विषय"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                required
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.submitted_by || ""}
                                onChange={(e) => handleNewTippaniChange(e, "submitted_by", index)}
                                placeholder="पेश गर्ने"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="date"
                                value={row.submitted_date || ""}
                                onChange={(e) => handleNewTippaniChange(e, "submitted_date", index)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.approved_by || ""}
                                onChange={(e) => handleNewTippaniChange(e, "approved_by", index)}
                                placeholder="स्वीकृत गर्ने"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="date"
                                value={row.approved_date || ""}
                                onChange={(e) => handleNewTippaniChange(e, "approved_date", index)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.remarks || ""}
                                onChange={(e) => handleNewTippaniChange(e, "remarks", index)}
                                placeholder="कैफियत"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="date"
                                value={row.tippani_date || ""}
                                onChange={(e) => handleNewTippaniChange(e, "tippani_date", index)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="number"
                                value={row.page_no || ""}
                                onChange={(e) => handleNewTippaniChange(e, "page_no", index)}
                                placeholder="पृष्ठ"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Save/Cancel buttons for new tippani */}
                  {addingNewTippani && (
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all flex items-center gap-2"
                        onClick={() => cancelAddingNewRows("tippani")}
                      >
                        <FaTimes className="text-sm" />
                        रद्द गर्नुहोस्
                      </button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2"
                        onClick={saveNewTippani}
                      >
                        <FaCheck className="text-sm" />
                        सुरक्षित गर्नुहोस्
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedDiv>
            )}

            {/* Updated Letters and Documents Tab with in-table editing */}
            {activeTab === 2 && (
              <AnimatedDiv 
                key="documents"
                initial="inactive"
                animate="active"
                exit="inactive"
                animationType="fade"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#E68332] flex items-center">
                      <FaRegFileAlt className="mr-2" />
                      पत्रहरू र कागजातहरू
                    </h3>
                    {editable && !addingNewDocuments && (
                      <button
                        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                        onClick={() => openPageCountModal("document")}
                      >
                        <MdAdd className="text-xl" />
                        कागजात थप्नुहोस्
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 mb-4">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">दर्ता नं</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">चलानी नं</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">मिति</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">विषय</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">पत्र मिति</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">कार्यालय</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">पृष्ठ संख्या</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Existing Document Rows */}
                        {Array.isArray(letters_and_documents) && letters_and_documents.length > 0 ? (
                          letters_and_documents.map((doc, index) => (
                            <tr
                              key={`existing-doc-${index}`}
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                                hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                            >
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={doc.registration_no || ""}
                                    onChange={(e) => handleChange(e, "registration_no", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  doc.registration_no || <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={doc.invoice_no || ""}
                                    onChange={(e) => handleChange(e, "invoice_no", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  doc.invoice_no || <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={doc.date || ""}
                                    onChange={(e) => handleChange(e, "date", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center text-gray-800">
                                    <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                    {doc.date || <span className="text-gray-400 italic">N/A</span>}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={doc.subject || ""}
                                    onChange={(e) => handleChange(e, "subject", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <div className="line-clamp-2 hover:line-clamp-none">
                                    {doc.subject || <span className="text-gray-400 italic">N/A</span>}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={doc.letter_date || ""}
                                    onChange={(e) => handleChange(e, "letter_date", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="flex items-center text-gray-800">
                                    <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                    {doc.letter_date || <span className="text-gray-400 italic">N/A</span>}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={doc.office || ""}
                                    onChange={(e) => handleChange(e, "office", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  doc.office || <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={doc.page_no || ""}
                                    onChange={(e) => handleChange(e, "page_no", index, "document")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  doc.page_no || <span className="text-gray-400 italic">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : !addingNewDocuments ? (
                          <tr className="bg-white">
                            <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                              कुनै कागजात उपलब्ध छैन
                            </td>
                          </tr>
                        ) : null}

                        {/* New Document Rows for Adding */}
                        {addingNewDocuments && newDocumentRows.map((row, index) => (
                          <tr key={`new-doc-${index}`} className="bg-green-50 hover:bg-green-100 border-b border-gray-200">
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.registration_no || ""}
                                onChange={(e) => handleNewDocumentChange(e, "registration_no", index)}
                                placeholder="दर्ता नं"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.invoice_no || ""}
                                onChange={(e) => handleNewDocumentChange(e, "invoice_no", index)}
                                placeholder="चलानी नं"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="date"
                                value={row.date || ""}
                                onChange={(e) => handleNewDocumentChange(e, "date", index)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.subject || ""}
                                onChange={(e) => handleNewDocumentChange(e, "subject", index)}
                                placeholder="विषय"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                required
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="date"
                                value={row.letter_date || ""}
                                onChange={(e) => handleNewDocumentChange(e, "letter_date", index)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={row.office || ""}
                                onChange={(e) => handleNewDocumentChange(e, "office", index)}
                                placeholder="कार्यालय"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="number"
                                value={row.page_no || ""}
                                onChange={(e) => handleNewDocumentChange(e, "page_no", index)}
                                placeholder="पृष्ठ संख्या"
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Save/Cancel buttons for new documents */}
                  {addingNewDocuments && (
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all flex items-center gap-2"
                        onClick={() => cancelAddingNewRows("document")}
                      >
                        <FaTimes className="text-sm" />
                        रद्द गर्नुहोस्
                      </button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2"
                        onClick={saveNewDocuments}
                      >
                        <FaCheck className="text-sm" />
                        सुरक्षित गर्नुहोस्
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedDiv>
            )}

            {/* Land Details Tab */}
            {activeTab === 3 && (
              <AnimatedDiv 
                key="landDetails"
                initial="inactive"
                animate="active"
                exit="inactive"
                animationType="fade"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#E68332] flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      जग्गा विवरण
                    </h3>
                    {editable && (
                      <button
                        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                        onClick={addLandDetail}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        नयाँ जग्गा विवरण थप्नुहोस्
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-auto rounded-lg shadow-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">जिल्ला</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">नगरपालिका</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">वार्ड नं</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">किट्टा नं</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">गुठी नाम</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">जग्गा प्रकार</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">सम्बन्धित फाइल</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(landDetails) && landDetails.length > 0 ? (
                          landDetails.map((detail, index) => (
                            <tr
                              key={index}
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                                hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                            >
                              <td className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-[#E68332] group">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.district || ""}
                                    onChange={(e) => handleLandDetailChange(e, "district", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <div className="line-clamp-2 group-hover:line-clamp-none">
                                    {detail.district || "N/A"}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.municipality || ""}
                                    onChange={(e) => handleLandDetailChange(e, "municipality", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{detail.municipality || "N/A"}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.ward_no || ""}
                                    onChange={(e) => handleLandDetailChange(e, "ward_no", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{detail.ward_no || "N/A"}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.kitta_no || ""}
                                    onChange={(e) => handleLandDetailChange(e, "kitta_no", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{detail.kitta_no || "N/A"}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.guthi_name || ""}
                                    onChange={(e) => handleLandDetailChange(e, "guthi_name", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{detail.guthi_name || "N/A"}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={detail.land_type || ""}
                                    onChange={(e) => handleLandDetailChange(e, "land_type", index)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  <span className="text-gray-900">{detail.land_type || "N/A"}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="text-gray-900">{id}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="bg-white">
                            <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                              कुनै जग्गा विवरण उपलब्ध छैन
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedDiv>
            )}

            {/* File History Tab */}
            {activeTab === 4 && (
              <AnimatedDiv 
                key="fileHistory"
                initial="inactive"
                animate="active"
                exit="inactive"
                animationType="fade"
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#E68332] mb-4 flex items-center">
                    <FaHistory className="mr-2" />
                    फाइल इतिहास
                  </h3>
                  
                  {fileHistory.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      कुनै इतिहास उपलब्ध छैन
                    </p>
                  ) : (
                    <FileHistoryTimeline 
                      data={fileHistory} 
                      className="mt-4"
                    />
                  )}
                </div>
              </AnimatedDiv>
            )}
          </TabContent>
        </div>
      </div>

      {/* Page Count Modal */}
      {isPageCountModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#E68332]">
                {pageCountModalType === "tippani" ? "टिप्पणी पृष्ठ संख्या" : "कागजात पृष्ठ संख्या"}
              </h3>
              <button 
                onClick={() => setIsPageCountModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">पृष्ठ संख्या प्रविष्ट गर्नुहोस्:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                {pageCountModalType === "tippani" 
                  ? "कृपया थप्न चाहनुभएको टिप्पणी पृष्ठ संख्या प्रविष्ट गर्नुहोस्।"
                  : "कृपया थप्न चाहनुभएको कागजात पृष्ठ संख्या प्रविष्ट गर्नुहोस्।"
                }
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPageCountModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={handlePageCountSubmit}
                className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-colors"
              >
                सुनिश्चित गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this style block for animations and table responsiveness */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        
        .animate-fade {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        tr {
          transition: all 0.2s ease;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-none {
          -webkit-line-clamp: unset;
        }
        
        /* Make table more responsive */
        @media (max-width: 768px) {
          .table-fixed {
            table-layout: fixed;
          }
          
          /* Create horizontal scrolling for small screens */
          .overflow-auto {
            overflow-x: auto;
            scrollbar-width: thin;
          }
          
          .overflow-auto::-webkit-scrollbar {
            height: 6px;
          }
          
          .overflow-auto::-webkit-scrollbar-thumb {
            background-color: rgba(230, 131, 50, 0.3);
            border-radius: 3px;
          }
          
          .overflow-auto::-webkit-scrollbar-track {
            background-color: rgba(230, 131, 50, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ViewMoreFileDetails;
