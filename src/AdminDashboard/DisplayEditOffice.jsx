import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit, FaExclamationCircle, FaBuilding, FaLayerGroup, FaPlus, FaSave } from "react-icons/fa";
import { MdDelete, MdOutlineInfo } from "react-icons/md";
import { useSelector } from "react-redux";
// import AddDepartOfOffice from "./AddDepartOfOffice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      toast.error("Error fetching office data");
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
    if (!editedOfficeName.trim()) {
      toast.error("कार्यालयको नाम खाली हुन सक्दैन");
      return;
    }
    
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
      toast.success("कार्यालय सफलतापूर्वक अपडेट गरियो");
    } catch (error) {
      console.error("Error updating office:", error);
      toast.error("कार्यालय अपडेट गर्न असफल");
    }
  };

  const handleDeleteOffice = async (officeId) => {
    if (!window.confirm("के तपाईं साँच्चै यो कार्यालय मेटाउन चाहनुहुन्छ?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/offices/${officeId}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      fetchData();
      toast.success("कार्यालय सफलतापूर्वक मेटाइयो");
    } catch (error) {
      console.error("Error deleting office:", error);
      toast.error("कार्यालय मेटाउन असफल");
    }
  };

  const handleStartEditDepartment = (department) => {
    setEditingDepartment(department.id);
    setEditedDepartmentName(department.name);
  };

  const handleSaveEditDepartment = async () => {
    if (!editedDepartmentName.trim()) {
      toast.error("विभागको नाम खाली हुन सक्दैन");
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
      toast.success("विभाग सफलतापूर्वक अपडेट गरियो");
      fetchData();
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("विभाग अपडेट गर्न असफल");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("के तपाईं साँच्चै यो विभाग मेटाउन चाहनुहुन्छ?"))
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${baseUrl}/department/${departmentId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchData();
      toast.success("विभाग सफलतापूर्वक मेटाइयो");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("विभाग मेटाउन असफल");
    }
  };

  const handleShowInfo = (office) => {
    setShowInfoOffice(office);
    setShowAddDepartment(false);
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Modified Page Header - More compact since we're under the Add Office section */}
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-3 rounded-t-lg border-l-4 border-[#E68332]">
        <h2 className="font-bold text-xl text-[#E68332] flex items-center gap-2">
          <FaBuilding className="text-[#E68332]" />
          मौजुदा कार्यालय तथा विभागहरू
        </h2>
        <p className="text-gray-600 text-sm">सबै कार्यालयहरू र तिनका विभागहरू हेर्नुहोस्, सम्पादन गर्नुहोस्, वा मेटाउनुहोस्</p>
      </div>

      {/* Content Container */}
      <div className="bg-white shadow-md overflow-hidden">
        {/* Office Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#E68332] to-[#FF9F4A] text-white">
              <th className="px-6 py-3 text-left font-semibold">
                <div className="flex items-center gap-2">
                  <FaBuilding />
                  उपलब्ध कार्यालय शाखाहरू
                </div>
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                <div className="flex items-center gap-2">
                  <FaLayerGroup />
                  सम्बन्धित विभागहरू
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {officeData.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-8 text-center text-gray-500">
                  <div className="py-8 flex flex-col items-center">
                    <FaBuilding className="text-gray-300 text-4xl mb-3" />
                    <p className="text-lg font-medium mb-2">कुनै कार्यालय फेला परेन</p>
                    <p className="text-sm">शुरु गर्नको लागि कृपया माथिबाट पहिले कार्यालय थप्नुहोस्</p>
                  </div>
                </td>
              </tr>
            ) : (
              officeData.map((office, idx) => (
                <tr 
                  key={office.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: "both",
                    animation: "fadeIn 0.5s ease-in-out"
                  }}
                >
                  {/* Office Column */}
                  <td className="p-4 border-r border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        {editingOffice === office.id ? (
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <label htmlFor={`officeName-${office.id}`} className="block text-xs text-blue-600 font-medium mb-1">
                              कार्यालय नाम सम्पादन गर्नुहोस्
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                id={`officeName-${office.id}`}
                                type="text"
                                value={editedOfficeName}
                                onChange={(e) => setEditedOfficeName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332]"
                                autoFocus
                                placeholder="कार्यालय नाम..."
                              />
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-white transition-colors duration-200 shadow-sm flex items-center gap-1 text-sm"
                              >
                                <FaSave size={12} /> सुरक्षित 
                              </button>
                              <button
                                onClick={() => setEditingOffice(null)}
                                className="bg-gray-500 hover:bg-gray-600 px-3 py-1.5 rounded-md text-white transition-colors duration-200 shadow-sm text-sm"
                              >
                                रद्द
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="bg-[#E68332] bg-opacity-10 p-2 rounded-full mr-4">
                              <FaBuilding className="text-[#E68332] text-2xl" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-lg">{office.name}</p>
                              <p className="text-xs text-gray-500">ID: {office.id}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!editingOffice && (
                        <div className="flex items-center">
                          <button
                            onClick={() => handleStartEdit(office)}
                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all duration-200 mx-1"
                            title="कार्यालय सम्पादन गर्नुहोस्"
                          >
                            <FaRegEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteOffice(office.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200 mx-1"
                            title="कार्यालय मेटाउनुहोस्"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleShowInfo(office)}
                            className="text-purple-500 hover:bg-purple-50 p-2 rounded-full transition-all duration-200 mx-1"
                            title="कार्यालय विवरण हेर्नुहोस्"
                          >
                            <MdOutlineInfo className="text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Departments Column */}
                  <td className="bg-gray-50 p-0">
                    <div className="h-full">
                      {office.departments && office.departments.length > 0 ? (
                        <div className="w-full">
                          <div className="flex justify-between items-center p-3 bg-gray-100">
                            <h3 className="font-medium text-gray-700 flex items-center gap-1">
                              <FaLayerGroup className="text-[#E68332]" /> 
                              <span>विभागहरू ({office.departments.length})</span>
                            </h3>
                            <button
                              onClick={() => navigate(`/addDepartment/${office.id}`)}
                              className="text-green-600 hover:text-white hover:bg-green-600 bg-green-50 p-2 rounded-md transition-all duration-200 flex items-center gap-1 text-sm"
                              title="विभाग थप्नुहोस्"
                            >
                              <FaPlus className="text-sm" /> विभाग थप्नुहोस्
                            </button>
                          </div>
                          
                          <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto scrollbar-thin">
                            {office.departments.map((dept, index) => (
                              <li
                                key={dept.id}
                                className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-150"
                                style={{
                                  animationDelay: `${index * 50}ms`,
                                  animationFillMode: "both",
                                  animation: "fadeIn 0.3s ease-in-out"
                                }}
                              >
                                {editingDepartment === dept.id ? (
                                  <div className="flex-1 mr-4">
                                    <input
                                      type="text"
                                      value={editedDepartmentName}
                                      onChange={(e) => setEditedDepartmentName(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332]"
                                      autoFocus
                                    />
                                    <div className="flex justify-end mt-2 space-x-2">
                                      <button
                                        onClick={handleSaveEditDepartment}
                                        className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white rounded text-xs transition-colors duration-200"
                                      >
                                        सुरक्षित
                                      </button>
                                      <button
                                        onClick={() => setEditingDepartment(null)}
                                        className="bg-gray-500 hover:bg-gray-600 px-2 py-1 text-white rounded text-xs transition-colors duration-200"
                                      >
                                        रद्द
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center flex-1">
                                      <div className="bg-[#E68332] bg-opacity-10 p-1.5 rounded-full mr-3">
                                        <FaLayerGroup className="text-[#E68332]" />
                                      </div>
                                      <div>
                                        <p className="text-gray-700 font-medium">{dept.name}</p>
                                        <p className="text-xs text-gray-500">ID: {dept.id}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => handleStartEditDepartment(dept)}
                                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-all duration-200 mx-1"
                                        title="विभाग सम्पादन गर्नुहोस्"
                                      >
                                        <FaRegEdit className="text-lg" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDepartment(dept.id)}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 mx-1"
                                        title="विभाग मेटाउनुहोस्"
                                      >
                                        <MdDelete className="text-lg" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                          <FaLayerGroup className="text-gray-300 text-4xl mb-3" />
                          <p className="text-gray-500 font-medium mb-3">कुनै विभाग फेला परेन</p>
                          <button
                            onClick={() => navigate(`/addDepartment/${office.id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                          >
                            <FaPlus /> पहिलो विभाग थप्नुहोस्
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Office Details Modal */}
      {showInfoOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="rounded-lg shadow-2xl w-[90%] max-w-md bg-white transform transition-all duration-300 scale-100 animate-scaleIn">
            <div className="bg-gradient-to-r from-[#E68332] to-[#FF9F4A] p-4 flex items-center rounded-t-lg">
              <div className="flex items-center">
                <FaBuilding className="text-white mr-2 text-xl" />
                <h2 className="text-xl text-white font-bold">{showInfoOffice.name} - कार्यालय विवरण</h2>
              </div>
              <button
                className="text-white hover:text-gray-200 text-2xl ml-auto transition-colors duration-200"
                onClick={() => setShowInfoOffice(null)}
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              {/* Office Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-[#E68332] bg-opacity-10 p-3 rounded-full mr-4">
                    <FaBuilding className="text-[#E68332] text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{showInfoOffice.name}</h3>
                    <p className="text-sm text-gray-500">कार्यालय ID: {showInfoOffice.id}</p>
                  </div>
                </div>
              </div>
              
              {/* Department Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center text-gray-800">
                    <FaLayerGroup className="mr-2 text-[#E68332]" /> 
                    विभागहरू
                  </h3>
                  
                  <button
                    className="bg-[#E68332] text-white px-3 py-2 rounded-md hover:bg-[#d9773b] transition-colors duration-200 flex items-center gap-1"
                    onClick={() => setShowAddDepartment(true)}
                  >
                    <FaPlus className="text-sm" /> विभाग थप्नुहोस्
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  यस कार्यालयमा उपलब्ध सबै विभागहरू
                </p>
                
                {showInfoOffice.departments &&
                showInfoOffice.departments.length > 0 ? (
                  <>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden max-h-[300px] overflow-y-auto scrollbar-thin">
                      {showInfoOffice.departments.map((dept, index) => (
                        <li
                          key={dept.id}
                          className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-150"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "both",
                            animation: "fadeIn 0.5s ease-in-out"
                          }}
                        >
                          {editingDepartment === dept.id ? (
                            <input
                              type="text"
                              value={editedDepartmentName}
                              onChange={(e) =>
                                setEditedDepartmentName(e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332]"
                              autoFocus
                            />
                          ) : (
                            <p className="text-gray-700 font-medium">{dept.name}</p>
                          )}
                          
                          <div className="flex items-center gap-3">
                            {editingDepartment === dept.id ? (
                              <>
                                <button
                                  onClick={handleSaveEditDepartment}
                                  className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded-md transition-colors duration-200"
                                >
                                  सुरक्षित
                                </button>
                                <button
                                  onClick={() => setEditingDepartment(null)}
                                  className="bg-gray-500 hover:bg-gray-600 px-3 py-1 text-white rounded-md transition-colors duration-200"
                                >
                                  रद्द
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEditDepartment(dept)}
                                  className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-all duration-200"
                                  title="विभाग सम्पादन गर्नुहोस्"
                                >
                                  <FaRegEdit className="text-xl" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                                  title="विभाग मेटाउनुहोस्"
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
                  <div className="mt-4 p-6 text-center border border-dashed border-gray-300 rounded-md bg-gray-50">
                    <FaLayerGroup className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p className="text-gray-500">कुनै विभागहरू भेटिएन</p>
                    <p className="text-sm text-gray-500 mt-2">यो कार्यालयमा अहिलेसम्म कुनै पनि विभाग थपिएको छैन।</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[90%] mx-auto mb-6">
              {showAddDepartment && (
                <AddDepartOfOffice officeId={showInfoOffice.id} />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default DisplayEditOffice;
