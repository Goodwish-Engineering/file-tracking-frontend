import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegClipboard,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import DateInputField from "../Common/DateInputField";

const TippaniTab = ({
  editable,
  fileDetails,
  setFileDetails,
  baseUrl,
  token,
  id,
  fetchFileDetails,
}) => {
  // Local state for this component
  const [addingNewTippani, setAddingNewTippani] = useState(false);
  const [newTippaniRows, setNewTippaniRows] = useState([]);
  const [isPageCountModalOpen, setIsPageCountModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  // SubTippani related state
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [addingSubTippani, setAddingSubTippani] = useState({});
  const [newSubTippani, setNewSubTippani] = useState({});

  // Animation variant
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Toggle row expansion for SubTippani
  const toggleRowExpansion = (tippaniId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(tippaniId)) {
      newExpanded.delete(tippaniId);
    } else {
      newExpanded.add(tippaniId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle SubTippani form changes
  const handleSubTippaniChange = (tippaniId, field, value) => {
    setNewSubTippani((prev) => ({
      ...prev,
      [tippaniId]: {
        ...prev[tippaniId],
        [field]: value,
      },
    }));
  };

  // Start adding SubTippani
  const startAddingSubTippani = (tippaniId) => {
    setAddingSubTippani((prev) => ({ ...prev, [tippaniId]: true }));
    setNewSubTippani((prev) => ({
      ...prev,
      [tippaniId]: {
        approved_by: "",
        approved_date: "",
        remarks: "",
        related_tippani: tippaniId,
      },
    }));
  };

  // Cancel adding SubTippani
  const cancelAddingSubTippani = (tippaniId) => {
    setAddingSubTippani((prev) => ({ ...prev, [tippaniId]: false }));
    setNewSubTippani((prev) => {
      const updated = { ...prev };
      delete updated[tippaniId];
      return updated;
    });
  };

  // Save SubTippani
  const saveSubTippani = async (tippaniId) => {
    try {
      const subTippaniData = newSubTippani[tippaniId];

      if (!subTippaniData.approved_by || !subTippaniData.remarks) {
        toast.error("स्वीकृत गर्ने र कैफियत फील्डहरू आवश्यक छन्।");
        return;
      }

      // Find the parent tippani to get its data
      const parentTippani = fileDetails.tippani.find((tip) => tip.id === tippaniId);

      if (!parentTippani) {
        toast.error("मूल टिप्पणी फेला परेन।");
        return;
      }

      // Create the updated sub_tippani array with the new sub-tippani
      const updatedSubTippani = [
        ...(parentTippani.sub_tippani || []),
        {
          approved_by: subTippaniData.approved_by,
          approved_date: subTippaniData.approved_date,
          remarks: subTippaniData.remarks,
        },
      ];

      // Create the PATCH payload with only the sub_tippani field
      const patchPayload = {
        sub_tippani: updatedSubTippani,
      };

      console.log("PATCH payload for sub-tippani:", patchPayload);

      // Use PATCH request to update the existing tippani
      const response = await fetch(`${baseUrl}/tippani/${tippaniId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(patchPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Sub-tippani updated successfully:", responseData);

      await fetchFileDetails();
      cancelAddingSubTippani(tippaniId);
      toast.success("उप-टिप्पणी सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding SubTippani:", error);
      toast.error(`उप-टिप्पणी थप्न असफल: ${error.message}`);
    }
  };

  // Open page count modal
  const openPageCountModal = () => {
    setIsPageCountModalOpen(true);
    setPageCount(1);
  };

  // Handle page count submit
  const handlePageCountSubmit = () => {
    if (pageCount < 1) {
      toast.error("पृष्ठ संख्या १ भन्दा बढी हुनुपर्छ।");
      return;
    } else if (pageCount > 100) {
      toast.error("पृष्ठ संख्या १00 भन्दा कम हुनुपर्छ।");
      return;
    }

    const newRows = Array(pageCount)
      .fill()
      .map(() => ({
        subject: "",
        submitted_by: "",
        submitted_date: "",
        approved_by: "",
        approved_date: "",
        remarks: "",
        page_no: "1",
        related_file: id,
      }));

    setNewTippaniRows(newRows);
    setAddingNewTippani(true);
    setIsPageCountModalOpen(false);
  };

  // Handle changes to new tippani rows
  const handleNewTippaniChange = (e, field, index) => {
    const value = e.target.value;
    setNewTippaniRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Cancel adding new tippani
  const cancelAddingNewRows = () => {
    setNewTippaniRows([]);
    setAddingNewTippani(false);
  };

  // Save new tippani
  const saveNewTippani = async () => {
    try {
      // Validate required fields
      for (const row of newTippaniRows) {
        if (!row.subject) {
          toast.error("विषय फील्ड आवश्यक छ।");
          return;
        }
      }

      console.log("newtippani:", newTippaniRows);
      const response = await fetch(`${baseUrl}/tippani/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(newTippaniRows),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      await fetchFileDetails();
      setNewTippaniRows([]);
      setAddingNewTippani(false);
      toast.success("टिप्पणी सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding new tippani:", error);
      toast.error(`टिप्पणी थप्न असफल: ${error.message}`);
    }
  };

  // Safe access function for tippani properties
  const getTippaniValue = (tip, field, fallback = "N/A") => {
    try {
      if (!tip || typeof tip !== 'object') return fallback;
      
      // Handle different possible field names and structures
      const value = tip[field] || tip[`${field}_date`] || tip[`${field}_by`];
      
      if (value === null || value === undefined || value === '') {
        return fallback;
      }
      
      return String(value);
    } catch (error) {
      console.warn(`Error accessing tippani field ${field}:`, error);
      return fallback;
    }
  };

  // Enhanced normalization function with better error handling
  const normalizeAndSanitizeTippani = (tippaniData) => {
    if (!tippaniData) return [];
    
    try {
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
            page_no: "",
            id: Math.random().toString(36)
          }];
        }
      }

      if (tippaniData.length === 0) return [];

      return tippaniData.map((tip, index) => {
        const normalizedTip = {
          id: tip.id || Math.random().toString(36),
          subject: getTippaniValue(tip, 'subject', ''),
          submitted_by: getTippaniValue(tip, 'submitted_by', ''),
          submitted_date: getTippaniValue(tip, 'submitted_date', ''),
          approved_by: getTippaniValue(tip, 'approved_by', ''),
          approved_date: getTippaniValue(tip, 'approved_date', ''),
          remarks: getTippaniValue(tip, 'remarks', ''),
          page_no: getTippaniValue(tip, 'page_no', ''),
          sub_tippani: Array.isArray(tip.sub_tippani) ? tip.sub_tippani : []
        };

        // Handle any additional fields that might exist
        if (typeof tip === "object" && tip !== null) {
          Object.keys(tip).forEach((key) => {
            if (normalizedTip[key] === undefined && tip[key] !== undefined) {
              normalizedTip[key] = tip[key];
            }
          });
        }
        
        return normalizedTip;
      });
    } catch (error) {
      console.error('Error normalizing tippani data:', error);
      return [];
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
          <FaRegClipboard className="mr-2" />
          टिप्पणी विवरण
        </h3>
        {editable && !addingNewTippani && (
          <button
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
            onClick={openPageCountModal}
          >
            <MdAdd className="text-xl" />
            टिप्पणी थप्नुहोस्
          </button>
        )}
      </div>

      <div className="rounded-lg shadow-lg border border-gray-200 mb-4">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
                क्र.सं.
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">
                विषय
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                पेश गर्ने
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                पेश मिति
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                स्वीकृत गर्ने
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                स्वीकृत मिति
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">
                कैफियत
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                पाना संख्या
              </th>
              {editable && (
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-24">
                  कार्य
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(fileDetails.tippani) && fileDetails.tippani.length > 0 ? (
              fileDetails.tippani.map((tip, index) => (
                <React.Fragment key={`tippani-${tip.id || index}`}>
                  {/* Main Tippani Row */}
                  <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-yellow-50 transition-all duration-200 cursor-default`}>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-gray-900 font-medium">{index + 1}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="line-clamp-2 group-hover:line-clamp-none">
                        {tip.subject || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getTippaniValue(tip, 'submitted_by')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center text-gray-800">
                        <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                        {getTippaniValue(tip, 'submitted_date')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getTippaniValue(tip, 'approved_by')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center text-gray-800">
                        <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                        {getTippaniValue(tip, 'approved_date')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="line-clamp-2">{getTippaniValue(tip, 'remarks')}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-gray-900">{getTippaniValue(tip, 'page_no')}</span>
                    </td>
                    {editable && (
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => startAddingSubTippani(tip.id)}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                            title="उप-टिप्पणी थप्नुहोस्"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                          {(tip.sub_tippani && tip.sub_tippani.length > 0) && (
                            <button
                              onClick={() => toggleRowExpansion(tip.id)}
                              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                              title="उप-टिप्पणी देखाउनुहोस्/लुकाउनुहोस्"
                            >
                              {expandedRows.has(tip.id) ? (
                                <FaChevronDown className="text-xs" />
                              ) : (
                                <FaChevronRight className="text-xs" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* SubTippani Rows - Show when expanded or when adding new */}
                  {(expandedRows.has(tip.id) || addingSubTippani[tip.id]) && (
                    <>
                      {/* Existing SubTippani */}
                      {tip.sub_tippani && tip.sub_tippani.length > 0 && expandedRows.has(tip.id) && (
                        tip.sub_tippani.map((subTip, subIndex) => (
                          <tr key={`sub-tippani-${subTip.id || subIndex}`} className="bg-blue-50 border-l-4 border-blue-400">
                            <td className="px-4 py-3 text-sm">
                              <span className="text-blue-700 font-medium text-xs">
                                {index + 1}.{subIndex + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-blue-700 text-sm font-medium">उप-टिप्पणी</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-700">-</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-700">-</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-700">{subTip.approved_by || "N/A"}</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="flex items-center text-gray-700">
                                <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                                {subTip.approved_date || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-700">{subTip.remarks || "N/A"}</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="text-gray-700">-</span>
                            </td>
                            {editable && <td></td>}
                          </tr>
                        ))
                      )}

                      {/* Add New SubTippani Form */}
                      {addingSubTippani[tip.id] && (
                        <tr className="bg-green-50 border-l-4 border-green-400">
                          <td className="px-4 py-3 text-sm">
                            <span className="text-green-700 font-medium text-xs">
                              {index + 1}.{(tip.sub_tippani?.length || 0) + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="text-green-700 text-sm font-medium">नयाँ उप-टिप्पणी</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="text-gray-700">-</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="text-gray-700">-</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <input
                              type="text"
                              value={newSubTippani[tip.id]?.approved_by || ""}
                              onChange={(e) => handleSubTippaniChange(tip.id, "approved_by", e.target.value)}
                              placeholder="स्वीकृत गर्ने"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <DateInputField
                              name="approved_date"
                              value={newSubTippani[tip.id]?.approved_date || ""}
                              onChange={(e) => handleSubTippaniChange(tip.id, "approved_date", e.target.value)}
                              placeholder="स्वीकृत मिति"
                              primaryColor="green-500"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <textarea
                              value={newSubTippani[tip.id]?.remarks || ""}
                              onChange={(e) => handleSubTippaniChange(tip.id, "remarks", e.target.value)}
                              placeholder="कैफियत"
                              rows="2"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="text-gray-700">-</span>
                          </td>
                          {editable && (
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => saveSubTippani(tip.id)}
                                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                                  title="सुरक्षित गर्नुहोस्"
                                >
                                  <FaCheck className="text-xs" />
                                </button>
                                <button
                                  onClick={() => cancelAddingSubTippani(tip.id)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                                  title="रद्द गर्नुहोस्"
                                >
                                  <FaTimes className="text-xs" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            ) : !addingNewTippani ? (
              <tr className="bg-white">
                <td colSpan={editable ? "9" : "8"} className="px-4 py-3 text-center text-gray-500">
                  कुनै टिप्पणी उपलब्ध छैन
                </td>
              </tr>
            ) : null}

            {/* New Tippani Rows */}
            {addingNewTippani &&
              newTippaniRows.map((row, index) => (
                <tr
                  key={`new-tippani-${index}`}
                  className="bg-green-50 hover:bg-green-100 border-b border-gray-200"
                >
                  <td className="px-4 py-3 text-sm border-l-2 border-green-500">
                    <span className="text-gray-900 font-medium">
                      {(fileDetails.tippani ? fileDetails.tippani.length : 0) + index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                    <DateInputField
                      name="submitted_date"
                      value={row.submitted_date}
                      onChange={(e) => handleNewTippaniChange(e, "submitted_date", index)}
                      placeholder="पेश मिति"
                      primaryColor="orange-500"
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
                    <DateInputField
                      name="approved_date"
                      value={row.approved_date}
                      onChange={(e) => handleNewTippaniChange(e, "approved_date", index)}
                      placeholder="स्वीकृत मिति"
                      primaryColor="orange-500"
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
                      type="text"
                      value={row.page_no || ""}
                      onChange={(e) => handleNewTippaniChange(e, "page_no", index)}
                      placeholder="पाना संख्या"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    />
                  </td>
                  {editable && <td></td>}
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
            onClick={cancelAddingNewRows}
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

      {/* Page Count Modal */}
      <AnimatePresence>
        {isPageCountModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#E68332]">
                  टिप्पणी पृष्ठ संख्या
                </h3>
                <button
                  onClick={() => setIsPageCountModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  पृष्ठ संख्या प्रविष्ट गर्नुहोस्:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  कृपया थप्न चाहनुभएको टिप्पणी पृष्ठ संख्या प्रविष्ट गर्नुहोस्。
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TippaniTab;