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
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                दर्ता नं
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                चलानी नं
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
                पत्र मिति
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
                पृष्ठ संख्या
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Existing Document Rows */}
            {Array.isArray(letters_and_documents) && letters_and_documents.length > 0 ? (
              letters_and_documents.map((doc, index) => (
                <tr
                  key={`existing-doc-${index}`}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  {/* Document cells (registration_no, invoice_no, etc.) */}
                  {/* Keep the same structure as in the original code */}
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

            {/* New Document Rows for Adding */}
            {addingNewDocuments &&
              newDocumentRows.map((row, index) => (
                <tr
                  key={`new-doc-${index}`}
                  className="bg-green-50 hover:bg-green-100 border-b border-gray-200"
                >
                  {/* New document input fields */}
                  {/* Keep the same structure as in the original code */}
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
