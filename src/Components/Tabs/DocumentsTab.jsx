import React from "react";
import { motion } from "framer-motion";
import { FaRegFileAlt, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const DocumentsTab = ({
  editable,
  addingNewDocuments,
  letters_and_documents = [],
  newDocumentRows = [],
  openPageCountModal,
  handleChange,
  handleNewDocumentChange,
  cancelAddingNewRows,
  saveNewDocuments,
}) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            onClick={() => openPageCountModal("document")}
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
            {Array.isArray(letters_and_documents) && letters_and_documents.length > 0 ? (
              letters_and_documents.map((doc, index) => (
                <tr
                  key={`existing-doc-${index}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <input
                        type="text"
                        value={doc.registration_no || ""}
                        onChange={(e) => handleChange(e, "registration_no", index, "document")}
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
                        onChange={(e) => handleChange(e, "invoice_no", index, "document")}
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
                        onChange={(e) => handleChange(e, "date", index, "document")}
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
                        onChange={(e) => handleChange(e, "subject", index, "document")}
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
                        onChange={(e) => handleChange(e, "letter_date", index, "document")}
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
                        onChange={(e) => handleChange(e, "office", index, "document")}
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
                        onChange={(e) => handleChange(e, "page_no", index, "document")}
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

            {/* New Document Rows for Adding */}
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
            onClick={() => cancelAddingNewRows("document")}
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
    </motion.div>
  );
};

export default DocumentsTab;
