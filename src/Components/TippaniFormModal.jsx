import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    file: null, // Change from empty string to null
  });
  const [showAddButton, setShowAddButton] = useState(false);

  // Handle input changes, including file selection
  const handleChange = (e) => {
    if (e.target.name === "file") {
      setCurrentTippani({
        ...currentTippani,
        file: e.target.files[0], // Correctly store the file
      });
    } else {
      setCurrentTippani({
        ...currentTippani,
        [e.target.name]: e.target.value,
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

      alert("Tippani added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error saving Tippani:", error);
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
          {[
            { label: "विषय", name: "subject", type: "text" },
            { label: "पेश गर्ने व्यक्ति", name: "submitted_by", type: "text" },
            { label: "पेश मिति", name: "submitted_date", type: "date" },
            { label: "टिप्पणी", name: "remarks", type: "text" },
            {
              label: "स्वीकृत गरिएको द्वारा",
              name: "approved_by",
              type: "text",
            },
            { label: "स्वीकृति मिति", name: "approved_date", type: "date" },
            { label: "टिप्पणी मिति", name: "tippani_date", type: "date" },
            { label: "पृष्ठ नं", name: "page_no", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-800">{label}</label>
              <input
                type={type}
                name={name}
                value={currentTippani[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          ))}

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
