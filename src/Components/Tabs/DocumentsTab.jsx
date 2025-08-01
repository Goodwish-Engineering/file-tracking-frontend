import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegFileAlt, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import DateInputField from "../Common/DateInputField";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";

const DocumentsTab = ({
  editable,
  fileDetails,
  setFileDetails,
  baseUrl,
  token,
  id,
  fetchFileDetails,
}) => {
  // Local state
  const [addingNewDocuments, setAddingNewDocuments] = useState(false);
  const [newDocumentRows, setNewDocumentRows] = useState([]);
  const [isPageCountModalOpen, setIsPageCountModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [dateFilter, setDateFilter] = useState(""); // State for date filtering

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);
  };

  const renderIcon = () => {
    if (selectedOption === "दर्ता नं") {
      return <FaArrowDown className="text-green-500 text-2xl" />;
    } else if (selectedOption === "चलानी नं") {
      return <FaArrowUp className="text-red-500 text-2xl" />;
    }
    return null;
  };

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
      .map((_, index) => ({
        number_type: "",
        number: "",
        date: "",
        subject: "",
        office: "",
        main_department: "",
        department: "",
        letter_date: "",
        chalani_number: "",
        page_no: "1",
        extra_date: "",
        extra_number: "",
        submitted_by: "",
        remarks: "",
        related_file: id,
      }));

    setNewDocumentRows(newRows);
    setAddingNewDocuments(true);
    setIsPageCountModalOpen(false);
  };

  // Handle changes to new document rows
  const handleNewDocumentChange = (e, field, index) => {
    const value = e.target.value;
    setNewDocumentRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Cancel adding new documents
  const cancelAddingNewRows = () => {
    setNewDocumentRows([]);
    setAddingNewDocuments(false);
  };

  // Save new documents
  const saveNewDocuments = async () => {
    try {
      // Validate required fields
      for (const row of newDocumentRows) {
        if (!row.subject) {
          toast.error("विषय फील्ड आवश्यक छ।");
          return;
        }
      }
      console.log("request:", newDocumentRows);
      const response = await fetch(`${baseUrl}/letters-and-documents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(newDocumentRows),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      await fetchFileDetails();
      setNewDocumentRows([]);
      setAddingNewDocuments(false);
      toast.success("कागजात सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding new documents:", error);
      toast.error(`कागजात थप्न असफल: ${error.message}`);
    }
  };

  // Handle date filter change with proper formatting
  const handleDateFilterChange = (e) => {
    const { value } = e.target;
    setDateFilter(value);

    // Actual filtering will be done in the render section
  };

  // Get filtered documents based on date filter
  const getFilteredDocuments = () => {
    if (!dateFilter) {
      return fileDetails.letters_and_documents;
    }

    return fileDetails.letters_and_documents.filter(
      (doc) => doc.created_at && doc.created_at.includes(dateFilter)
    );
  };

  const getArrowIcon = (numberType) => {
    if (numberType === "दर्ता नं") {
      return <FaArrowDown className="text-green-500 text-2xl" />;
    } else if (numberType === "चलानी नं") {
      return <FaArrowUp className="text-red-500 text-2xl" />;
    } else { 
      return null;
    }
  };

  const filteredDocuments = getFilteredDocuments();

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
          <FaRegFileAlt className="mr-2" />
          पत्रहरू र कागजातहरू
        </h3>
        {editable && !addingNewDocuments && (
          <button
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
            onClick={openPageCountModal}
          >
            <MdAdd className="text-xl" />
            कागजात थप्नुहोस्
          </button>
        )}
      </div>

      <div className=" rounded-lg shadow-lg border border-gray-200 mb-4 w-full">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16"
                >
                  क्र.सं.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  दर्ता नं/चलानी नं
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  नं
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  मिति
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  विषय
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  कार्यालय
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  महाशाखा
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  शाखा
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  पत्रको मिति
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  चलानी नं.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  पाना संख्या
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  मूल दर्ता / चलानी नं र मिति
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  तोक आदेश दिने अधिकारी
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  कैफियत
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Existing Document Rows */}
              {Array.isArray(filteredDocuments) &&
              filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <tr
                    key={`existing-doc-${index}`}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <span className="text-gray-900 font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.number_type || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.number || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center text-gray-800">
                        <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                        {doc.date || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="line-clamp-2 hover:line-clamp-none">
                        {doc.subject || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.office || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.main_department || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.department || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center text-gray-800">
                        <FaCalendarAlt className="h-3 w-3 mr-1 text-gray-500" />
                        {doc.letter_date || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.chalani_number || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.page_no || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {`${doc.extra_number} / ${doc.extra_date}` || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.submitted_by || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {doc.remarks || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getArrowIcon(doc.number_type)}
                    </td>
                  </tr>
                ))
              ) : !addingNewDocuments ? (
                <tr className="bg-white">
                  <td
                    colSpan="7"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    कुनै कागजात उपलब्ध छैन
                  </td>
                </tr>
              ) : null}

              {/* New Document Rows */}
              {addingNewDocuments &&
                newDocumentRows.map((row, index) => (
                  <tr
                    key={`new-doc-${index}`}
                    className="bg-green-50 hover:bg-green-100 border-b border-gray-200"
                  >
                    <td className="px-4 py-3 text-sm border-l-2 border-green-500">
                      <span className="text-gray-900 font-medium">
                        {(filteredDocuments ? filteredDocuments.length : 0) +
                          index +
                          1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={row.number_type || ""}
                        onChange={(e) => {
                          handleNewDocumentChange(e, "number_type", index);
                          handleSelect(e);
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      >
                        <option value="">-- चयन गर्नुहोस् --</option>
                        <option value="दर्ता नं">दर्ता नं</option>
                        <option value="चलानी नं">चलानी नं</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        value={row.number || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "number", index)
                        }
                        placeholder="दर्ता नं/चलानी नं"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <DateInputField
                        name="date"
                        value={row.date}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "date", index)
                        }
                        placeholder="मिति"
                        primaryColor="blue-500"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="subject"
                        value={row.subject || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "subject", index)
                        }
                        placeholder="विषय"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="office"
                        value={row.office || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "office", index)
                        }
                        placeholder="कार्यालय"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="main_department"
                        value={row.main_department || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "main_department", index)
                        }
                        placeholder="महाशाखा"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="department"
                        value={row.department || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "department", index)
                        }
                        placeholder="शाखा"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <DateInputField
                        name="letter_date"
                        value={row.letter_date}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "letter_date", index)
                        }
                        placeholder="पत्र मिति"
                        primaryColor="blue-500"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        name="chalani_number"
                        value={row.chalani_number || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "chalani_number", index)
                        }
                        placeholder="चलानी नं"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        name="page_no"
                        value={row.page_no || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "page_no", index)
                        }
                        placeholder="पाना संख्या"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        name="extra_number"
                        value={row.extra_number || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "extra_number", index)
                        }
                        placeholder="मूल दर्ता/चलानी नं"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                      <DateInputField
                        name="extra_date"
                        value={row.extra_date || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "extra_date", index)
                        }
                        placeholder="मिति"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="submitted_by"
                        value={row.submitted_by || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "submitted_by", index)
                        }
                        placeholder="तोक आदेश दिने अधिकारी"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="text"
                        name="remarks"
                        value={row.remarks || ""}
                        onChange={(e) =>
                          handleNewDocumentChange(e, "remarks", index)
                        }
                        placeholder="कैफियत"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{renderIcon()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save/Cancel buttons for new documents */}
      {addingNewDocuments && (
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
            onClick={saveNewDocuments}
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
                  कागजात पृष्ठ संख्या
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
                  कृपया थप्न चाहनुभएको कागजात पृष्ठ संख्या प्रविष्ट गर्नुहोस्。
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

export default DocumentsTab;
