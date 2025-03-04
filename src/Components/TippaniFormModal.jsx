import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TippaniFormModal = ({ isOpen, onClose, fileId }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
    // console.log(fileId);
  const navigate = useNavigate('');
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
  });
  const [showAddButton, setShowAddButton] = useState(false);

  const handleChange = (e) => {
    setCurrentTippani({
      ...currentTippani,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/tippani/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTippani),
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
      });
      if (response) {
        alert("Tippani added successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving Tippani:", error);
    }
  };

//   const addNewForm = () => {
//     setShowAddButton(false);
//   };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex shadow-inner justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white border-blue-600 p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-700"
        >
          <h2 className="font-semibold text-2xl">x</h2>
        </button>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
          Add New Tippani
        </h2>

        <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Subject", name: "subject", type: "text" },
            { label: "Submitted By", name: "submitted_by", type: "text" },
            { label: "Submitted Date", name: "submitted_date", type: "date" },
            { label: "Remarks", name: "remarks", type: "text" },
            { label: "Approved By", name: "approved_by", type: "text" },
            { label: "Approval Date", name: "approved_date", type: "date" },
            { label: "Tippani Date", name: "tippani_date", type: "date" },
            { label: "Page No", name: "page_no", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-800">
                {label}
              </label>
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
        </form>

        <div className="flex items-center gap-5 justify-center my-3">
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Tippani
          </button>

          {/* {showAddButton && (
            <button
              onClick={addNewForm}
              className="mt-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Another Tippani
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default TippaniFormModal;
