import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const EmployeeDetails = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [empData, setEmpData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedEmployee(null);
      }
    };

    if (selectedEmployee) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedEmployee]);
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
  return (
    <div className="flex w-full flex-col p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">
        Employee Details
      </h1>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="border border-gray-300 px-4 py-2">Employee ID</th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Office</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(empData) && empData.length > 0 ? (
              empData.map((data, index) => (
                <tr
                  key={data.employee_id || index}
                  className="hover:bg-orange-100 transition"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {data.employee_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.first_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.last_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.position}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.office?.office_name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-white px-1 py-1 rounded-lg font-semibold hover:bg-orange-900  bg-orange-600"
                      onClick={() => setSelectedEmployee(data)}
                    >
                      see more
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

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto animate-fade-in"
          >
            <h2 className="text-xl font-semibold text-orange-600 mb-4">
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
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
              <p>
                <strong>Office:</strong>{" "}
                {selectedEmployee.office?.office_name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
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
                <strong>Permanent Address:</strong>{" "}
                {selectedEmployee.perm_municipality},{" "}
                {selectedEmployee.perm_district}, {selectedEmployee.perm_state}
              </p>
              <p>
                <strong>Temporary Address:</strong>{" "}
                {selectedEmployee.temp_municipality},{" "}
                {selectedEmployee.temp_district}, {selectedEmployee.temp_state}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedEmployee.mobile_number}
              </p>
              <p>
                <strong>Bank:</strong> {selectedEmployee.bank_name} -{" "}
                {selectedEmployee.bank_account_no}
              </p>
              <p>
                <strong>Education:</strong>{" "}
                {selectedEmployee.education?.education_level || "N/A"} at{" "}
                {selectedEmployee.education?.institution || "N/A"}
              </p>
              <p>
                <strong>Awards:</strong>{" "}
                {selectedEmployee.awards?.name || "None"} -{" "}
                {selectedEmployee.awards?.description || "N/A"}
              </p>
              <p>
                <strong>Punishments:</strong>{" "}
                {selectedEmployee.punishments?.name || "None"} -{" "}
                {selectedEmployee.punishments?.description || "N/A"}
              </p>
              <p>
                <strong>Loan:</strong>{" "}
                {selectedEmployee.loan?.loan_type || "No Loan"} -{" "}
                {selectedEmployee.loan?.name || "N/A"}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
