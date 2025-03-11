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
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">File Request</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-none border-separate border-spacing-y-4">
          <thead className="text-gray-800">
            <tr className=" rounded-md">
              <th className="p-3 text-center font-normal border-none">ID</th>
              <th className="p-3 text-center font-normal border-none">File Name</th>
              <th className="p-3 text-center font-normal border-none">Subject</th>
              <th className="p-3 text-center font-normal border-none">Presented By</th>
              <th className="p-3 text-center font-normal border-none">Presented Date</th>
              <th className="p-3 text-center font-normal border-none">File</th>
              <th className="p-3 text-center font-normal border-none">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file) => (
                <tr key={file.id} className="text-gray-900 text-center my-4 gap-5 shadow-gray-100 text-nowrap border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg">
                  <td className="py-4 px-4 border-none bg-gray-50 rounded-l-xl">{file.id}</td>
                  <td className="px-4 py-4 border-none bg-gray-50">{file.file_name}</td>
                  <td className="px-4 py-4 border-none bg-gray-50">{file.subject}</td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="px-4 py-4 border-none bg-gray-50">{file.present_date}</td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="border-[#E68332] border-2 hover:bg-[#E68332] hover:text-white text-[#E68332] px-3 py-1 rounded-lg transition-all"
                    >
                      View More
                    </button>
                  </td>
                  <td className="px-4 py-4 gap-2 border-none bg-gray-50 flex justify-center items-center rounded-r-xl">
                    <button
                      onClick={() => {
                        setFileToTransfer(file.id);
                        setIsModalOpen(true);
                      }}
                      className="bg-[#B3F8CC] hover:bg-[#84be99] text-black px-3 py-1 rounded-lg transition-all"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => {
                        setFileToAccept(file.id);
                        setIsAcceptModalOpen(true);
                      }}
                      className="bg-[#b3c9f8] hover:bg-[#8a9fcb] text-black px-3 py-1 rounded-lg transition-all"
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
