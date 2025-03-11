import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminHeader from "./AdminHeader";
import { useParams } from "react-router-dom";

const AddDepartOfOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const { officeId } = useParams();
  const [formData, setFormData] = useState({ name: "", belongs_to: officeId });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      belongs_to: officeId
    }));
    console.log("Office ID:", officeId);
  }, [officeId]);

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
    <>
    <AdminHeader/>
      <div className="container mt-16 p-4">
        <div className="bg-white md:w-[40%] w-[90%] mx-auto shadow-gray-300 rounded-lg shadow-md p-6">
          <h2 className="text-2xl text-[#E68332] font-bold mb-4 text-center">Add Department</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Department Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex items-center gap-6">
              <button
                type="submit"
                className="bg-[#E68332] text-white px-4 py-2 rounded hover:bg-[#E68332] focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Add Department
              </button>
              {isSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Submit Another
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDepartOfOffice;