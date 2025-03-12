import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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
    try {
      const response = await fetch(`${baseUrl}/user/all/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter((user) => !user.is_superuser);
      setEmpData(filteredData);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRole = async () => {
    if (!roleModal || !newRole) return;
    
    try {
      await fetch(`${baseUrl}/user/${roleModal.id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ user_type: newRole }),
      });
      setRoleModal(null);
      fetchdata();
    } catch (error) {
      console.log(error);
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

  return (
    <div className="flex w-full flex-col p-6">
      <h1 className="text-2xl font-bold text-[#E68332] mb-6">
        कर्मचारी विवरण
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-none border-gray-300 text-gray-800 border-separate border-spacing-y-4">
          <thead>
            <tr className="py-2 text-lg font-normal text-gray-800 text-nowrap">
              <th className="px-4 border-none font-normal py-2 text-center">कर्मचारी आईडी</th>
              <th className="px-4 border-none font-normal py-2 text-center">पहिलो नाम</th>
              <th className="px-4 border-none font-normal py-2 text-center">अन्तिम नाम</th>
              <th className="px-4 border-none font-normal py-2 text-center">पद</th>
              <th className="px-4 border-none font-normal py-2 text-center">कार्य</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(empData) && empData.length > 0 ? (
              empData.map((data, index) => (
                <tr
                  key={data.employee_id || index}
                  className="text-black text-center my-4 gap-5 shadow-gray-100 text-nowrap border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg"
                >
                  <td className="border-none p-5 text-center">
                    {data.employee_id}
                  </td>
                  <td className="border-none p-5 text-center">
                    {data.first_name}
                  </td>
                  <td className="border-none p-5 text-center">
                    {data.last_name}
                  </td>
                  <td className="border-none p-5 text-center">
                    {data.position}
                  </td>
                  <td className="border-none p-5 flex gap-2 justify-center">
                    <button
                      className="text-[#E68332] border-[#E68332] border-2 px-2 py-1 rounded-lg hover:text-white hover:bg-[#E68332]"
                      onClick={() => setSelectedEmployee(data)}
                    >
                      See More
                    </button>
                    <button
                      className="text-black px-2 py-1 rounded-lg bg-[#B3F8CC] hover:bg-[#84be99]"
                      onClick={() => setRoleModal(data)}
                    >
                      Edit Role
                    </button>
                    <button
                      className="text-black px-2 py-1 rounded-lg bg-[#F8B3B3] hover:bg-[#c98e8e]"
                      onClick={() => openEditOfficeModal(data)}
                    >
                      Edit Office
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No employee data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#E68332] mb-4">
              Employee Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>ID:</strong> {selectedEmployee.employee_id}
              </p>
              <p>
                <strong>Username:</strong> {selectedEmployee.username}
              </p>
              <p>
                <strong>First Name:</strong> {selectedEmployee.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedEmployee.last_name}
              </p>
              <p>
                <strong>Father's Name:</strong> {selectedEmployee.father_name}
              </p>
              <p>
                <strong>Mother's Name:</strong> {selectedEmployee.mother_name}
              </p>
              <p>
                <strong>Grandfather's Name:</strong>{" "}
                {selectedEmployee.grand_father_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
              <p>
                <strong>Permanent Address:</strong>{" "}
                {`${selectedEmployee.perm_municipality || ''}, ${selectedEmployee.perm_district || ''}, ${selectedEmployee.perm_state || ''}`}
              </p>
              <p>
                <strong>Temporary Address:</strong>{" "}
                {`${selectedEmployee.temp_municipality || ''}, ${selectedEmployee.temp_district || ''}, ${selectedEmployee.temp_state || ''}`}
              </p>
              <p>
                <strong>Citizenship ID:</strong>{" "}
                {selectedEmployee.citizenship_id}
              </p>
              <p>
                <strong>Citizenship Issue Date:</strong>{" "}
                {selectedEmployee.citizenship_date_of_issue}
              </p>
              <p>
                <strong>Citizenship District:</strong>{" "}
                {selectedEmployee.citizenship_district}
              </p>
              <p>
                <strong>Home Number:</strong> {selectedEmployee.home_number}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedEmployee.phone_number}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedEmployee.mobile_number}
              </p>
              <p>
                <strong>Date Joined:</strong> {selectedEmployee.date_joined}
              </p>
              <p>
                <strong>Recess Date:</strong> {selectedEmployee.recess_date}
              </p>
              <p>
                <strong>Employee Type:</strong> {selectedEmployee.employee_type}
              </p>
              <p>
                <strong>NA LA KOS No:</strong> {selectedEmployee.na_la_kos_no}
              </p>
              <p>
                <strong>Accumulation Fund No:</strong>{" "}
                {selectedEmployee.accumulation_fund_no}
              </p>
              <p>
                <strong>Bank Account No:</strong>{" "}
                {selectedEmployee.bank_account_no}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedEmployee.bank_name}
              </p>
              <p>
                <strong>Education:</strong>{" "}
                {selectedEmployee.education
                  ? `${selectedEmployee.education.education_level || "N/A"} from ${selectedEmployee.education.institution || "N/A"} (${selectedEmployee.education.board || "N/A"}, ${selectedEmployee.education.year || "N/A"}), ${selectedEmployee.education.percentage || "N/A"}%`
                  : "N/A"}
              </p>
              <p>
                <strong>Awards:</strong>{" "}
                {selectedEmployee.awards
                  ? `${selectedEmployee.awards.name} - ${selectedEmployee.awards.description}`
                  : "N/A"}
              </p>
              <p>
                <strong>Punishments:</strong>{" "}
                {selectedEmployee.punishments
                  ? `${selectedEmployee.punishments.name} - ${selectedEmployee.punishments.description}`
                  : "N/A"}
              </p>
              <p>
                <strong>Loan Details:</strong>{" "}
                {selectedEmployee.loan
                  ? `${selectedEmployee.loan.loan_type} - ${selectedEmployee.loan.name}, Interest: ${selectedEmployee.loan.interest_rate}%, Amount: ${selectedEmployee.loan.min_amount} - ${selectedEmployee.loan.max_amount}, Tenure: ${selectedEmployee.loan.min_tenure} - ${selectedEmployee.loan.max_tenure} years`
                  : "N/A"}
              </p>
              <p>
                <strong>Office:</strong>{" "}
                {selectedEmployee.office?.office_name || "N/A"}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {selectedEmployee.department?.name || "N/A"}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {selectedEmployee.is_active ? "Yes" : "No"}
              </p>
              <p>
                <strong>Superuser:</strong>{" "}
                {selectedEmployee.is_superuser ? "Yes" : "No"}
              </p>
              <p>
                <strong>Staff:</strong>{" "}
                {selectedEmployee.is_staff ? "Yes" : "No"}
              </p>
              <p>
                <strong>User Type:</strong> {selectedEmployee.user_type}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="p-2 bg-[#E68332] text-white rounded-lg hover:bg-[#c36f2a]"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {roleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div 
            ref={modalRef}
            className="bg-white p-6 w-[90%] rounded-lg shadow-lg md:w-1/3"
          >
            <h2 className="text-xl font-semibold text-[#E68332] mb-4">
              Assign Role
            </h2>
            <select
              className="w-full p-2 border rounded"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="">Select a role</option>
              <option value="1">Faat</option>
              <option value="2">Branch Head</option>
              <option value="3">Branch Officer</option>
              <option value="4">Division Head</option>
              <option value="5">Admin</option>
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setRoleModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E68332] hover:bg-[#c36f2a] text-white rounded-lg"
                onClick={updateRole}
                disabled={!newRole}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {editOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div 
            ref={modalRef}
            className="bg-white w-[90%] p-6 rounded-lg shadow-lg md:w-1/3"
          >
            <h2 className="text-xl font-semibold text-[#E68332] mb-4">
              Edit Office and Department
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Office:</span>
                <select
                  value={selectedOfficeId}
                  onChange={handleOfficeChange} // Fixed to use the function that updates departments
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                <span className="text-gray-700">Department:</span>
                <select
                  value={selectedDepartmentId}
                  onChange={handleDepartmentChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={!selectedOfficeId || departments.length === 0}
                >
                  <option value="">Select a Department</option>
                  {departments.length > 0 ? (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No departments available</option>
                  )}
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setEditOffice(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E68332] hover:bg-[#c36f2a] text-white rounded-lg"
                onClick={updateEmployeeOfficeAndDepartment}
                disabled={!selectedOfficeId && !selectedDepartmentId}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;