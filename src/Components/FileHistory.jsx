import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowRight, FaCheckCircle, FaClock } from "react-icons/fa";

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
      const response = await fetch(`${baseUrl}/files/${id}/history/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setFileData(data);
    } catch (error) {
      console.error("Error fetching file history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#E68332]"></div>
      </div>
    );
  }

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

        {fileData && (
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
                    {fileData.current_location}
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

      {/* Timeline section with improved visualization */}
      {fileData ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#E68332] mb-8 text-center">
            फाइल अनुवर्तन इतिहास
          </h2>

          {fileData.history.length > 0 ? (
            <div className="relative">
              {/* Visual timeline with improved design */}
              <div className="flex flex-col space-y-12">
                {fileData.history.map((entry, index) => (
                  <div key={index} className="relative">
                    {/* Timeline connector */}
                    {index < fileData.history.length - 1 && (
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
                              <span className="font-medium">पठाउने:</span> {entry.sent_by}
                            </p>
                            <p>
                              <span className="font-medium">मिति:</span> {entry.date || "N/A"}
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
                            {entry.to_location || "अन्तिम गन्तव्य"}
                          </p>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">प्राप्तकर्ता:</span>{" "}
                              {entry.received_by || "अझै प्राप्त भएको छैन"}
                            </p>
                            <p>
                              <span className="font-medium">मिति:</span> {entry.date || "N/A"}
                            </p>
                          </div>
                          <div className="mt-3 flex justify-center">
                            {entry.received_by ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                                <FaCheckCircle className="mr-1" /> प्राप्त गरियो
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                                <FaClock className="mr-1" /> प्रक्रियामा
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status information */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                          <span className="font-medium">कार्य स्थिति:</span> {entry.status || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-lg">कुनै इतिहास रेकर्ड उपलब्ध छैन।</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          फाइल इतिहास लोड गर्न असमर्थ। कृपया पछि फेरि प्रयास गर्नुहोस्。
        </div>
      )}
    </div>
  );
};

export default FileHistory;
