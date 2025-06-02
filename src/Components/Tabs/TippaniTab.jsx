import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegClipboard,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

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

  // Animation variant
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        tippani_date: "",
        page_no: "",
      }));

    setNewTippaniRows(newRows);
    setAddingNewTippani(true);
    setIsPageCountModalOpen(false);
  };

  // Handle changes to existing tippani
  const handleChange = (e, field, index) => {
    const value = e.target.value;
    const updatedTippani = [...(fileDetails.tippani || [])];
    updatedTippani[index][field] = value;
    setFileDetails({ ...fileDetails, tippani: updatedTippani });
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

      const updatedTippani = [
        ...(fileDetails.tippani || []),
        ...newTippaniRows,
      ];
      console.log("request:", updatedTippani);
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ updatedTippani }),
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
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32"
              >
                विषय
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28"
              >
                पेश गर्ने
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28"
              >
                पेश मिति
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28"
              >
                स्वीकृत गर्ने
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28"
              >
                स्वीकृत मिति
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32"
              >
                कैफियत
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28"
              >
                टिप्पणी मिति
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16"
              >
                पृष्ठ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(fileDetails.tippani) &&
            fileDetails.tippani.length > 0 ? (
              fileDetails.tippani.map((tip, index) => (
                <tr
                  key={`existing-tippani-${index}`}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <input
                        type="text"
                        value={tip.subject || ""}
                        onChange={(e) => handleChange(e, "subject", index)}
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
                        onChange={(e) => handleChange(e, "submitted_by", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    ) : (
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
                        {tip.submitted_by || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <NepaliDatePicker
                        inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        value={tip.submitted_date}
                        onSelect={(value) => {
                          const e = { target: { value: value } };
                          handleChange(e, "submitted_date", index);
                        }}
                        className="w-full"
                        options={{ calenderLocale: "ne", valueLocale: "bs" }}
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
                        onChange={(e) => handleChange(e, "approved_by", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    ) : (
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
                        {tip.approved_by || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <NepaliDatePicker
                        inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        value={tip.approved_date}
                        onSelect={(value) => {
                          const e = { target: { value: value } };
                          handleChange(e, "approved_date", index);
                        }}
                        className="w-full"
                        options={{ calenderLocale: "ne", valueLocale: "bs" }}
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
                        onChange={(e) => handleChange(e, "remarks", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    ) : (
                      <div className="line-clamp-2">{tip.remarks || "N/A"}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <NepaliDatePicker
                        inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        value={tip.tippani_date}
                        onSelect={(value) => {
                          const e = { target: { value: value } };
                          handleChange(e, "tippani_date", index);
                        }}
                        className="w-full"
                        options={{ calenderLocale: "ne", valueLocale: "bs" }}
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
                        onChange={(e) => handleChange(e, "page_no", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">
                        {tip.page_no || "N/A"}
                      </span>
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

            {/* New Tippani Rows */}
            {addingNewTippani &&
              newTippaniRows.map((row, index) => (
                <tr
                  key={`new-tippani-${index}`}
                  className="bg-green-50 hover:bg-green-100 border-b border-gray-200"
                >
                  <td className="px-4 py-3 text-sm border-l-2 border-green-500">
                    <input
                      type="text"
                      value={row.subject || ""}
                      onChange={(e) =>
                        handleNewTippaniChange(e, "subject", index)
                      }
                      placeholder="विषय"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      required
                    />
                  </td>
                  {/* Remaining fields */}
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={row.submitted_by || ""}
                      onChange={(e) =>
                        handleNewTippaniChange(e, "submitted_by", index)
                      }
                      placeholder="पेश गर्ने"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <NepaliDatePicker
                      inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      value={row.submitted_date}
                      onSelect={(value) => {
                        const e = { target: { value: value } };
                        handleNewTippaniChange(e, "submitted_date", index);
                      }}
                      className="w-full"
                      options={{ calenderLocale: "ne", valueLocale: "bs" }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={row.approved_by || ""}
                      onChange={(e) =>
                        handleNewTippaniChange(e, "approved_by", index)
                      }
                      placeholder="स्वीकृत गर्ने"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <NepaliDatePicker
                      inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      value={row.approved_date}
                      onSelect={(value) => {
                        const e = { target: { value: value } };
                        handleNewTippaniChange(e, "approved_date", index);
                      }}
                      className="w-full"
                      options={{ calenderLocale: "ne", valueLocale: "bs" }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={row.remarks || ""}
                      onChange={(e) =>
                        handleNewTippaniChange(e, "remarks", index)
                      }
                      placeholder="कैफियत"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <NepaliDatePicker
                      inputClassName="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      value={row.tippani_date}
                      onSelect={(value) => {
                        const e = { target: { value: value } };
                        handleNewTippaniChange(e, "tippani_date", index);
                      }}
                      className="w-full"
                      options={{ calenderLocale: "ne", valueLocale: "bs" }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      value={row.page_no || ""}
                      onChange={(e) =>
                        handleNewTippaniChange(e, "page_no", index)
                      }
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
