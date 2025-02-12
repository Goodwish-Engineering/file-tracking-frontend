import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NonTransferFile = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();

      // Filter only non-transferred files
      const filteredData = data.filter((item) => item.approvals.length === 0);
      setNonTransferredFiles(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        Non-Transferred Files
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md bg-white rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">File Name</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Presented By</th>
              <th className="p-3 text-left">Presented Date</th>
              <th className="p-3 text-left">File</th>
            </tr>
          </thead>
          <tbody>
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-orange-100">
                  <td className="p-3">{file.id}</td>
                  <td className="p-3">{file.file_name}</td>
                  <td className="p-3">{file.subject}</td>
                  <td className="p-3">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="p-3">{file.present_date}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition-all"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  No non-transferred files available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonTransferFile;
