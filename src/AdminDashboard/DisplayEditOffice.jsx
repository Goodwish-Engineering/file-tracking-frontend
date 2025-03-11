import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit, FaExclamationCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
// import AddDepartOfOffice from "./AddDepartOfOffice";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DisplayEditOffice = ({ dataUpdated }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const navigate = useNavigate();

  const [officeData, setOfficeData] = useState([]);
  const [editingOffice, setEditingOffice] = useState(null);
  const [editedOfficeName, setEditedOfficeName] = useState("");
  const [showInfoOffice, setShowInfoOffice] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editedDepartmentName, setEditedDepartmentName] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/offices/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data) {
        setOfficeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching Office data:", error);
      alert("Error fetching office data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataUpdated]);

  const handleStartEdit = (office) => {
    setEditingOffice(office.id);
    setEditedOfficeName(office.name);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${baseUrl}/offices/${editingOffice}/`,
        { name: editedOfficeName },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchData();
      setEditingOffice(null);
      alert("Office updated successfully");
    } catch (error) {
      console.error("Error updating office:", error);
      alert("Error updating office");
    }
  };

  const handleDeleteOffice = async (officeId) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/offices/${officeId}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      fetchData();
      alert("Office deleted successfully");
    } catch (error) {
      console.error("Error deleting office:", error);
      alert("Error deleting office");
    }
  };

  const handleStartEditDepartment = (department) => {
    setEditingDepartment(department.id);
    setEditedDepartmentName(department.name);
  };

  const handleSaveEditDepartment = async () => {
    if (!editedDepartmentName.trim()) {
      alert("Department name cannot be empty");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${baseUrl}/department/${editingDepartment}/`,
        { name: editedDepartmentName },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditingDepartment(null);
      alert("Department updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Error updating department");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/department/${departmentId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchData();
      alert("Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Error deleting department");
    }
  };

  const handleShowInfo = (office) => {
    setShowInfoOffice(office);
    setShowAddDepartment(false);
  };

  return (
    <div className="container mx-auto p-4">
      {showInfoOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-xl w-96 bg-white">
            <div className="bg-[#E68332] p-2 flex items-center">
              <h2 className="text-xl text-white font-bold">Office Details</h2>
              <button
                className="text-white text-2xl ml-auto"
                onClick={() => setShowInfoOffice(null)}
              >
                x
              </button>
            </div>

            <div className="mt-2 p-4">
              <strong className="font-normal">Departments:</strong>
              <div className="flex justify-end items-end">
                <button
                  className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
                  onClick={() => setShowAddDepartment(true)}
                >
                  Add
                </button>
              </div>
              {showInfoOffice.departments &&
              showInfoOffice.departments.length > 0 ? (
                <>
                  <ul className="mt-2">
                    {showInfoOffice.departments.map((dept) => (
                      <li
                        key={dept.id}
                        className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-50 hover:bg-gray-100"
                      >
                        {editingDepartment === dept.id ? (
                          <input
                            type="text"
                            value={editedDepartmentName}
                            onChange={(e) =>
                              setEditedDepartmentName(e.target.value)
                            }
                            className="w-full px-2 py-1"
                          />
                        ) : (
                          <p>{dept.name}</p>
                        )}
                        <div className="flex items-center gap-5">
                          {editingDepartment === dept.id ? (
                            <>
                              <button
                                onClick={handleSaveEditDepartment}
                                className="bg-green-500 hover:bg-green-700 px-2 py-1 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDepartment(null)}
                                className="bg-red-500 hover:bg-red-700 px-2 py-1 text-white rounded"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditDepartment(dept)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FaRegEdit className="text-xl" />
                              </button>
                              <button
                                onClick={() => handleDeleteDepartment(dept.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <MdDelete className="text-xl" />
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm p-3 text-gray-500 mt-2">
                  No departments found
                </p>
              )}
            </div>

            <div className="w-[90%] mx-auto">
              {showAddDepartment && (
                <AddDepartOfOffice officeId={showInfoOffice.id} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full md:w-[90%] mx-auto flex justify-end">
        <table className="w-full overflow-auto bg-white border border-gray-300">
          <thead>
            <tr className="bg-[#E68332] text-white">
              <th className="px-4 py-2 p-6 border-none text-left">
                Currently Available Branches
              </th>
              <th className="px-4 py-2 p-6 border-none text-right">
                Related Departments
              </th>
            </tr>
          </thead>
          <tbody>
            {officeData.map((office) => (
              <tr key={office.id} className="border border-b border-gray-300">
                <td className="p-3 border-none flex items-center justify-between">
                  <div className="text-center flex justify-center items-center">
                    <p>
                      {editingOffice === office.id ? (
                        <input
                          type="text"
                          value={editedOfficeName}
                          onChange={(e) => setEditedOfficeName(e.target.value)}
                          className="w-full px-2 py-1"
                        />
                      ) : (
                        office.name
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {editingOffice === office.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 hover:bg-green-700 p-1 rounded-md text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOffice(null)}
                          className="bg-red-500 hover:bg-red-700 p-1 rounded-md text-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(office)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaRegEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffice(office.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                        {/* <button
                          onClick={() => handleShowInfo(office)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaExclamationCircle className="text-xl" />
                        </button> */}
                      </>
                    )}
                  </div>
                </td>
                <td className="border-l border-gray-300">
                  <div className="flex items-center justify-end">
                    {office.departments && office.departments.length > 0 ? (
                      <ul className="w-full">
                        <li className="list-none p-3 flex items-end justify-end">
                          <button
                            onClick={() =>
                              navigate(`/addDepartment/${office.id}`)
                            }
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaPlus className="text-xl" />
                          </button>
                        </li>
                        {office.departments.map((dept) => (
                          <li
                            key={dept.id}
                            className="flex justify-between items-center p-3 border-t"
                          >
                            {editingDepartment === dept.id ? (
                              <input
                                type="text"
                                value={editedDepartmentName}
                                onChange={(e) =>
                                  setEditedDepartmentName(e.target.value)
                                }
                                className="w-full px-2 py-1 text-right"
                              />
                            ) : (
                              <p className="text-left w-full">{dept.name}</p>
                            )}
                            <div className="flex items-center gap-5 ml-4">
                              {editingDepartment === dept.id ? (
                                <>
                                  <button
                                    onClick={handleSaveEditDepartment}
                                    className="bg-green-500 hover:bg-green-700 px-2 py-1 text-white rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDepartment(null)}
                                    className="bg-red-500 hover:bg-red-700 px-2 py-1 text-white rounded"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStartEditDepartment(dept)
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <FaRegEdit className="text-xl" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteDepartment(dept.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <MdDelete className="text-xl" />
                                  </button>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm p-3 text-gray-500 mt-2 text-right w-full">
                        No departments found
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayEditOffice;
