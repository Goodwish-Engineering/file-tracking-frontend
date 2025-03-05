import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AddDepartOfOffice = ({ officeId }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [formData, setFormData] = useState({ name: "", belongs_to: officeId });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseUrl}/department/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data) {
        setIsSubmitted(true);
        alert("Department added successfully");
        setFormData({ name: "", belongs_to: officeId }); 
      }
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to add department. Please try again.");
    }
  };

  return (
    <div className="my-5 items-center block mx-auto">
      <form onSubmit={handleSubmit} className="w-full border-blue-500 border rounded-lg">
      <h2 className="text-center text-white text-xl py-2 font-semibold rounded-t-lg bg-blue-500">
        Add Department
      </h2>
        <div className='p-4'>
          <label className="block text-gray-800">Department Name:</label>
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
            className="bg-blue-600 font-semibold text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Department
          </button>

          {isSubmitted && (
            <button
              type="button"
              className="bg-green-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={() => setIsSubmitted(false)}
            >
              Submit Another
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDepartOfOffice;
