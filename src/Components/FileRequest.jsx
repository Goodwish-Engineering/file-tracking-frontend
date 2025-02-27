import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FileRequest = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [fileToAccept, setFileToAccept] = useState(null);
  const [remarks, setRemarks] = useState("");
  const token = localStorage.getItem("token");
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
      setAdmins(data);
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

      // Exclude files where is_transferred and is_approved are both true
      const filteredData = data.filter(
        (file) => !(file.is_transferred || file.is_approved)
      );

      setNonTransferredFiles(filteredData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAdmin) {
      alert("Please select an admin to transfer the file.");
      return;
    }
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
        setIsModalOpen(false);
        fetchData();
      } else {
        console.error("Error transferring file:", response.statusText);
      }
    } catch (error) {
      console.error("Error transferring file:", error);
    }
  };

  const handleAccept = async () => {
    const approvedDate = new Date().toISOString().split("T")[0]; // Extracts only YYYY-MM-DD

    try {
      const response = await fetch(`${baseUrl}/files/${fileToAccept}/accept/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          remarks,
          approved_date: approvedDate,
        }),
      });

      if (response.ok) {
        setIsAcceptModalOpen(false);
        fetchData();
      } else {
        console.error("Error accepting file:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting file:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">File Request</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-none shadow-md bg-white rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr className="border-white border-b-2 rounded-md">
              <th className="p-3 text-center border-none">ID</th>
              <th className="p-3 text-center border-none">File Name</th>
              <th className="p-3 text-center border-none">Subject</th>
              <th className="p-3 text-center border-none">Presented By</th>
              <th className="p-3 text-center border-none">Presented Date</th>
              <th className="p-3 text-center border-none">File</th>
              <th className="p-3 text-center border-none">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file) => (
                <tr key={file.id} className="border-b-2 border-gray-300 hover:bg-orange-100 text-center">
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
                  <td className="p-3 flex gap-2 border-none items-center justify-center">
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
                      onClick={() => {
                        setFileToAccept(file.id);
                        setIsAcceptModalOpen(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-all"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-600">
                  No File Requests Till Now 
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
      {isAcceptModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Accept File</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileRequest;
