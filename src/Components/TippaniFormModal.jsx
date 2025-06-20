import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TippaniFormModal = ({ isOpen, onClose, fileId }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const navigate = useNavigate();
  const [tippanis, setTippanis] = useState([]);
  const [currentTippani, setCurrentTippani] = useState({
    subject: "",
    submitted_by: "",
    submitted_date: "",
    remarks: "",
    approved_by: "",
    approved_date: "",
    tippani_date: "",
    page_no: "",
    related_file: fileId,
    file: null,
  });
  const [showAddButton, setShowAddButton] = useState(false);

  // Format date input as YYYY-MM-DD
  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
        6,
        8
      )}`;
    }
  };

  // Handle input changes, including file selection
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "file") {
      setCurrentTippani({
        ...currentTippani,
        file: e.target.files[0], // Correctly store the file
      });
    } else if (name.includes("date") || name.includes("miti")) {
      const formattedValue = formatDateInput(value);
      setCurrentTippani({
        ...currentTippani,
        [name]: formattedValue,
      });
    } else {
      setCurrentTippani({
        ...currentTippani,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(currentTippani).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${baseUrl}/tippani/`, {
        method: "POST",
        body: formData, // Do NOT set Content-Type; FormData handles it
      });

      if (!response.ok) throw new Error("Failed to save Tippani");

      const newTippani = await response.json();
      setTippanis([...tippanis, newTippani]);
      setShowAddButton(true);

      setCurrentTippani({
        subject: "",
        submitted_by: "",
        submitted_date: "",
        remarks: "",
        approved_by: "",
        approved_date: "",
        tippani_date: "",
        page_no: "",
        related_file: fileId,
        file: null,
      });

      toast.success("Tippani added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error saving Tippani:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white border-[#E68332] p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#E68332] hover:text-[#c36f2a]"
        >
          <h2 className="font-semibold text-2xl">x</h2>
        </button>

        <h2 className="text-2xl font-semibold text-[#E68332] mb-4 text-center">
          नयाँ टिप्पणी थप्नुहोस्
        </h2>

        <form
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-gray-800">विषय</label>
            <input
              type="text"
              name="subject"
              value={currentTippani.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">पेश गर्ने व्यक्ति</label>
            <input
              type="text"
              name="submitted_by"
              value={currentTippani.submitted_by}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">पेश मिति</label>
            <input
              type="text"
              name="submitted_date"
              value={currentTippani.submitted_date}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">कैफियत</label>
            <input
              type="text"
              name="remarks"
              value={currentTippani.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">स्वीकृत गरिएको द्वारा</label>
            <input
              type="text"
              name="approved_by"
              value={currentTippani.approved_by}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">स्वीकृति मिति</label>
            <input
              type="text"
              name="approved_date"
              value={currentTippani.approved_date}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800">टिप्पणी मिति</label>
            <input
              type="text"
              name="tippani_date"
              value={currentTippani.tippani_date}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800">पाना संख्या</label>
            <input
              type="text"
              name="page_no"
              value={currentTippani.page_no}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          {/* File input */}
          <div>
            <label className="block text-gray-800">File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </form>

        <div className="flex items-center gap-5 justify-center my-3">
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-[#E68332] text-white px-6 py-2 rounded-lg hover:bg-[#c36f2a]"
          >
            टिप्पणी पेश गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default TippaniFormModal;
