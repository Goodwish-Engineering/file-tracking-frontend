import React from "react";
import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import { FileHistoryTimeline } from "../FileHistory";

const FileHistoryTab = ({ fileHistory = [] }) => {
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
      <h3 className="text-xl font-bold text-[#E68332] mb-4 flex items-center">
        <FaHistory className="mr-2" />
        फाइल इतिहास
      </h3>

      {fileHistory.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          कुनै इतिहास उपलब्ध छैन
        </p>
      ) : (
        <FileHistoryTimeline data={fileHistory} className="mt-4" />
      )}
    </motion.div>
  );
};

export default FileHistoryTab;
