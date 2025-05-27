import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TippaniFormModal from "./TippaniFormModal";
import DocumentFormModal from "./DocumentFormModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FileHistoryTimeline } from "./FileHistory";
import { 
  FaRegFilePdf, 
  FaPencilAlt, 
  FaSave, 
  FaFileAlt, 
  FaRegClipboard, 
  FaRegFileAlt, 
  FaMapMarkerAlt, 
  FaRegClock, 
  FaHistory 
} from "react-icons/fa";

const ViewMoreFileDetails = () => {
  const { id } = useParams();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [fileDetails, setFileDetails] = useState(null);
  const [isTippaniModalOpen, setIsTippaniModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isLandDetailsModalOpen, setIsLandDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [landDetails, setLandDetails] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [fileHistory, setFileHistory] = useState([]);
  const navigate = useNavigate();
  
  // State for form data
  const [newTippani, setNewTippani] = useState({
    subject: "",
    submitted_by: "",
    submitted_date: "",
    approved_by: "",
    approved_date: "",
    remarks: "",
    tippani_date: "",
    page_no: "",
  });
  
  const [newDoc, setNewDoc] = useState({
    registration_no: "",
    invoice_no: "",
    date: "",
    subject: "",
    letter_date: "",
    office: "",
    page_no: "",
  });
  
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

  // Handle form field changes
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

  // Add new items
  const addTippani = () => {
    setFileDetails((prevState) => ({
      ...prevState,
      tippani: [...(prevState.tippani || []), newTippani],
    }));
    setNewTippani({
      subject: "",
      submitted_by: "",
      submitted_date: "",
      approved_by: "",
      approved_date: "",
      remarks: "",
      tippani_date: "",
      page_no: "",
    });
    setIsTippaniModalOpen(false);
  };

  const addDocument = () => {
    setFileDetails((prevState) => ({
      ...prevState,
      letters_and_documents: [...(prevState.letters_and_documents || []), newDoc],
    }));
    setNewDoc({
      registration_no: "",
      invoice_no: "",
      date: "",
      subject: "",
      letter_date: "",
      office: "",
      page_no: "",
    });
    setIsDocumentModalOpen(false);
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

            {/* Tippani Tab */}
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
                    {editable && (
                      <button
                        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                        onClick={() => setIsTippaniModalOpen(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        टिप्पणी थप्नुहोस्
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-auto rounded-lg shadow-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">विषय</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">पेश गर्ने</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">पेश गरेको मिति</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">पेश गरिएको</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">स्वीकृत मिति</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">टिप्पणी</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">टिप्पणी मिति</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">पाना संख्या</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tippani.length > 0 ? (
                          tippani.map((tip, index) => (
                            <AnimatedDiv 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.subject || ""}
                                    onChange={(e) => handleChange(e, "subject", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.subject || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.submitted_by || ""}
                                    onChange={(e) => handleChange(e, "submitted_by", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.submitted_by || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.submitted_date || ""}
                                    onChange={(e) => handleChange(e, "submitted_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.submitted_date || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.approved_by || ""}
                                    onChange={(e) => handleChange(e, "approved_by", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.approved_by || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.approved_date || ""}
                                    onChange={(e) => handleChange(e, "approved_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.approved_date || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="text"
                                    value={tip.remarks || ""}
                                    onChange={(e) => handleChange(e, "remarks", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.remarks || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="date"
                                    value={tip.tippani_date || ""}
                                    onChange={(e) => handleChange(e, "tippani_date", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.tippani_date || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editable ? (
                                  <input
                                    type="number"
                                    value={tip.page_no || ""}
                                    onChange={(e) => handleChange(e, "page_no", index, "tippani")}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                  />
                                ) : (
                                  tip.page_no || "N/A"
                                )}
                              </td>
                            </AnimatedDiv>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="px-6 py-10 text-center text-gray-500 bg-gray-50">
                              <div className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="font-medium">कुनै टिप्पणी उपलब्ध छैन</p>
                                {editable && (
                                  <button
                                    onClick={() => setIsTippaniModalOpen(true)}
                                    className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] text-sm"
                                  >
                                    + टिप्पणी थप्नुहोस्
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
              </AnimatedDiv>
            )}

            {/* Letters and Documents Tab */}
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
                    {editable && (
                      <button
                        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                        onClick={() => setIsDocumentModalOpen(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        कागजात थप्नुहोस्
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-auto max-h-[400px] rounded-t-lg border border-gray-200">
                    <table className="min-w-full table-auto border-none bg-gray-100 overflow-hidden">
                      <thead>
                        <tr className="bg-[#E68332] text-white border-b-2 border-gray-300 text-nowrap">
                          <th className="py-2 px-4 text-left border-none">
                            दर्ता नं
                          </th>
                          <th className="py-2 px-4 text-left border-none">
                            चलानी नं
                          </th>
                          <th className="py-2 px-4 text-left border-none">मिति</th>
                          <th className="py-2 px-4 text-left border-none">विषय</th>
                          <th className="py-2 px-4 text-left border-none">
                            पत्र मिति
                          </th>
                          <th className="py-2 px-4 text-left border-none">कार्यालय</th>
                          <th className="py-2 px-4 text-left border-none">पाना संख्या</th>
                        </tr>
                      </thead>
                      <tbody>
                        {letters_and_documents.map((doc, index) => (
                          <tr
                            key={index}
                            className="border-b-2 border-gray-300 text-center"
                          >
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={doc.registration_no || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "registration_no",
                                      index,
                                      "document"
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.registration_no || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={doc.invoice_no || ""}
                                  onChange={(e) =>
                                    handleChange(e, "invoice_no", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.invoice_no || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="date"
                                  value={doc.date || ""}
                                  onChange={(e) =>
                                    handleChange(e, "date", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.date || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={doc.subject || ""}
                                  onChange={(e) =>
                                    handleChange(e, "subject", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.subject || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="date"
                                  value={doc.letter_date || ""}
                                  onChange={(e) =>
                                    handleChange(e, "letter_date", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.letter_date || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={doc.office || ""}
                                  onChange={(e) =>
                                    handleChange(e, "office", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.office || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={doc.page_no || ""}
                                  onChange={(e) =>
                                    handleChange(e, "page_no", index, "document")
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                doc.page_no || "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {editable && (
                    <button
                      className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all"
                      onClick={() => setIsDocumentModalOpen(true)}
                    >
                      कागजात थप्नुहोस्
                    </button>
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
                      <div className="space-x-2">
                        <button
                          className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                          onClick={() => setIsLandDetailsModalOpen(true)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          जग्गा विवरण थप्नुहोस्
                        </button>
                        
                        {landDetails.length > 0 && (
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                            onClick={handleSaveLandDetails}
                          >
                            सुरक्षित गर्नुहोस्
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="overflow-auto max-h-[400px] rounded-t-lg border border-gray-200">
                    <table className="min-w-full table-auto border-none bg-gray-100 overflow-hidden">
                      <thead>
                        <tr className="bg-[#E68332] text-white border-b-2 border-gray-300 text-nowrap">
                          <th className="py-2 px-4 text-left border-none">जिल्ला</th>
                          <th className="py-2 px-4 text-left border-none">नगरपालिका</th>
                          <th className="py-2 px-4 text-left border-none">वार्ड नं</th>
                          <th className="py-2 px-4 text-left border-none">कित्ता नं</th>
                          <th className="py-2 px-4 text-left border-none">गुठी नाम</th>
                          <th className="py-2 px-4 text-left border-none">जग्गा प्रकार</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landDetails.map((land, index) => (
                          <tr key={index} className="border-b-2 border-gray-300 text-center">
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={land.district || ""}
                                  onChange={(e) => handleLandDetailChange(e, "district", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                land.district || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={land.municipality || ""}
                                  onChange={(e) => handleLandDetailChange(e, "municipality", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                land.municipality || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="number"
                                  value={land.ward_no || ""}
                                  onChange={(e) => handleLandDetailChange(e, "ward_no", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                land.ward_no || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={land.kitta_no || ""}
                                  onChange={(e) => handleLandDetailChange(e, "kitta_no", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                land.kitta_no || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <input
                                  type="text"
                                  value={land.guthi_name || ""}
                                  onChange={(e) => handleLandDetailChange(e, "guthi_name", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                />
                              ) : (
                                land.guthi_name || "N/A"
                              )}
                            </td>
                            <td className="py-2 px-4 border-none">
                              {editable ? (
                                <select
                                  value={land.land_type || ""}
                                  onChange={(e) => handleLandDetailChange(e, "land_type", index)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                                >
                                  <option value="">--जग्गा प्रकार छान्नुहोस्--</option>
                                  <option value="अधिनस्थ">अधिनस्थ</option>
                                  <option value="रैतानी">रैतानी</option>
                                  <option value="तैनाथी">तैनाथी</option>
                                </select>
                              ) : (
                                land.land_type || "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
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
                className="p-4"
              >
                <h2 className="text-xl font-bold text-[#E68332] mb-6 flex items-center">
                  <FaHistory className="mr-2" />
                  फाइल इतिहास
                </h2>
                
                <FileHistoryTimeline 
                  historyData={fileHistory} 
                  isLoading={false}
                />
              </AnimatedDiv>
            )}
          </TabContent>
        </div>
      </div>

      {/* Modals with improved styling */}
      <TippaniFormModal
        isOpen={isTippaniModalOpen}
        onClose={() => setIsTippaniModalOpen(false)}
        onSubmit={addTippani}
        fileId={id}
      />

      <DocumentFormModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSubmit={addDocument}
        fileId={id}
      />

      {/* Land Details Modal */}
      {isLandDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* ...existing code... */}
        </div>
      )}
    </div>
  );
};

export default ViewMoreFileDetails;
