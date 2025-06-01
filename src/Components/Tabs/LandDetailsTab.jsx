import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

const LandDetailsTab = ({
  editable,
  landDetails = [],
  id,
  handleLandDetailChange,
  addLandDetail,
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
          <FaMapMarkerAlt className="mr-2" />
          जग्गा विवरण
        </h3>
        {editable && (
          <button
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-all flex items-center gap-2 shadow-sm"
            onClick={addLandDetail}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            नयाँ जग्गा विवरण थप्नुहोस्
          </button>
        )}
      </div>

      <div className="overflow-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-[#E68332] to-[#f0996a] text-white sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">
                जिल्ला
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                नगरपालिका
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                वार्ड नं
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                किट्टा नं
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-32">
                गुठी नाम
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                जग्गा प्रकार
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24 md:w-28">
                सम्बन्धित फाइल
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(landDetails) && landDetails.length > 0 ? (
              landDetails.map((detail, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-all duration-200 cursor-default`}
                >
                  <td className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-[#E68332] group">
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
            ) : (
              <tr className="bg-white">
                <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                  कुनै जग्गा विवरण उपलब्ध छैन
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LandDetailsTab;
