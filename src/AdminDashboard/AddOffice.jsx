import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import AddDepartOfOffice from "./AddDepartOfOffice";
import DisplayEditOffice from "./DisplayEditOffice";
import axios from "axios";

const AddOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [formData, setFormData] = useState({ name: "" });
  const [departments, setDepartments] = useState([{ name: "" }]);
  const [officeId, setOfficeId] = useState(null);
  const [buttonSubmitted, setButtonSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (index, e) => {
    const newDepartments = [...departments];
    newDepartments[index].name = e.target.value;
    setDepartments(newDepartments);
  };

  const addDepartmentField = () => {
    setDepartments([...departments, { name: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(`${baseUrl}/offices/`, formData, {
        headers: { Authorization: `Token ${token}` },
      });
  
      if (response.data) {
        const newOfficeId = response.data.id;
        setOfficeId(newOfficeId);
  
        for (const department of departments) {
          if (department.name.trim() !== "") {
            await axios.post(
              `${baseUrl}/department/`,
              { ...department, belongs_to: newOfficeId },
              {
                headers: { Authorization: `Token ${token}` },
              }
            );
          }
        }
        setDataUpdated(true);
        setButtonSubmitted(true);
        setSuccessMessage("Office and departments added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setDataUpdated(false)
        }, 3000);
  
        // Reset form fields
        setFormData({ name: "" });
        setDepartments([{ name: "" }]);
      }
    } catch (error) {
      console.error("Error saving office or department:", error);
      alert("Failed to add office. Please try again.");
    }
  };  

  return (
    <div className="flex flex-col w-[96%] mx-auto md:flex-row gap-4 p-4 h-screen">
      {/* Left Section */}
      <div className="w-full md:w-[45%]">
        <h2 className="text-center my-3 text-[#E68332] font-semibold text-xl md:text-2xl">
          Add Office Name and Departments
        </h2>
        <form onSubmit={handleSubmit} className="w-full border border-[#E68332] rounded-lg">
          <h2 className="text-center bg-[#E68332] rounded-t-lg py-2 text-white text-xl font-bold">
            Add Office
          </h2>
          <div className="p-4">
            <label className="block text-gray-900 text-md">Branch Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="p-4">
            <label className="block text-gray-900 text-md">Related Departments:</label>
            {departments.map((department, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={department.name}
                  onChange={(e) => handleDepartmentChange(index, e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
                {index === departments.length - 1 && (
                  <button
                    type="button"
                    onClick={addDepartmentField}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 justify-center my-3">
            <button type="submit" className="bg-[#E68332] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#c36f2a]">
              Create
            </button>
          </div>

          {successMessage && (
            <p className="text-center text-green-600 font-semibold my-2">{successMessage}</p>
          )}
        </form>

        {/* Add Department Component */}
        {/* {officeId && buttonSubmitted && <AddDepartOfOffice officeId={officeId} />} */}
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[55%]">
        <DisplayEditOffice dataUpdated={dataUpdated} />
      </div>
    </div>
  );
};

export default AddOffice;
