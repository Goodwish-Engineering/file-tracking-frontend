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
  updateTippani,
  handleNewTippaniChange,
  cancelAddingNewRows,
  saveNewTippani,
}) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Handle change for existing tippani
  const handleChange = (e, field, index) => {
    const value = e.target.value;
    const updatedTippani = [...tippani];
    updatedTippani[index][field] = value;
    updateTippani(updatedTippani);
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

      {/* Tippani Table */}
      <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 mb-4">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
            <tr>
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
                टिप्पणी मिति
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
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
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
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
                      <input
                        type="date"
                        value={tip.submitted_date || ""}
                        onChange={(e) => handleChange(e, "submitted_date", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
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
                      <input
                        type="date"
                        value={tip.approved_date || ""}
                        onChange={(e) => handleChange(e, "approved_date", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
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
                      <div className="line-clamp-2">
                        {tip.remarks || "N/A"}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editable ? (
                      <input
                        type="date"
                        value={tip.tippani_date || ""}
                        onChange={(e) => handleChange(e, "tippani_date", index)}
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
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
                      <span className="text-gray-900">{tip.page_no || "N/A"}</span>
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

            {/* New Tippani Rows for Adding */}
            {addingNewTippani &&
              newTippaniRows.map((row, index) => (
                <tr key={`new-tippani-${index}`} className="bg-green-50 hover:bg-green-100 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm border-l-2 border-green-500">
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
                    <input
                      type="date"
                      value={row.submitted_date || ""}
                      onChange={(e) => handleNewTippaniChange(e, "submitted_date", index)}
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
                    <input
                      type="date"
                      value={row.approved_date || ""}
                      onChange={(e) => handleNewTippaniChange(e, "approved_date", index)}
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
                      type="date"
                      value={row.tippani_date || ""}
                      onChange={(e) => handleNewTippaniChange(e, "tippani_date", index)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      value={row.page_no || ""}
                      onChange={(e) => handleNewTippaniChange(e, "page_no", index)}
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
