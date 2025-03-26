import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";

const FileHistory = () => {
  const [fileData, setFileData] = useState(null);
  const { id } = useParams();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const navigate = useNavigate();

  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    if (level === "5") {
      navigate("/admindashboard");
    } else {
      navigate("/employeeheader");
    }
  };

  useEffect(() => {
    fetchFileDetails();
  }, []);

  const fetchFileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/files/${id}/history/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setFileData(data);
      console.log("File History Data:", data);
    } catch (error) {
      console.error("Error fetching file history:", error);
    }
  };

  return (
    <div className="py-4 px-8 w-full md:w-[95%]">
      <div
        onClick={() => {
          handleNavigate();
        }}
        className="md:w-[10%] w-[28%] px-4 py-1 text-white font-semibold bg-[#E68332] cursor-pointer gap-2 rounded-md"
      >
        <div className="text-lg flex items-center gap-2">
          <IoMdArrowRoundBack /> Home
        </div>
      </div>
      {/* <h2 className="text-2xl text-[#E68332] font-normal">File History</h2> */}

      {fileData ? (
        <div className="">
          <div className="flex gap-8 items-center my-4">
            <p className="text-[#E68332] text-lg font-normal">
              फाइल नाम: {fileData.file_name}
            </p>
            <p className="text-[#E68332] text-lg font-normal">
              फाइल वर्तमान स्थान: {fileData.current_location}
            </p>
          </div>

          <h3 className="mt-3 text-[#E68332] text-xl font-semibold">History</h3>
          {fileData.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full shadow-md rounded-lg border-none border-separate border-spacing-y-4">
                <thead>
                  <tr className="border-none py-4">
                    <th className="border-none rounded-l-xl p-4 font-normal">
                      पठाउने व्यक्ति
                    </th>
                    <th className="border-none p-4 font-normal">
                      प्राप्तगर्ने व्यक्ति
                    </th>
                    <th className="border-none p-4 font-normal">स्थिति</th>
                    <th className="border-none p-4 font-normal">मिति</th>
                    <th className="border-none p-4 font-normal">
                      पठाएको लोकेशन
                    </th>
                    <th className="border-none rounded-r-xl p-4 font-normal">
                      प्राप्त गरेको लोकेशन
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.history.map((entry, index) => (
                    <tr
                      key={index}
                      className="text-center bg-gray-50 shadow-[4px_4px_5px_rgba(0,0,0,0.1)]"
                    >
                      <td className="border-none rounded-l-xl p-5">
                        {entry.sent_by}
                      </td>
                      <td className="border-none p-5">
                        {entry.received_by || "N/A"}
                      </td>
                      <td className="border-none p-5">{entry.status}</td>
                      <td className="border-none p-5">{entry.date || "N/A"}</td>
                      <td className="border-none p-5">
                        {entry.from_location || "N/A"}
                      </td>
                      <td className="border-none rounded-r-xl p-5">
                        {entry.to_location || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No history available.</p>
          )}
        </div>
      ) : (
        <p>Loading file history</p>
      )}
    </div>
  );
};

export default FileHistory;
