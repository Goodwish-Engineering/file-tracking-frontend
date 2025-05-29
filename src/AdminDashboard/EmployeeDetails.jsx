import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaUserAlt, FaBuilding, FaSearch, FaUserEdit, FaUserTie, FaBriefcase, FaSpinner } from "react-icons/fa";
import { MdWorkOutline, MdEdit, MdDelete, MdOutlineInfo } from "react-icons/md";
import { toast } from "react-toastify";

const EmployeeDetails = () => {
  const token = localStorage.getItem("token");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [empData, setEmpData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [editOffice, setEditOffice] = useState(null);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // Added missing state variable
  const [newRole, setNewRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("employee_id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedEmployee(null);
        setRoleModal(null);
        setEditOffice(null);
      }
    };

    if (selectedEmployee || roleModal || editOffice) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedEmployee, roleModal, editOffice]);

  useEffect(() => {
    fetchdata();
    fetchOffices();
  }, []);

  const fetchdata = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/user/all/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      const filteredData = data.filter((user) => !user.is_superuser);
      setEmpData(filteredData);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("कर्मचारी डाटा लोड गर्न समस्या भयो।");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async () => {
    if (!roleModal || !newRole) return;
    
    try {
      const response = await fetch(`${baseUrl}/user/${roleModal.id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ user_type: newRole }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update user role");
      }
      
      setEmpData(prevEmpData => 
        prevEmpData.map(user => 
          user.id === roleModal.id 
            ? { ...user, user_type: newRole } 
            : user
        )
      );
      
      setRoleModal(null);
      setNewRole("");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.log("Error fetching offices:", error);
      setOffices([]);
    }
  };

  const handleOfficeChange = (e) => {
    const officeId = e.target.value;
    setSelectedOfficeId(officeId);
    setSelectedDepartmentId('');
    
    if (officeId) {
      // Find the selected office from the offices array
      const selectedOffice = offices.find(office => office.id.toString() === officeId);
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
      } else {
        setDepartments([]);
      }
    } else {
      setDepartments([]);
    }
  };

  const handleEditOfficeClick = (user) => {
    setEditOffice(true);
    setSelectedUserId(user.id); // Now using the properly defined state
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartmentId(e.target.value);
  };

  const openEditOfficeModal = (employee) => {
    setEditOffice(employee);
    setSelectedUserId(employee.id); // Set the user ID when opening the modal
    
    // Set initial office and department values if employee has them
    if (employee.office && employee.office.id) {
      setSelectedOfficeId(employee.office.id.toString());
      
      // Find the office in the offices array to get its departments
      const selectedOffice = offices.find(office => office.id === employee.office.id);
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
        
        // Set department if employee has one
        if (employee.department && employee.department.id) {
          setSelectedDepartmentId(employee.department.id.toString());
        } else {
          setSelectedDepartmentId('');
        }
      } else {
        setDepartments([]);
        setSelectedDepartmentId('');
      }
    } else {
      setSelectedOfficeId('');
      setDepartments([]);
      setSelectedDepartmentId('');
    }
  };

  const updateEmployeeOfficeAndDepartment = async () => {
    if (!selectedUserId) {
      console.error("No user selected");
      return;
    }
  
    const payload = {};
    if (selectedOfficeId) payload.office = selectedOfficeId;
    if (selectedDepartmentId) payload.department = selectedDepartmentId;
  
    if (Object.keys(payload).length === 0) {
      console.log("No changes to update");
      setEditOffice(null);
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/user/${selectedUserId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update user");
  
      console.log(`User ${selectedUserId} updated successfully`);
      setEditOffice(null);
      fetchdata(); // Refresh data after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // New function to filter employees based on search query
  const filteredEmployees = empData.filter(employee => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (employee.first_name && employee.first_name.toLowerCase().includes(query)) ||
      (employee.last_name && employee.last_name.toLowerCase().includes(query)) ||
      (employee.employee_id && employee.employee_id.toString().includes(query)) ||
      (employee.position && employee.position.toLowerCase().includes(query)) ||
      (employee.email && employee.email.toLowerCase().includes(query))
    );
  });

  // New function to sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    
    const valA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
    const valB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-6 border-l-4 border-[#E68332]">
        <h1 className="text-2xl font-bold text-[#E68332] flex items-center gap-2">
          <FaUserAlt className="text-[#E68332]" />
          कर्मचारी विवरण
        </h1>
        <p className="text-gray-600 mt-1">सबै कर्मचारीहरूको विस्तृत जानकारी हेर्नुहोस् र व्यवस्थापन गर्नुहोस्</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="नाम, आईडी, पद, वा इमेल खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>जम्मा: {filteredEmployees.length} कर्मचारीहरू</span>
            <button 
              onClick={fetchdata}
              className="ml-2 text-[#E68332] hover:text-[#c36f2a] flex items-center gap-1"
              title="रिफ्रेश गर्नुहोस्"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              अपडेट
            </button>
          </div>
        </div>
      </div>

      {/* Loading, Error and Data States */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaSpinner className="animate-spin text-4xl text-[#E68332] mx-auto mb-4" />
          <p className="text-gray-600">कर्मचारीको डाटा लोड गर्दै...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 text-4xl mx-auto mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchdata}
            className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
          >
            फेरि प्रयास गर्नुहोस्
          </button>
        </div>
      ) : sortedEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaUserAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 font-medium">कुनै कर्मचारी फेला परेन</p>
          <p className="text-gray-500 mt-2">हाल सिस्टममा कुनै कर्मचारी दर्ता छैन वा खोजी मापदण्डसँग मेल खाँदैन।</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('employee_id')}
                  >
                    <div className="flex items-center gap-1">
                      कर्मचारी आईडी
                      {getSortIndicator('employee_id')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('first_name')}
                  >
                    <div className="flex items-center gap-1">
                      पहिलो नाम
                      {getSortIndicator('first_name')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_name')}
                  >
                    <div className="flex items-center gap-1">
                      अन्तिम नाम
                      {getSortIndicator('last_name')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('position')}
                  >
                    <div className="flex items-center gap-1">
                      पद
                      {getSortIndicator('position')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    कार्य
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employee_id || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.first_name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.last_name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.position || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="विस्तृत विवरण हेर्नुहोस्"
                        >
                          <MdOutlineInfo className="text-lg" />
                        </button>
                        <button
                          onClick={() => setRoleModal(employee)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="भूमिका सम्पादन गर्नुहोस्"
                        >
                          <FaUserTie className="text-lg" />
                        </button>
                        <button
                          onClick={() => openEditOfficeModal(employee)}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                          title="कार्यालय परिवर्तन गर्नुहोस्"
                        >
                          <FaBuilding className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm backdrop-filter transition-opacity duration-300">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden animate-scaleIn"
          >
            <div className="bg-gradient-to-r from-[#E68332] to-[#FF9F4A] p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaUserAlt className="text-white" />
                कर्मचारी विस्तृत विवरण
              </h2>
              <button 
                onClick={() => setSelectedEmployee(null)} 
                className="text-white hover:text-gray-200 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Employee Profile Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="bg-gray-100 p-6 rounded-full">
                    <FaUserAlt className="text-5xl text-gray-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {`${selectedEmployee.first_name || ''} ${selectedEmployee.last_name || ''}`}
                    </h3>
                    <p className="text-gray-500">{selectedEmployee.position || 'अनौपचारिक पद'}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      आईडी: {selectedEmployee.employee_id || 'अनुपलब्ध'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {selectedEmployee.user_type === "1" ? "फाँट" : 
                         selectedEmployee.user_type === "2" ? "शाखा प्रमुख" : 
                         selectedEmployee.user_type === "3" ? "शाखा अधिकारी" :
                         selectedEmployee.user_type === "4" ? "विभाग प्रमुख" :
                         selectedEmployee.user_type === "5" ? "प्रशासक" : "अन्य"}
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {selectedEmployee.is_active ? "सक्रिय" : "निष्क्रिय"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <FaUserAlt className="text-[#E68332]" />
                    व्यक्तिगत जानकारी
                  </h3>
                  <div className="space-y-2">
                    <InfoItem label="युजरनेम" value={selectedEmployee.username} />
                    <InfoItem label="इमेल" value={selectedEmployee.email} />
                    <InfoItem label="बाबुको नाम" value={selectedEmployee.father_name} />
                    <InfoItem label="आमाको नाम" value={selectedEmployee.mother_name} />
                    <InfoItem label="हजुरबुबाको नाम" value={selectedEmployee.grand_father_name} />
                    <InfoItem label="फोन नम्बर" value={selectedEmployee.phone_number} />
                    <InfoItem label="मोबाइल नम्बर" value={selectedEmployee.mobile_number} />
                    <InfoItem label="घरको नम्बर" value={selectedEmployee.home_number} />
                  </div>
                </div>
                
                {/* Office Information */}
                <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <FaBuilding className="text-[#E68332]" />
                    कार्यालय जानकारी
                  </h3>
                  <div className="space-y-2">
                    <InfoItem label="कार्यालय" value={selectedEmployee.office?.name} />
                    <InfoItem label="विभाग" value={selectedEmployee.department?.name} />
                    <InfoItem label="नियुक्ति मिति" value={selectedEmployee.date_joined} />
                    <InfoItem label="अवकाश मिति" value={selectedEmployee.recess_date} />
                    <InfoItem label="कर्मचारी प्रकार" value={selectedEmployee.employee_type} />
                    <InfoItem label="NA LA KOS नम्बर" value={selectedEmployee.na_la_kos_no} />
                    <InfoItem label="संचय कोष नम्बर" value={selectedEmployee.accumulation_fund_no} />
                  </div>
                </div>
                
                {/* Address & Documents */}
                <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <MdWorkOutline className="text-[#E68332]" />
                    ठेगाना र कागजात
                  </h3>
                  <div className="space-y-2">
                    <InfoItem 
                      label="स्थायी ठेगाना" 
                      value={`${selectedEmployee.perm_municipality || ''}, ${selectedEmployee.perm_district || ''}, ${selectedEmployee.perm_state || ''}`} 
                    />
                    <InfoItem 
                      label="अस्थायी ठेगाना" 
                      value={`${selectedEmployee.temp_municipality || ''}, ${selectedEmployee.temp_district || ''}, ${selectedEmployee.temp_state || ''}`}
                    />
                    <InfoItem label="नागरिकता नं." value={selectedEmployee.citizenship_id} />
                    <InfoItem label="नागरिकता जारी मिति" value={selectedEmployee.citizenship_date_of_issue} />
                    <InfoItem label="नागरिकता जिल्ला" value={selectedEmployee.citizenship_district} />
                    <InfoItem label="बैंक खाता नम्बर" value={selectedEmployee.bank_account_no} />
                    <InfoItem label="बैंकको नाम" value={selectedEmployee.bank_name} />
                  </div>
                </div>
                
                {/* Education & Achievements */}
                <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <FaBriefcase className="text-[#E68332]" />
                    शैक्षिक र अन्य विवरण
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Education */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-base text-gray-700 mb-2">शिक्षा</h4>
                      {selectedEmployee.education ? (
                        <p className="text-sm text-gray-600">
                          {`${selectedEmployee.education.education_level || "—"} from ${selectedEmployee.education.institution || "—"} (${selectedEmployee.education.board || "—"}, ${selectedEmployee.education.year || "—"}), ${selectedEmployee.education.percentage || "—"}%`}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">शैक्षिक विवरण उपलब्ध छैन</p>
                      )}
                    </div>
                    
                    {/* Awards */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-base text-gray-700 mb-2">पुरस्कार</h4>
                      {selectedEmployee.awards ? (
                        <p className="text-sm text-gray-600">
                          {`${selectedEmployee.awards.name} - ${selectedEmployee.awards.description}`}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">पुरस्कार विवरण उपलब्ध छैन</p>
                      )}
                    </div>
                    
                    {/* Punishments */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-base text-gray-700 mb-2">सजाय</h4>
                      {selectedEmployee.punishments ? (
                        <p className="text-sm text-gray-600">
                          {`${selectedEmployee.punishments.name} - ${selectedEmployee.punishments.description}`}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">सजाय विवरण उपलब्ध छैन</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Loan Details */}
                  <div className="mt-4 bg-white p-3 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-base text-gray-700 mb-2">ऋण विवरण</h4>
                    {selectedEmployee.loan ? (
                      <p className="text-sm text-gray-600">
                        {`${selectedEmployee.loan.loan_type} - ${selectedEmployee.loan.name}, ब्याज दर: ${selectedEmployee.loan.interest_rate}%, रकम: ${selectedEmployee.loan.min_amount} - ${selectedEmployee.loan.max_amount}, अवधि: ${selectedEmployee.loan.min_tenure} - ${selectedEmployee.loan.max_tenure} वर्ष`}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">ऋण विवरण उपलब्ध छैन</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
                onClick={() => setSelectedEmployee(null)}
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm backdrop-filter transition-opacity duration-300">
          <div 
            ref={modalRef}
            className="bg-white p-6 w-[90%] rounded-lg shadow-xl md:w-1/3 animate-scaleIn"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#E68332] flex items-center gap-2">
                <FaUserTie className="text-[#E68332]" />
                भूमिका परिवर्तन
              </h2>
              <button 
                onClick={() => setRoleModal(null)} 
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <span className="font-medium">{roleModal.first_name} {roleModal.last_name}</span> को भूमिका परिवर्तन गर्नुहोस्
              </p>
              <div className="bg-gray-100 p-3 rounded-md text-sm mb-4">
                <p className="text-gray-600 flex justify-between">
                  <span>वर्तमान भूमिका:</span>
                  <span className="font-medium">
                    {roleModal.user_type === "1" ? "फाँट" : 
                     roleModal.user_type === "2" ? "शाखा प्रमुख" : 
                     roleModal.user_type === "3" ? "शाखा अधिकारी" :
                     roleModal.user_type === "4" ? "विभाग प्रमुख" :
                     roleModal.user_type === "5" ? "प्रशासक" : "अनौपचारिक"}
                  </span>
                </p>
              </div>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">नयाँ भूमिका चयन गर्नुहोस्</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all mb-6"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="">भूमिका चयन गर्नुहोस्...</option>
              <option value="1">फाँट</option>
              <option value="2">शाखा प्रमुख</option>
              <option value="3">शाखा अधिकारी</option>
              <option value="4">विभाग प्रमुख</option>
              <option value="5">प्रशासक</option>
            </select>
            
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setRoleModal(null)}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                className="px-4 py-2 bg-[#E68332] hover:bg-[#c36f2a] text-white rounded-md transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                onClick={updateRole}
                disabled={!newRole}
              >
                परिवर्तन गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Office Assignment Modal */}
      {editOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm backdrop-filter transition-opacity duration-300">
          <div 
            ref={modalRef}
            className="bg-white w-[90%] p-6 rounded-lg shadow-xl md:w-1/3 animate-scaleIn"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#E68332] flex items-center gap-2">
                <FaBuilding className="text-[#E68332]" />
                कार्यालय र विभाग परिवर्तन
              </h2>
              <button 
                onClick={() => setEditOffice(null)} 
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <span className="font-medium">{typeof editOffice === 'object' && editOffice.first_name} {typeof editOffice === 'object' && editOffice.last_name}</span> को कार्यालय र विभाग परिवर्तन गर्नुहोस्
              </p>
              <div className="bg-gray-100 p-3 rounded-md text-sm mb-4">
                <p className="text-gray-600">
                  वर्तमान कार्यालय: <span className="font-medium">{typeof editOffice === 'object' && editOffice.office ? editOffice.office.name : "अनौपचारिक"}</span>
                </p>
                <p className="text-gray-600">
                  वर्तमान विभाग: <span className="font-medium">{typeof editOffice === 'object' && editOffice.department ? editOffice.department.name : "अनौपचारिक"}</span>
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">कार्यालय चयन गर्नुहोस्</label>
                <select
                  value={selectedOfficeId}
                  onChange={handleOfficeChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                >
                  <option value="">कार्यालय चयन गर्नुहोस्...</option>
                  {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">विभाग चयन गर्नुहोस्</label>
                <select
                  value={selectedDepartmentId}
                  onChange={handleDepartmentChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={!selectedOfficeId || departments.length === 0}
                >
                  <option value="">विभाग चयन गर्नुहोस्...</option>
                  {departments.length > 0 ? (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>कुनै विभाग उपलब्ध छैन</option>
                  )}
                </select>
                {selectedOfficeId && departments.length === 0 && (
                  <p className="mt-2 text-sm text-orange-500">यस कार्यालयमा कुनै विभाग छैन। कृपया पहिले विभाग थप्नुहोस्।</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setEditOffice(null)}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                className="px-4 py-2 bg-[#E68332] hover:bg-[#c36f2a] text-white rounded-md transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                onClick={updateEmployeeOfficeAndDepartment}
                disabled={!selectedOfficeId}
              >
                परिवर्तन गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}:</span>
    <span className="text-sm">{value || '—'}</span>
  </div>
);

export default EmployeeDetails;