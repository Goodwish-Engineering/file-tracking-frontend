import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TransferedFile = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [TransferedFiles, setTransferedFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const token = localStorage.getItem("token");
  const Empid = localStorage.getItem("token");
  const [deparetments, setDepartments] = useState([]);

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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
  
      const data = await response.json();
  
      // Filtering only files where at least one approval has is_transferred: true
      const filteredData = data.filter(
        (file) =>
          file.approvals && file.approvals.some((approval) => approval.is_transferred)
      );
  
      setTransferedFiles(filteredData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(`${baseUrl}/file/`, {
  //       headers: {
  //         Authorization: `token ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  
  //     const filteredData = data.filter((file) => {
  //       const isTransferred = file.approvals?.some((approval) => approval.is_transferred);
  //       return isTransferred;
  //     });
  
  //     setTransferedFiles(filteredData);
  //   } catch (error) {
  //     console.error("Error fetching files:", error);
  //   }
  // };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${baseUrl}/files/${fileId}/disable/`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
  
      setTransferedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };  

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-bold text-[#E68332] mb-4">
        स्थानान्तरण गरिएको फाइल
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full shadow-md rounded-lg border-none border-separate border-spacing-y-4">
          <thead className="text-gray-800">
            <tr className="border">
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">आईडी</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">फाइलको नाम</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">विषय</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">पेश गर्ने</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">पेश गरेको मिति</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">फाइल</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">कार्य</th>
            </tr>
          </thead>
          <tbody>
            {TransferedFiles.length > 0 ? (
              TransferedFiles.map((file,index) => (
                <tr key={file.id} className={`text-black text-center text-nowrap border-t-2 border-b-2 my-4 gap-5 shadow-gray-100 border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg`}>
                  <td className="p-4 bg-gray-50 border-none">{file.id}</td>
                  <td className="p-4 bg-gray-50 border-none">{file.file_name}</td>
                  <td className="p-4 bg-gray-50 border-none">{file.subject}</td>
                  <td className="p-4 bg-gray-50 border-none">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="p-4 bg-gray-50 border-none">{file.present_date}</td>
                  <td className="p-4 bg-gray-50 border-none">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="text-[#E68332] border-[#E68332] border-2 rounded-lg hover:bg-[#E68332] hover:text-white px-3 py-1 transition-all"
                    >
                      View More
                    </button>
                  </td>
                  <td className="p-4 bg-gray-50 gap-3 border-none flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-[#F8B3B3] hover:bg-[#de7373] text-black px-3 py-1 rounded-lg transition-all"
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
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
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

export default TransferedFile;
