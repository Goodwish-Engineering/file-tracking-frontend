import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const EmployeeDetails = () => {
  const token = localStorage.getItem("token");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [empData, setEmpData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [newRole, setNewRole] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedEmployee(null);
        setRoleModal(null);
      }
    };

    if (selectedEmployee || roleModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedEmployee, roleModal]);

  useEffect(() => {
    fetchdata();
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
    } catch (error) {
      console.log(error);
    }
  };
  const updateRole = async () => {
    try {
      await fetch(`${baseUrl}/user/${roleModal.id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ user_type: newRole }),
      });
      console.log(roleModal);
      setRoleModal(null);
      fetchdata();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Employee Details
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-none border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-[#3F84E5] py-2 text-white border-b-2 border-gray-300 text-nowrap">
              <th className="px-4 border-none py-2 text-center">Employee ID</th>
              <th className="px-4 border-none py-2 text-center">First Name</th>
              <th className="px-4 border-none py-2 text-center">Last Name</th>
              <th className="px-4 border-none py-2 text-center">Position</th>
              <th className="px-4 border-none py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(empData) && empData.length > 0 ? (
              empData.map((data, index) => (
                <tr
                  key={data.employee_id || index}
                  className="hover:bg-gray-50 transition text-nowrap border-gray-300 border-b"
                >
                  <td className="border-none px-4 py-2 text-center">
                    {data.employee_id}
                  </td>
                  <td className="border-none px-4 py-2 text-center">
                    {data.first_name}
                  </td>
                  <td className="border-none px-4 py-2 text-center">
                    {data.last_name}
                  </td>
                  <td className="border-none px-4 py-2 text-center">
                    {data.position}
                  </td>
                  <td className="border-none px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="text-white px-2 py-1 rounded-lg bg-green-600 hover:bg-green-900"
                      onClick={() => setSelectedEmployee(data)}
                    >
                      See More
                    </button>
                    <button
                      className="text-white px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-900"
                      onClick={() => setRoleModal(data)}
                    >
                      Assign Role
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
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
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
                {`${selectedEmployee.perm_municipality}, ${selectedEmployee.perm_district}, ${selectedEmployee.perm_state}`}
              </p>
              <p>
                <strong>Temporary Address:</strong>{" "}
                {`${selectedEmployee.temp_municipality}, ${selectedEmployee.temp_district}, ${selectedEmployee.temp_state}`}
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
                {`${selectedEmployee.education.education_level} from ${selectedEmployee.education.institution} (${selectedEmployee.education.board}, ${selectedEmployee.education.year}), ${selectedEmployee.education.percentage}%`}
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Assign Role
            </h2>
            <select
              className="w-full p-2 border rounded"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={updateRole}
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
