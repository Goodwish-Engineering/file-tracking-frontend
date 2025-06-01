import React from "react";
import { motion } from "framer-motion";
import { FaRegClipboard, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const TippaniTab = ({
  editable,
  addingNewTippani,
  tippani = [],
  newTippaniRows = [],
  openPageCountModal,
  handleChange,
  handleNewTippaniChange,
  cancelAddingNewRows,
  saveNewTippani,
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
          <FaRegClipboard className="mr-2" />
          टिप्पणी विवरण
        </h3>
        {editable && !addingNewTippani && (
          <button
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
            onClick={() => openPageCountModal("tippani")}
          >
            <MdAdd className="text-xl" />
            टिप्पणी थप्नुहोस्
          </button>
        )}
      </div>

      <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 mb-4">
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
            {/* Existing Tippani Rows */}
            {Array.isArray(tippani) && tippani.length > 0 ? (
              tippani.map((tip, index) => (
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
                        onChange={(e) =>
                          handleChange(e, "subject", index, "tippani")
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                      />
                    ) : (
                      <div className="line-clamp-2 group-hover:line-clamp-none">
                        {tip.subject || "N/A"}
                      </div>
                    )}
                  </td>
                  {/* ...remaining cells (submitted_by, dates, etc.) */}
                  {/* Keep the same structure as in the original code */}
                </tr>
              ))
            ) : !addingNewTippani ? (
              <tr className="bg-white">
                <td
                  colSpan="8"
                  className="px-4 py-3 text-center text-gray-500"
                >
                  कुनै टिप्पणी उपलब्ध छैन
                </td>
              </tr>
            ) : null}

            {/* New Tippani Rows for Adding */}
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
                  {/* ...remaining input fields */}
                  {/* Keep the same structure as in the original code */}
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
            onClick={() => cancelAddingNewRows("tippani")}
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
    </motion.div>
  );
};

export default TippaniTab;
