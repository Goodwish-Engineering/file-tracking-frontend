import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NonTransferFile = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const token = localStorage.getItem("token");
  const Empid = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${baseUrl}/users/dropdown/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();

      setAdmins(data); // Set the fetched admin data
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter(
        (file) => !(file.is_transferred || file.is_approved)
      );
      setNonTransferredFiles(filteredData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleTransfer = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/files/${fileToTransfer}/transfer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            transferred_to: selectedAdmin,
          }),
        }
      );

      if (response.ok) {
        // File transfer successful, close modal and refetch data
        setIsModalOpen(false);
        fetchData();
      } else {
        console.error("Error transferring file:", response.statusText);
      }
    } catch (error) {
      console.error("Error transferring file:", error);
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`${baseUrl}/file/${fileId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setFileStatuses((prevStatuses) =>
        prevStatuses.filter((file) => file.id !== fileId)
      );
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        Non-Transferred Files
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full shadow-md bg-white rounded-lg border-none">
          <thead className="bg-orange-500 text-white">
            <tr className="border border-b-2 border-white">
              <th className="p-3 text-center font-mono text-pretty border-none">ID</th>
              <th className="p-3 text-center font-mono text-pretty border-none">File Name</th>
              <th className="p-3 text-center font-mono text-pretty border-none">Subject</th>
              <th className="p-3 text-center font-mono text-pretty border-none">Presented By</th>
              <th className="p-3 text-center font-mono text-pretty border-none">Presented Date</th>
              <th className="p-3 text-center font-mono text-pretty border-none">File</th>
              <th className="p-3 text-center font-mono text-pretty border-none">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file,index) => (
                <tr key={file.id} className={`hover:bg-orange-100 text-gray-700 text-center text-nowrap border-t-2 border-b-2`}>
                  <td className="p-3 border-none">{file.id}</td>
                  <td className="p-3 border-none">{file.file_name}</td>
                  <td className="p-3 border-none">{file.subject}</td>
                  <td className="p-3 border-none">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="p-3 border-none">{file.present_date}</td>
                  <td className="p-3 border-none">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition-all"
                    >
                      View More
                    </button>
                  </td>
                  <td className="p-3 gap-3 border-none flex items-center justify-center">
                    <button
                      onClick={() => {
                        setFileToTransfer(file.id);
                        setIsModalOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-all"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-none">
                <td colSpan="7" className="p-4 text-center border-none text-gray-700">
                  No non-transferred files available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Transfer File</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Admin
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setSelectedAdmin(e.target.value)}
                value={selectedAdmin || ""}
              >
                <option value="">Select Admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.first_name} {admin.last_name} ({admin.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonTransferFile;
