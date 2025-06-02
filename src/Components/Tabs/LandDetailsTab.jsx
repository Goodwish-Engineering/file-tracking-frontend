import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const LandDetailsTab = ({ 
  editable, 
  landDetails, 
  setLandDetails, 
  baseUrl, 
  token, 
  id, 
  fetchLandDetails 
}) => {
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

  // Handle changes to existing land details
  const handleLandDetailChange = (e, field, index) => {
    const value = e.target.value;
    const updatedLandDetails = [...landDetails];
    updatedLandDetails[index][field] = value;
    setLandDetails(updatedLandDetails);
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

    setLandDetails(prev => [...prev, {...newLandDetail}]);
    
    // Reset the form
    setNewLandDetail({
      district: "",
      municipality: "",
      ward_no: "",
      kitta_no: "",
      guthi_name: "",
      land_type: "",
      related_file: id,
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

  // Save all land details
  const handleSaveLandDetails = async () => {
    try {
      for (const detail of landDetails) {
        if (detail.id) {
          // Update existing record
          await fetch(`${baseUrl}/land-details/${detail.id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify(detail),
          });
        } else {
          // Create new record
          await fetch(`${baseUrl}/land-details/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
            body: JSON.stringify({ ...detail, related_file: id }),
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
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">जिल्ला</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">नगरपालिका</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">वार्ड नं</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">किट्टा नं</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">गुठी नाम</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">जग्गा प्रकार</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">सम्बन्धित फाइल</th>
              {editable && showNewRow && (
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-24 md:w-28">कार्य</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Existing Land Detail Rows */}
            {Array.isArray(landDetails) && landDetails.length > 0 ? (
              landDetails.map((detail, index) => (
                <tr
                  key={`land-detail-${index}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
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
                    type="text"
                    value={newLandDetail.ward_no}
                    onChange={(e) => handleNewLandDetailChange(e, "ward_no")}
                    placeholder="वार्ड नं"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
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
                  <input
                    type="text"
                    value={newLandDetail.guthi_name}
                    onChange={(e) => handleNewLandDetailChange(e, "guthi_name")}
                    placeholder="गुठी नाम"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    value={newLandDetail.land_type}
                    onChange={(e) => handleNewLandDetailChange(e, "land_type")}
                    placeholder="जग्गा प्रकार"
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-gray-900">{id}</span>
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
