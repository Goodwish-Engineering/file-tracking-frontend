import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NonTransferFile = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [nonTransferredFiles, setNonTransferredFiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToTransfer, setFileToTransfer] = useState(null);
  const [departments, setDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const departId = localStorage.getItem("depart_id");
      // console.log(departId);
      const filteredData = data.filter((file) => {
        const isTransferred = file.approvals?.some((approval) => approval.is_transferred);
        // const belongsToFilteredDepartment = file.related_department?.id == departId;
        // return !isTransferred && !belongsToFilteredDepartment;
        return !isTransferred;
      });
  
      setNonTransferredFiles(filteredData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  
  const fetchDepartments = async () => {
    const officeId = localStorage.getItem("officeid");
    console.log(officeId);
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/offices/${officeId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      if (response.data && response.data.departments) {
        setDepartments(response.data.departments); 
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTransferModal = (fileId) => {
    setFileToTransfer(fileId);
    setIsModalOpen(true);
    fetchDepartments();
  };

  const handleTransfer = async () => {
    if (!selectedDepartment) {
      alert("Please select a department");
      return;
    }
    
    setIsLoading(true);
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
            related_department: selectedDepartment,
          }),
        }
      );

      if (response.ok) {
        alert("File transferred successfully");
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error transferring file");
        console.error("Error transferring file:", response.statusText);
      }
    } catch (error) {
      console.error("Error transferring file:", error);
      alert("Failed to transfer file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${baseUrl}/files/${fileId}/disable/`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (response.ok) {
        // Update the UI by removing the deleted file
        setNonTransferredFiles(prevFiles => 
          prevFiles.filter(file => file.id !== fileId)
        );
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-bold text-[#E68332] mb-4">
        स्थानान्तरण नगरिएको फाइल
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full shadow-md rounded-lg border-none border-separate border-spacing-y-4">
          <thead className="text-gray-800">
            <tr className="border-none">
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">आईडी</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">फाइलको नाम </th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">फाइलको नम्बर</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">विषय</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">पेश गर्ने</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">पेश गरेको मिति</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">फाइल</th>
              <th className="p-3 text-center font-normal text-lg text-pretty border-none">कार्य</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file) => (
                <tr key={file.id} className={`text-black text-center my-4 gap-5 shadow-gray-100 text-nowrap border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg`}>
                  <td className="p-4 bg-gray-50 border-none rounded-l-xl">{file.id}</td>
                  <td className="p-4 bg-gray-50 border-none">{file.file_name}</td>
                  <td className="p-4 bg-gray-50 border-none">{file.file_number}</td>
                  <td className="p-4 bg-gray-50 border-none">{file.subject}</td>
                  <td className="p-4 bg-gray-50 border-none">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="p-4 bg-gray-50 border-none">{file.present_date}</td>
                  <td className="p-4 bg-gray-50 border-none  rounded-lg ">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="hover:text-white border-[#E68332] border-2 hover:bg-[#E68332] rounded-lg text-[#E68332] px-3 py-1 transition-all"
                    >
                      View More
                    </button>
                  </td>
                  <td className="p-4 gap-4 bg-gray-50 border-none rounded-r-xl flex items-center justify-center">
                    <button
                      onClick={() => handleOpenTransferModal(file.id)}
                      className="bg-[#B3F8CC] hover:bg-[#84be99] text-black px-3 py-1 rounded-lg transition-all"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-[#F8B3B3] hover:bg-[#be8484] text-black px-3 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-none">
                <td colSpan="8" className="p-4 text-center border-none text-gray-700">
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
              <label className="block">
                <span className="text-gray-700">Select Department:</span>
                <select
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  value={selectedDepartment}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={isLoading}
                >
                  <option value="">Select a Department</option>
                  {departments.length > 0 ? (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>{isLoading ? "Loading departments..." : "No departments available"}</option>
                  )}
                </select>
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedDepartment("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="bg-[#E68332] hover:bg-[#dd7a29] text-white px-4 py-2 rounded-lg"
                disabled={!selectedDepartment || isLoading}
              >
                {isLoading ? "Transferring..." : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonTransferFile;