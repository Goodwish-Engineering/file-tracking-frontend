import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddDepartOfOffice from "./AddDepartOfOffice";
import DisplayEditOffice from "./DisplayEditOffice";
import axios from "axios";

const AddOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [formData, setFormData] = useState({ name: "" });
  const [buttonSubmitted, setButtonSubmitted] = useState(false);
  const [officeId, setOfficeId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseUrl}/offices/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data) {
        setOfficeId(response.data.id);
        setButtonSubmitted(true);
        alert("Office added successfully");
        setFormData({ name: "" });
      }
    } catch (error) {
      console.error("Error saving office:", error);
      alert("Failed to add office. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4 h-screen">
        {/* Left Section */}
        <div className="w-full md:w-[65%] ">
          <h2 className="text-center my-3 text-blue-500 font-semibold text-xl md:text-2xl">
            Add Office Name and Department
          </h2>
          <form
            onSubmit={handleSubmit}
            className="w-full border border-blue-500 rounded-lg"
          >
            <h2 className="text-center bg-blue-500 rounded-t-lg py-2 text-white text-xl font-bold">
              Add Office
            </h2>
            <div className="p-4">
              <label className="block text-gray-900 text-md">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div className="flex items-center gap-5 justify-center my-3">
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Office
              </button>
            </div>
          </form>

          {/* Add Department Component */}
          {officeId && buttonSubmitted && (
            <AddDepartOfOffice officeId={officeId} />
          )}
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[35%] ">
          <DisplayEditOffice />
        </div>
      </div>
    </>
  );
};

export default AddOffice;
