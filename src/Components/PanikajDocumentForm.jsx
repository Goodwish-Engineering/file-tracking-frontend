import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PanjikaDocumentsForm = ({ onClose, isOpen }) => {
  // Add modal functionality
  if (!isOpen) return null;

  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const fileId = localStorage.getItem("fileId");
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
  const [datePickerKey, setDatePickerKey] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNepaliDateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Date field ${field} updated:`, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create payload, ensuring date fields are properly formatted
    const payload = { ...formData, related_file: fileId };

    // Log the payload to debug date values
    console.log("Submitting document data:", payload);

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          Authorization: token ? `token ${token.trim()}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      if (response.status === 201) {
        toast.success("Panjika documents added successfully");
      }
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

      // Close the modal after submission
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

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

        <h1 className="text-center text-xl font-bold text-[#E68332] mb-6">
          पञ्जिका डकुमेन्ट्स
        </h1>
        <form
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-gray-800">विषय</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800">दर्ता नं.</label>
            <input
              type="text"
              name="registration_no"
              value={formData.registration_no}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800">कार्यालय</label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800">चलनी नं</label>
            <input
              type="text"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800">मिति</label>
            <NepaliDatePicker
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              name="date"
              value={formData.date}
              onSelect={(value) => {
                handleNepaliDateChange("date", value);
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "bs", // BS format for Bikram Sambat
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800">पत्र मिति</label>
            <NepaliDatePicker
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              name="letter_date"
              value={formData.letter_date}
              onSelect={(value) => {
                handleNepaliDateChange("letter_date", value);
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "bs",
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800">कुल पाना संख्या</label>
            <input
              type="number"
              name="page_no"
              value={formData.page_no}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-center gap-5">
            <button
              type="submit"
              className="mt-4 bg-[#E68332] text-white px-4 rounded-lg py-2 hover:bg-[#c36F2a]"
            >
              पेश गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PanjikaDocumentsForm;
