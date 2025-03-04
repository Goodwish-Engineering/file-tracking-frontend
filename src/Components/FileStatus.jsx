import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FileStatus = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      setFileStatuses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredFiles = fileStatuses.filter((file) =>
    searchQuery
      .toLowerCase()
      .split(" ")
      .every((query) =>
        [
          file.file_name.toLowerCase(),
          file.subject.toLowerCase(),
          String(file.id),
          String(file.file_number),
        ].some((field) => field.includes(query))
      )
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by ID, File No, Name, or Subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg focus:border-blue-600 w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full shadow-md bg-white rounded-lg border-none">
          <thead className="bg-[#3F84E5] border border-b-2 border-white text-white">
            <tr className="border border-white border-t-2 border-b-2">
              <th className="p-3 text-center border-none text-nowrap font-mono">
                ID
              </th>
              <th className="p-3 text-center border-none text-nowrap font-mono">
                File No
              </th>
              <th className="p-3 text-center border-none text-nowrap font-mono">
                File Name
              </th>
              <th className="p-3 text-center border-none text-nowrap font-mono">
                Subject
              </th>
              <th className="p-3 text-center border-none text-nowrap font-mono">
                Days Submitted
              </th>
              <th className="p-3 text-center border-none text-nowrap font-mono">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <tr
                  key={file.id}
                  className={`hover:bg-gray-50 text-gray-700 text-center text-nowrap border-t-2 border-b-2`}
                >
                  <td className="p-3 border-none">
                    {file.id}
                  </td>
                  <td className="p-3 border-none">{file.file_number}</td>
                  <td className="p-3 border-none">{file.file_name}</td>
                  <td className="p-3 border-none">{file.subject}</td>
                  <td className="p-3 border-none">{file.days_submitted}</td>
                  <td className="p-3 border-none flex justify-center items-center">
                      <button
                        onClick={() => navigate(`/file-details/${file.id}`)}
                        className="bg-[#3F84E5] hover:bg-[#3571C5] text-white px-3 py-1 rounded-lg transition-all"
                      >
                        View More
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-none border-t-0 border-b-2 border-white">
                <td colSpan="6" className="p-4 text-center text-gray-600 border-none border-b-2">
                  No files available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileStatus;
