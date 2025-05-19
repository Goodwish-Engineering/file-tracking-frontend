import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TippaniFormModal from "./TippaniFormModal";
import DocumentFormModal from "./DocumentFormModal";
import { IoMdArrowRoundBack } from "react-icons/io";

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

  // Fetch initial data
  useEffect(() => {
    fetchFileDetails();
    fetchLandDetails();
  }, []);

  // Fetch file details
  const fetchFileDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setFileDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file details:", error);
      setLoading(false);
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
      const data = await response.json();
      setLandDetails(data);
    } catch (error) {
      console.error("Error fetching land details:", error);
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
    setTippani(true);
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
  };

  const addDocument = () => {
    setLetter(true);
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
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error(`Failed to save changes: ${error.message}`);
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

  // Loading and error states
  if (loading) {
    return (
      <div className="text-center mt-10 text-[#E68332] text-lg">
        Loading...
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        File not found
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

  return (
    <div className="w-full mx-auto p-6 bg-gray-50">
      {/* Back Button */}
      <div
        onClick={handleNavigate}
        className="justify-end px-4 py-1 items-end flex fixed top-2 left-2 text-white font-semibold bg-[#E68332] cursor-pointer gap-2 rounded-md z-10"
      >
        <div className="text-lg flex items-center gap-2"><IoMdArrowRoundBack/> होम</div>
      </div>
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#E68332] mb-3 text-center">फाइल विवरण</h1>
        <p className="text-center text-gray-600">फाइल नं: {file_number}</p>
      </div>

      {/* Edit Controls */}
      <div className="flex justify-center mb-6">
        <button
          className="px-6 py-2 bg-[#E68332] text-white rounded-md shadow-md hover:bg-[#d9773b] transition-all"
          onClick={handleEditToggle}
        >
          {editable ? "रद्द गर्नुहोस्" : "सम्पादन गर्नुहोस्"}
        </button>
        
        {editable && (
          <button
            className="ml-4 px-6 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-all"
            onClick={handleSave}
          >
            परिवर्तनहरू सुरक्षित गर्नुहोस्
          </button>
        )}
      </div>

      {/* Custom Tabs Implementation */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Custom Tab List */}
        <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg px-4">
          {["फाइल जानकारी", "टिप्पणी", "पत्रहरू र कागजातहरू", "जग्गा विवरण"].map((tabName, index) => (
            <button
              key={index}
              className={`py-4 px-6 font-semibold cursor-pointer transition-colors outline-none border-b-2 ${
                activeTab === index
                  ? "text-[#E68332] border-[#E68332] bg-[#f9f1e9]"
                  : "text-gray-700 border-transparent hover:text-[#E68332]"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* File Information Tab */}
          {activeTab === 0 && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-xl font-semibold text-[#E68332] mb-4">मूल विवरण</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">फाइल नाम:</span> 
                      <span className="text-gray-700">{file_name}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">विषय:</span> 
                      <span className="text-gray-700">{subject}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">सम्बन्धित गुठी:</span> 
                      <span className="text-gray-700">{related_guthi_name}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">सम्बन्धित विभाग:</span> 
                      <span className="text-gray-700">{related_department_name}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-xl font-semibold text-[#E68332] mb-4">स्थान विवरण</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">प्रदेश:</span> 
                      <span className="text-gray-700">{province}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">जिल्ला:</span> 
                      <span className="text-gray-700">{district}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">नगरपालिका/गाउँपालिका:</span> 
                      <span className="text-gray-700">{municipality}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">वार्ड नं:</span> 
                      <span className="text-gray-700">{ward_no}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">स्थानीय नाम:</span> 
                      <span className="text-gray-700">{tole}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-xl font-semibold text-[#E68332] mb-4">पेश विवरण</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">प्रस्तुत मिति:</span> 
                      <span className="text-gray-700">{present_date}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">पेश गर्ने:</span> 
                      <span className="text-gray-700">{submitted_by_name}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">पेश भएका दिनहरू:</span> 
                      <span className="text-gray-700">{days_submitted}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-xl font-semibold text-[#E68332] mb-4">पृष्ठ विवरण</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">कुल टिप्पणी पृष्ठहरू:</span> 
                      <span className="text-gray-700">{total_tippani_pages}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">कुल कागजात पृष्ठहरू:</span> 
                      <span className="text-gray-700">{total_documents_pages}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">कुल पृष्ठ संख्या:</span> 
                      <span className="text-gray-700">{total_page_count || "उपलब्ध छैन"}</span>
                    </p>
                    <p className="flex justify-between border-b pb-2">
                      <span className="font-medium">फाइल:</span> 
                      <span className="text-gray-700">{file || "उपलब्ध छैन"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tippani Tab */}
          {activeTab === 1 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#E68332]">टिप्पणी विवरण</h3>
                {editable && (
                  <button
                    className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b]"
                    onClick={() => setIsTippaniModalOpen(true)}
                  >
                    <span className="flex items-center gap-2">+ टिप्पणी थप्नुहोस्</span>
                  </button>
                )}
              </div>
              
              <div className="overflow-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#E68332]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">विषय</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">पेश गर्ने</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">पेश गरेको मिति</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">पेश गरिएको</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">स्वीकृत मिति</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">टिप्पणी</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">टिप्पणी मिति</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">पाना संख्या</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tippani.length > 0 ? (
                      tippani.map((tip, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editable ? (
                              <input
                                type="text"
                                value={tip.subject || ""}
                                onChange={(e) => handleChange(e, "subject", index, "tippani")}
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
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
                                className="w-full border border-gray-300 rounded px-2 py-1"
                              />
                            ) : (
                              tip.page_no || "N/A"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                          कुनै टिप्पणी उपलब्ध छैन
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Letters and Documents Tab */}
          {activeTab === 2 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#E68332]">पत्रहरू र कागजातहरू</h3>
                {editable && (
                  <button
                    className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b]"
                    onClick={() => setIsDocumentModalOpen(true)}
                  >
                    <span className="flex items-center gap-2">+ कागजात थप्नुहोस्</span>
                  </button>
                )}
              </div>
              
              <div className="overflow-auto max-h-[400px] rounded-t-lg">
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
                  className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded"
                  onClick={() => setIsDocumentModalOpen(true)}
                >
                  कागजात थप्नुहोस्
                </button>
              )}
            </div>
          )}

          {/* Land Details Tab */}
          {activeTab === 3 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#E68332]">जग्गा विवरण</h3>
                {editable && (
                  <div className="space-x-2">
                    <button
                      className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b]"
                      onClick={() => setIsLandDetailsModalOpen(true)}
                    >
                      <span className="flex items-center gap-2">+ जग्गा विवरण थप्नुहोस्</span>
                    </button>
                    
                    {landDetails.length > 0 && (
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={handleSaveLandDetails}
                      >
                        सुरक्षित गर्नुहोस्
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="overflow-auto max-h-[400px] rounded-t-lg">
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
                              className="w-full px-2 py-1"
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
                              className="w-full px-2 py-1"
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
                              className="w-full px-2 py-1"
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
                              className="w-full px-2 py-1"
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
                              className="w-full px-2 py-1"
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
                              className="w-full px-2 py-1"
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
          )}
        </div>
      </div>

      {/* Modals */}
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
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <h2 className="text-xl font-bold mb-4">नयाँ जग्गा विवरण थप्नुहोस्</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">जिल्ला</label>
              <input
                type="text"
                value={newLandDetail.district || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, district: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">नगरपालिका</label>
              <input
                type="text"
                value={newLandDetail.municipality || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, municipality: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">वार्ड नं</label>
              <input
                type="number"
                value={newLandDetail.ward_no || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, ward_no: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">कित्ता नं</label>
              <input
                type="text"
                value={newLandDetail.kitta_no || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, kitta_no: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">गुठी नाम</label>
              <input
                type="text"
                value={newLandDetail.guthi_name || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, guthi_name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">जग्गा प्रकार</label>
              <select
                value={newLandDetail.land_type || ""}
                onChange={(e) => setNewLandDetail({...newLandDetail, land_type: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">--जग्गा प्रकार छान्नुहोस्--</option>
                <option value="अधिनस्थ">अधिनस्थ</option>
                <option value="रैतानी">रैतानी</option>
                <option value="तैनाथी">तैनाथी</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => setIsLandDetailsModalOpen(false)}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                className="bg-[#E68332] text-white hover:bg-[#c36f2a] px-4 py-2 rounded"
                onClick={() => {
                  addLandDetail();
                  setIsLandDetailsModalOpen(false);
                }}
              >
                थप्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMoreFileDetails;