import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowRight, FaCheckCircle, FaClock } from "react-icons/fa";

// Create a reusable history timeline component that can be used both standalone and in the tab
export const FileHistoryTimeline = ({ historyData, isLoading }) => {
  // Ensure historyData is always an array before attempting to map over it
  const historyItems = Array.isArray(historyData) ? historyData : [];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#E68332]"></div>
      </div>
    );
  }

  if (!historyItems || historyItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p className="text-lg">कुनै इतिहास रेकर्ड उपलब्ध छैन।</p>
      </div>
    );
  }

  // Debug: Log the history items to see what data we're working with
  console.log("History Items:", historyItems);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-[#E68332] mb-8 text-center">
        फाइल अनुवर्तन इतिहास
      </h2>

      <div className="relative">
        <div className="flex flex-col space-y-12">
          {historyItems.map((entry, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < historyItems.length - 1 && (
                <div
                  className="absolute left-1/2 h-12 border-l-2 border-dashed border-gray-300"
                  style={{
                    top: "100%",
                    transform: "translateX(-50%)",
                  }}
                ></div>
              )}

              {/* Entry card with flow direction */}
              <div className="bg-gray-50 rounded-lg shadow-md p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* From location */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#E68332]">
                    <h3 className="font-bold text-[#E68332] text-lg mb-2 text-center">
                      प्रस्थान स्थान
                    </h3>
                    <p className="text-lg font-medium text-center mb-3">
                      {entry.from_location || "शुरुवात स्थान"}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">पठाउने:</span> {entry.sent_by || entry.user_name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">मिति:</span> {entry.date || entry.created_at || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Direction indicator */}
                  <div className="flex justify-center items-center">
                    <div className="hidden md:flex items-center w-full">
                      <div className="h-0.5 bg-[#E68332] flex-grow"></div>
                      <div className="bg-[#E68332] h-10 w-10 rounded-full flex items-center justify-center text-white mx-4">
                        <FaArrowRight className="text-lg" />
                      </div>
                      <div className="h-0.5 bg-[#E68332] flex-grow"></div>
                    </div>
                    <div className="md:hidden flex items-center justify-center my-4">
                      <div className="bg-[#E68332] h-10 w-10 rounded-full flex items-center justify-center text-white transform rotate-90">
                        <FaArrowRight className="text-lg" />
                      </div>
                    </div>
                  </div>

                  {/* To location */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border-r-4 border-green-600">
                    <h3 className="font-bold text-green-700 text-lg mb-2 text-center">
                      प्राप्त स्थान
                    </h3>
                    <p className="text-lg font-medium text-center mb-3">
                      {entry.to_location || entry.action || "अन्तिम गन्तव्य"}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">प्राप्तकर्ता:</span>{" "}
                        {entry.received_by || entry.user_name || "अझै प्राप्त भएको छैन"}
                      </p>
                      <p>
                        <span className="font-medium">विवरण:</span>{" "}
                        {entry.details || "विवरण उपलब्ध छैन"}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-center">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${entry.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {entry.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FileHistory = () => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const navigate = useNavigate();

  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    if (level === "5") {
      navigate("/admindashboard");
    } else {
      navigate("/employeeheader");
    }
  };

  useEffect(() => {
    fetchFileDetails();
  }, []);

  const fetchFileDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Update to use the same API endpoint as ViewMoreFileDetails
      const response = await fetch(`${baseUrl}/files/${id}/history/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format data to be compatible with our rendering component
      const formattedData = {
        ...data,
        history: Array.isArray(data) ? data : (data.history || [])
      };
      
      setFileData(formattedData);
    } catch (error) {
      console.error("Error fetching file history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use our timeline component for the main page
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section with improved styling */}
      <div className="flex flex-col mb-8">
        <div
          onClick={handleNavigate}
          className="self-start px-4 py-2 mb-6 text-white font-semibold bg-[#E68332] cursor-pointer rounded-md shadow-md hover:bg-[#d9773b] transition-all flex items-center gap-2"
        >
          <IoMdArrowRoundBack /> होम
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#E68332] mb-3">फाइल इतिहास</h1>
          {fileData && (
            <p className="text-lg text-gray-700">
              फाइल नं:{" "}
              <span className="font-medium">{fileData.file_number || "N/A"}</span>
            </p>
          )}
        </div>

        {/* Display basic file info if available */}
        {fileData && fileData.file_name && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium text-[#E68332]">फाइल नाम:</span>{" "}
                  {fileData.file_name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-[#E68332]">वर्तमान स्थान:</span>{" "}
                  <span className="text-green-600 font-medium">
                    {fileData.current_location || "विवरण उपलब्ध छैन"}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium text-[#E68332]">विषय:</span>{" "}
                  {fileData.subject || "N/A"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-[#E68332]">अवस्था:</span>{" "}
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    सक्रिय
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Use our new reusable timeline component */}
      <FileHistoryTimeline 
        historyData={Array.isArray(fileData) ? fileData : 
                    Array.isArray(fileData?.history) ? fileData.history : []} 
        isLoading={loading}
      />
    </div>
  );
};

export default FileHistory;
