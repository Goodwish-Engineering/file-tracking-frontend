import React, { useState } from "react";
import { useSelector } from "react-redux";

const DocumentFormModal = ({ isOpen, onClose, fileId }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const apiBaseUrl = `${baseUrl}/letter-document/`;

  const [formData, setFormData] = useState({
    registration_no: "",
    invoice_no: "",
    date: "",
    letter_date: "",
    subject: "",
    office: "",
    page_no: "",
    tippani: "",
    related_file: fileId,
  });

  const [showNewForm, setShowNewForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          Authorization: token ? `token ${token.trim()}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setFormData({
        registration_no: "",
        invoice_no: "",
        date: "",
        letter_date: "",
        subject: "",
        office: "",
        page_no: "",
        tippani: "",
        related_file: fileId,
      });

      setShowNewForm(true);

      if(response){
        alert("Letters and document added successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <span className="text-2xl font-bold text-[#E86332] hover:text-[#c36f2a]">×</span>
        </button>

        <h2 className="text-2xl font-semibold text-[#E86332] mb-2 text-center">
          Add New Document
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Registration No", name: "registration_no", type: "text" },
              { label: "Chalani No", name: "invoice_no", type: "text" },
              { label: "Date", name: "date", type: "date" },
              { label: "Subject", name: "subject", type: "text" },
              { label: "Letter Date", name: "letter_date", type: "date" },
              { label: "Office", name: "office", type: "text" },
              { label: "Page No", name: "page_no", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name} className="mb-2">
                <label className="block text-gray-800 mb-2">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#E86332] text-white rounded hover:bg-[#c36f2a]"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentFormModal;
