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
          className="p-2 border rounded-lg border-orange-700 outline-orange-700 w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md bg-white rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">File No</th>
              <th className="p-3 text-left">File Name</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Days Submitted</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-orange-100">
                  <td className="p-3">{file.id}</td>
                  <td className="p-3">{file.file_number}</td>
                  <td className="p-3">{file.file_name}</td>
                  <td className="p-3">{file.subject}</td>
                  <td className="p-3">{file.days_submitted}</td>
                  <td className="p-3 flex gap-2">
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
