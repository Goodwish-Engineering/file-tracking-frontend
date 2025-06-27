import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LAND_TYPE_CHOICES = [
  { value: "अधिनस्थ", label: "अधिनस्थ" },
  { value: "रैतानी", label: "रैतानी" },
  { value: "तैनाथी", label: "तैनाथी" },
];

const LandDetailsTab = ({ 
  editable, 
  landDetails, 
  setLandDetails, 
  baseUrl, 
  token, 
  id, 
  fetchLandDetails,
  fileData // Add fileData prop to get land_details from file response
}) => {
  const [offices, setOffices] = useState([]);
  // State for showing the new land detail row
  const [showNewRow, setShowNewRow] = useState(false);
  // State for new land detail
  const [newLandDetail, setNewLandDetail] = useState({
    district: "",
    municipality: "",
    ward_no: "",
    kitta_no: "",
    guthi_name: "",
    land_type: "",
    related_file: id,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Use land_details from fileData and filter by current file ID
  const currentLandDetails = React.useMemo(() => {
    if (fileData?.land_details && Array.isArray(fileData.land_details)) {
      // Filter land details to only show those related to current file
      return fileData.land_details.filter(detail => 
        detail.related_file === parseInt(id)
      );
    }
    
    // Fallback to landDetails prop if fileData is not available
    if (landDetails && Array.isArray(landDetails)) {
      return landDetails.filter(detail => 
        detail.related_file === parseInt(id)
      );
    }
    
    return [];
  }, [fileData, landDetails, id]);

  // Fetch offices data for dropdown
  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const response = await fetch(`${baseUrl}/offices/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOffices(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching Office data:", error);
        setOffices([]);
      }
    };

    if (editable) {
      fetchOfficeData();
    }
  }, [baseUrl, token, editable]);

  // Fetch land details specifically for this file if fileData is not available
  useEffect(() => {
    if (!fileData?.land_details && id) {
      fetchLandDetailsForFile();
    }
  }, [id, fileData]);

  const fetchLandDetailsForFile = async () => {
    try {
      const response = await fetch(`${baseUrl}/land-details/?related_file=${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched land details for file:", data);
        // Update landDetails state if setLandDetails is available
        if (setLandDetails) {
          setLandDetails(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error("Error fetching land details for file:", error);
    }
  };

  // Save all land details
  const handleSaveLandDetails = async () => {
    try {
      for (const detail of currentLandDetails) {
        // Find office name for guthi_name field
        const officeObj = offices.find(office => office.id.toString() === detail.guthi_name);
        const guthiName = officeObj ? officeObj.name : detail.guthi_name;
        
        // Prepare payload with proper data types
        const payload = {
          ...detail,
          ward_no: detail.ward_no ? parseInt(detail.ward_no) : null,
          guthi_name: guthiName, // Send office name as string
          related_file: parseInt(id), // Ensure correct file ID
        };

        if (detail.id) {
          // Update existing record
          await fetch(`${baseUrl}/land-details/${detail.id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Create new record
          await fetch(`${baseUrl}/land-details/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }
      }
      toast.success("जग्गा विवरण सफलतापूर्वक अद्यावधिक गरियो");
      // Refresh the file data instead of just land details
      if (fetchLandDetails) {
        fetchLandDetails();
      } else {
        // Fallback to re-fetch land details for this file
        fetchLandDetailsForFile();
      }
    } catch (error) {
      console.error("Error updating land details:", error);
      toast.error("जग्गा विवरण अद्यावधिक गर्न असफल");
    }
  };

  // Handle changes to existing land details
  const handleLandDetailChange = (e, field, index) => {
    const value = e.target.value;
    const updatedLandDetails = [...currentLandDetails];
    updatedLandDetails[index][field] = value;
    
    // Update landDetails state if setLandDetails is available
    if (setLandDetails) {
      // Filter the complete landDetails array and update only the relevant items
      const allLandDetails = landDetails || [];
      const otherFileDetails = allLandDetails.filter(detail => 
        detail.related_file !== parseInt(id)
      );
      setLandDetails([...otherFileDetails, ...updatedLandDetails]);
    }
  };

  // Handle changes to new land detail form
  const handleNewLandDetailChange = (e, field) => {
    const value = e.target.value;
    setNewLandDetail(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a new land detail
  const addLandDetail = () => {
    // Basic validation
    if (!newLandDetail.district || !newLandDetail.kitta_no) {
      toast.error("जिल्ला र किट्टा नं. आवश्यक छ");
      return;
    }

    // Ensure the new detail is related to current file
    const newDetailWithFileId = {
      ...newLandDetail,
      related_file: parseInt(id)
    };

    const updatedLandDetails = [...currentLandDetails, newDetailWithFileId];
    
    // Update landDetails state if setLandDetails is available
    if (setLandDetails) {
      // Filter the complete landDetails array and add the new detail
      const allLandDetails = landDetails || [];
      const otherFileDetails = allLandDetails.filter(detail => 
        detail.related_file !== parseInt(id)
      );
      setLandDetails([...otherFileDetails, ...updatedLandDetails]);
    }
    
    // Reset the form
    setNewLandDetail({
      district: "",
      municipality: "",
      ward_no: "",
      kitta_no: "",
      guthi_name: "",
      land_type: "",
      related_file: parseInt(id),
    });
    
    setShowNewRow(false);
  };

  // Cancel adding new land detail
  const cancelAddNewLand = () => {
    setShowNewRow(false);
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

  // Helper function to get office name by ID
  const getOfficeName = (officeId) => {
    const office = offices.find(o => o.id === parseInt(officeId));
    return office ? office.name : officeId || "N/A"; // Return the value itself if not found (in case it's already a name)
  };

  // Add helper function to get office ID by name (for dropdown selection)
  const getOfficeIdByName = (officeName) => {
    const office = offices.find(o => o.name === officeName);
    return office ? office.id.toString() : "";
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#E68332] flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          जग्गा विवरण
        </h3>
        {editable && (
          <div className="flex gap-3">
            {!showNewRow && (
              <button
                className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
                onClick={() => setShowNewRow(true)}
              >
                <FaPlus className="text-sm" />
                नयाँ जग्गा विवरण थप्नुहोस्
              </button>
            )}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2"
              onClick={handleSaveLandDetails}
            >
              <FaCheck className="text-sm" />
              सुरक्षित गर्नुहोस्
            </button>
          </div>
        )}
      </div>

      {/* Land Details Table */}
      <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 mb-4">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">क्र.सं.</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">जिल्ला</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">नगरपालिका</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">वार्ड नं</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">किट्टा नं</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">गुठी नाम</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">जग्गा प्रकार</th>
              {editable && showNewRow && (
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-24 md:w-28">कार्य</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Existing Land Detail Rows */}
            {Array.isArray(currentLandDetails) && currentLandDetails.length > 0 ? (
              currentLandDetails.map((detail, index) => (
                <tr
                  key={`land-detail-${index}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  <td className="px-4 py-3 text-sm">
                    <span className="text-gray-900 font-medium">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                        type="number"
                        value={detail.ward_no || ""}
                        onChange={(e) => handleLandDetailChange(e, "ward_no", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        min="1"
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
                      <div className="relative">
                        <select
                          value={getOfficeIdByName(detail.guthi_name) || ""}
                          onChange={(e) => {
                            const selectedOffice = offices.find(office => office.id.toString() === e.target.value);
                            const officeName = selectedOffice ? selectedOffice.name : "";
                            handleLandDetailChange({target: {value: officeName}}, "guthi_name", index);
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-6"
                        >
                          <option value="">गुठी छान्नुहोस्</option>
                          {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                              {office.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-900">{detail.guthi_name || "N/A"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <div className="relative">
                        <select
                          value={detail.land_type || ""}
                          onChange={(e) => handleLandDetailChange(e, "land_type", index)}
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-6"
                        >
                          <option value="">जग्गा प्रकार छान्नुहोस्</option>
                          {LAND_TYPE_CHOICES.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-900">{detail.land_type || "N/A"}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : !showNewRow ? (
              <tr className="bg-white">
                <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                  कुनै जग्गा विवरण उपलब्ध छैन
                </td>
              </tr>
            ) : null}
            
            {/* New Land Detail Row */}
            {editable && showNewRow && (
              <tr className="bg-green-50 hover:bg-green-100 border-b border-gray-200">
                <td className="px-4 py-3 text-sm border-l-2 border-green-500">
                  <span className="text-gray-900 font-medium">
                    {(currentLandDetails ? currentLandDetails.length : 0) + 1}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    value={newLandDetail.district}
                    onChange={(e) => handleNewLandDetailChange(e, "district")}
                    placeholder="जिल्ला*"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    required
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    value={newLandDetail.municipality}
                    onChange={(e) => handleNewLandDetailChange(e, "municipality")}
                    placeholder="नगरपालिका"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    value={newLandDetail.ward_no}
                    onChange={(e) => handleNewLandDetailChange(e, "ward_no")}
                    placeholder="वार्ड नं"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    min="1"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    value={newLandDetail.kitta_no}
                    onChange={(e) => handleNewLandDetailChange(e, "kitta_no")}
                    placeholder="किट्टा नं*"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    required
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="relative">
                    <select
                      value={getOfficeIdByName(newLandDetail.guthi_name) || ""}
                      onChange={(e) => {
                        const selectedOffice = offices.find(office => office.id.toString() === e.target.value);
                        const officeName = selectedOffice ? selectedOffice.name : "";
                        handleNewLandDetailChange({target: {value: officeName}}, "guthi_name");
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-6"
                    >
                      <option value="">गुठी छान्नुहोस्</option>
                      {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="relative">
                    <select
                      value={newLandDetail.land_type}
                      onChange={(e) => handleNewLandDetailChange(e, "land_type")}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-6"
                    >
                      <option value="">जग्गा प्रकार छान्नुहोस्</option>
                      {LAND_TYPE_CHOICES.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={addLandDetail}
                      className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                      title="थप्नुहोस्"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelAddNewLand}
                      className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                      title="रद्द गर्नुहोस्"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Instructions */}
      {editable && (
        <div className="mt-2 text-sm text-gray-500 italic">
          <span className="text-red-500">*</span> चिन्ह भएका फिल्डहरू आवश्यक छन्。
        </div>
      )}
    </motion.div>
  );
};

export default LandDetailsTab;
