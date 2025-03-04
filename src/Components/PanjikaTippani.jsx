import React, { useState } from "react";
import { useSelector } from "react-redux";

const PanjikaTippani = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const fileId = localStorage.getItem("fileId");
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
    } catch (error) {
      console.error("Error saving Tippani:", error);
    }
  };

  const addNewForm = () => {
    setShowAddButton(false);
  };

  return (
    <div className="p-4 w-[90%] md:w-[80%] mx-auto my-4 bg-white shadow-gray-200 rounded-lg shadow-inner border-2">
      <h1 className="text-center font-bold text-2xl mb-6 text-blue-500">
        Panjika Details Tippani
      </h1>
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
            <label className="block text-gray-800 font-medium">{label}</label>
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

        {showAddButton && (
          <button
            onClick={addNewForm}
            className="mt-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Another Tippani
          </button>
        )}
      </div>
    </div>
  );
};

export default PanjikaTippani;
