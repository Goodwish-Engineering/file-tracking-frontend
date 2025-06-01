import React from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaMapMarkerAlt,
  FaRegClock,
  FaRegFilePdf
} from "react-icons/fa";

const FileInfoTab = ({ fileDetails }) => {
  const {
    file_name = "",
    subject = "",
    file = "",
    present_date = "",
    days_submitted = "",
    total_tippani_pages = "",
    total_documents_pages = "",
    total_page_count = "",
    province = "",
    district = "",
    municipality = "",
    ward_no = "",
    tole = "",
  } = fileDetails || {};

  // Safely extract nested object properties
  const related_guthi_name = fileDetails?.related_guthi?.name || "N/A";
  const related_department_name = fileDetails?.related_department?.name || "N/A";
  const submitted_by_name = fileDetails?.submitted_by || "N/A";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-[#E68332] hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-[#E68332] mb-4 flex items-center">
            <FaFileAlt className="mr-2" />
            मूल विवरण
          </h3>
          <div className="space-y-4">
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">फाइल नाम:</span>
              <span className="text-gray-900">{file_name}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">विषय:</span>
              <span className="text-gray-900">{subject}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">सम्बन्धित गुठी:</span>
              <span className="text-gray-900">{related_guthi_name}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">सम्बन्धित विभाग:</span>
              <span className="text-gray-900">{related_department_name}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            स्थान विवरण
          </h3>
          <div className="space-y-4">
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">प्रदेश:</span>
              <span className="text-gray-900">{province}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">जिल्ला:</span>
              <span className="text-gray-900">{district}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">नगरपालिका/गाउँपालिका:</span>
              <span className="text-gray-900">{municipality}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">वार्ड नं:</span>
              <span className="text-gray-900">{ward_no}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">स्थानीय नाम:</span>
              <span className="text-gray-900">{tole}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
            <FaRegClock className="mr-2" />
            पेश विवरण
          </h3>
          <div className="space-y-4">
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">प्रस्तुत मिति:</span>
              <span className="text-gray-900">{present_date}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">पेश गर्ने:</span>
              <span className="text-gray-900">{submitted_by_name}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">पेश भएका दिनहरू:</span>
              <span className="text-gray-900">{days_submitted}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center">
            <FaRegFilePdf className="mr-2" />
            पृष्ठ विवरण
          </h3>
          <div className="space-y-4">
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">कुल टिप्पणी पृष्ठहरू:</span>
              <span className="text-gray-900">{total_tippani_pages}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">कुल कागजात पृष्ठहरू:</span>
              <span className="text-gray-900">{total_documents_pages}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">कुल पृष्ठ संख्या:</span>
              <span className="text-gray-900">{total_page_count || "उपलब्ध छैन"}</span>
            </p>
            <p className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-700">फाइल:</span>
              <span className="text-gray-900">{file || "उपलब्ध छैन"}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileInfoTab;
