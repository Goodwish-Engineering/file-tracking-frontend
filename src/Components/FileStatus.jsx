import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FileStatus = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [fileStatuses, setFileStatuses] = useState([]);
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

      // Filter out files where approvals exist and are transferred
      const filteredData = data.filter(
        (file) =>
          file.approvals.length > 0 &&
          file.approvals.some((approval) => approval.transferred_to !== null)
      );
      setFileStatuses(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">File Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md bg-white rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">File No</th>
              <th className="p-3 text-left">File Name</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Pages</th>
              <th className="p-3 text-left">Submitted By</th>
              <th className="p-3 text-left">Transferred To</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Remarks</th>
              <th className="p-3 text-left">Approved Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {fileStatuses.length > 0 ? (
              fileStatuses.map((file) =>
                file.approvals.map((approval) => (
                  <tr
                    key={approval.id}
                    className="border-b hover:bg-orange-100"
                  >
                    <td className="p-3">{file.id}</td>
                    <td className="p-3">{file.file_number}</td>
                    <td className="p-3">{file.file_name}</td>
                    <td className="p-3">{file.subject}</td>
                    <td className="p-3">
                      {file.page_no}/{file.total_page}
                    </td>
                    <td className="p-3">
                      {approval.submitted_by
                        ? `${approval.submitted_by.first_name} ${approval.submitted_by.last_name}`
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {approval.transferred_to
                        ? `${approval.transferred_to.first_name} ${approval.transferred_to.last_name}`
                        : "N/A"}
                    </td>
                    <td className="p-3 font-medium text-orange-600">
                      {approval.status}
                    </td>
                    <td className="p-3">{approval.remarks ?? "N/A"}</td>
                    <td className="p-3">{approval.approved_date ?? "N/A"}</td>
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
              )
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-600">
                  No transferred files available.
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
