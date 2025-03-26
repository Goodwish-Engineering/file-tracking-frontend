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
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const level = localStorage.getItem("level");
  const officeId = localStorage.getItem("officeid");

  useEffect(() => {
    fetchData();
    fetchAdmins();
    fetchOffices();
    
    // For level 2 users, fetch departments for their office immediately
    if (level === "2" && officeId) {
      fetchDepartments(officeId);
    }
  }, [level, officeId]);

  // Reset department when office changes (for non-level 2 users)
  useEffect(() => {
    if (level !== "2") {
      setSelectedDepartment("");
      if (selectedOffice) {
        fetchDepartments(selectedOffice);
      } else {
        setDepartments([]);
      }
    }
  }, [selectedOffice, level]);

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

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error("Error fetching offices:", error);
      setOffices([]);
    }
  };

  const fetchDepartments = async (officeId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/offices/${officeId}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      // For level 2 users, filter out office departments
      let departmentsToSet = data.departments || [];
      if (level === "2") {
        departmentsToSet = departmentsToSet.filter(
          department => department.type !== "office"
        );
      }
      
      setDepartments(departmentsToSet);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTransferModal = (fileId) => {
    setFileToTransfer(fileId);
    setIsModalOpen(true);
    
    if (level !== "2") {
      // Reset selections for non-level-2 users
      setSelectedOffice("");
      setSelectedDepartment("");
      setDepartments([]);
    } else {
      // For level 2 users, keep department selections but reset the selected department
      setSelectedDepartment("");
    }
  };

  const handleTransfer = async () => {
    // For level 2 users, validate department is selected
    if (level === "2") {
      if (!selectedDepartment) {
        alert("Please select a department");
        return;
      }
    } else {
      // For other users, validate office is selected
      if (!selectedOffice) {
        alert("Please select an office");
        return;
      }
    }

    setIsLoading(true);
    try {
      let payload = {};
      
      if (level === "2") {
        // For level 2 users, only send department
        payload = {
          related_department: selectedDepartment
        };
      } else {
        // For other users, send office and optionally department
        payload = {
          related_office: selectedOffice
        };
        
        if (selectedDepartment) {
          payload.related_department = selectedDepartment;
        }
      }

      const response = await fetch(
        `${baseUrl}/files/${fileToTransfer}/transfer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("File transferred successfully");
        fetchData();
        setIsModalOpen(false);
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

  const handleAccept = async () => {
    const approvedDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(`${baseUrl}/files/${fileToAccept}/accept/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          accepted: fileToAccept,
          status: "approved",
          remarks,
          approved_date: approvedDate,
        }),
      });

      if (response.ok) {
        fetchData();
        setIsAcceptModalOpen(false);
      } else {
        console.error("Error accepting file:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting file:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-bold text-orange-600 mb-4">फाइल अनुरोध</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-none border-separate border-spacing-y-4">
          <thead className="text-gray-800">
            <tr className=" rounded-md">
              <th className="p-3 text-center font-normal border-none">आईडी</th>
              <th className="p-3 text-center font-normal border-none">
                फाइलको नाम
              </th>
              <th className="p-3 text-center font-normal border-none">
                विषय
              </th>
              <th className="p-3 text-center font-normal border-none">
                पेश गर्ने
              </th>
              <th className="p-3 text-center font-normal border-none">
                पेश गरेको मिति
              </th>
              <th className="p-3 text-center font-normal border-none">फाइल</th>
              <th className="p-3 text-center font-normal border-none">
                कार्य
              </th>
            </tr>
          </thead>
          <tbody>
            {nonTransferredFiles.length > 0 ? (
              nonTransferredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="text-gray-900 text-center my-4 gap-5 shadow-gray-100 text-nowrap border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg"
                >
                  <td className="py-4 px-4 border-none bg-gray-50 rounded-l-xl">
                    {file.id}
                  </td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    {file.file_name}
                  </td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    {file.subject}
                  </td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    {file.present_by?.first_name} {file.present_by?.last_name}
                  </td>
                  <td className="px-4 py-4 border-none bg-gray-50">
                    {file.present_date}
                  </td>
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
                      onClick={() => handleOpenTransferModal(file.id)}
                      className="bg-[#B3F8CC] hover:bg-[#84be99] text-black px-3 py-1 rounded-lg transition-all"
                    >
                      Transfer
                    </button>
                    {level !== "2" && (
                      <button
                        onClick={() => {
                          setFileToAccept(file.id);
                          setIsAcceptModalOpen(true);
                        }}
                        className="bg-[#b3c9f8] hover:bg-[#8a9fcb] text-black px-3 py-1 rounded-lg transition-all"
                      >
                        Approve
                      </button>
                    )}
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
              {level === "2" ? (
                <>
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
                </>
              ) : (
                <>
                  {/* Other users see both office and department selection */}
                  <label className="block mb-4">
                    <span className="text-gray-700">Select Office:</span>
                    <select
                      value={selectedOffice}
                      onChange={(e) => setSelectedOffice(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={isLoading}
                    >
                      <option value="">Select an Office</option>
                      {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Select Department:</span>
                    <select
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      value={selectedDepartment}
                      className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      disabled={!selectedOffice || isLoading}
                    >
                      <option value="">Select a Department</option>
                      {departments.length > 0 ? (
                        departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          {isLoading
                            ? "Loading departments..."
                            : selectedOffice
                            ? "No departments available for this office"
                            : "Please select an office first"}
                        </option>
                      )}
                    </select>
                  </label>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (level !== "2") {
                    setSelectedOffice("");
                  }
                  setSelectedDepartment("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={isLoading || (level === "2" ? !selectedDepartment : !selectedOffice)}
              >
                {isLoading ? "Transferring..." : "Transfer"}
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
                className="bg-[#E68332] hover:bg-[#c6722d] text-white px-4 py-2 rounded-lg"
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