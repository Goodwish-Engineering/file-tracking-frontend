import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegFileAlt, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const DocumentsTab = ({ editable, fileDetails, setFileDetails, baseUrl, token, id, fetchFileDetails }) => {
  // Local state
  const [addingNewDocuments, setAddingNewDocuments] = useState(false);
  const [newDocumentRows, setNewDocumentRows] = useState([]);
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
    setIsPageCountModalOpen(false);
  };

  // Handle changes to existing documents
  const handleChange = (e, field, index) => {
    const value = e.target.value;
    const updatedDocs = [...(fileDetails.letters_and_documents || [])];
    updatedDocs[index][field] = value;
    setFileDetails({ ...fileDetails, letters_and_documents: updatedDocs });
  };

  // Handle changes to new document rows
  const handleNewDocumentChange = (e, field, index) => {
    const value = e.target.value;
    setNewDocumentRows(prev => {
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
      
      const updatedDocuments = [...(fileDetails.letters_and_documents || []), ...newDocumentRows];
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ letters_and_documents: updatedDocuments }),
      });

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
            {Array.isArray(fileDetails.letters_and_documents) && fileDetails.letters_and_documents.length > 0 ? (
              fileDetails.letters_and_documents.map((doc, index) => (
                <tr
                  key={`existing-doc-${index}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <input
                        type="text"
                        value={doc.registration_no || ""}
                        onChange={(e) => handleChange(e, "registration_no", index)}
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
                        onChange={(e) => handleChange(e, "invoice_no", index)}
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
                        onChange={(e) => handleChange(e, "date", index)}
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
                        onChange={(e) => handleChange(e, "subject", index)}
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
                        onChange={(e) => handleChange(e, "letter_date", index)}
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
                        onChange={(e) => handleChange(e, "office", index)}
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
                        onChange={(e) => handleChange(e, "page_no", index)}
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

            {/* New Document Rows */}
            {addingNewDocuments &&
              newDocumentRows.map((row, index) => (
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
                <button onClick={() => setIsPageCountModalOpen(false)} className="text-gray-500 hover:text-gray-700">
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
