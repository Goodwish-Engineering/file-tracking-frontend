import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    file: null,
  });

  const [showNewForm, setShowNewForm] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(0);

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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    } else if (name.includes("date") || name.includes("miti")) {
      const formattedValue = formatDateInput(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          Authorization: token ? `token ${token.trim()}` : "",
        },
        body: formDataToSend, // Use FormData
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

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
        file: null,
      });

      // Remove this line as we don't want to show new form automatically
      // setShowNewForm(true);

      toast.success("Letters and document added successfully");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error.message}`);
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
          <span className="text-2xl font-bold text-[#E86332] hover:text-[#c36f2a]">
            ×
          </span>
        </button>

        <h2 className="text-2xl font-semibold text-[#E86332] mb-2 text-center">
          नयाँ कागजात थप्नुहोस्
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "दर्ता नम्बर",
                name: "registration_no",
                type: "text",
              },
              { label: "चलनी नं", name: "invoice_no", type: "text" },
              { label: "चलनी नम्बर", name: "date", type: "date" },
              { label: "विषय", name: "subject", type: "text" },
              { label: "पत्र मिति", name: "letter_date", type: "date" },
              { label: "कार्यालय", name: "office", type: "text" },
              { label: "पाना संख्या", name: "page_no", type: "number" },
              { label: "फाइल", name: "file", type: "file" },
            ].map(({ label, name, type }) => (
              <div key={name} className="mb-2">
                <label className="block text-gray-800 mb-2">{label}</label>
                {type === "date" ? (
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleInputChange}
                    placeholder="YYYY-MM-DD"
                    maxLength="10"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={type !== "file" ? formData[name] : undefined}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    {...(type === "file"
                      ? { accept: "application/pdf, image/*" }
                      : {})}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#E86332] text-white rounded hover:bg-[#c36f2a]"
            >
              कागजात थप्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentFormModal;
