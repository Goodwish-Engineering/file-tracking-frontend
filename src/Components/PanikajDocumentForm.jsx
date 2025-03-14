import React, { useState } from "react";
import { useSelector } from "react-redux";

const PanjikaDocumentsForm = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const fileId = localStorage.getItem("fileId");
  const token = localStorage.getItem("token");
  const apiBaseUrl = `${baseUrl}/letter-document/`;
  const [showNewForm, setShowNewForm] = useState(false);
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
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setFormData({
        registration_no: "",
        invoice_no: "",
        date: "",
        letter_date: "",
        subject: "",
        office: "",
        page_no: 0,
        tippani: "",
        related_file: fileId,
      });
      setShowNewForm(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-6 mb-6 w-[90%] md:w-[80%] mx-auto bg-white rounded-lg shadow-inner shadow-gray-200">
      <h1 className="text-center text-xl font-bold text-[#E68332] mb-6">
        पञ्जिका डकुमेन्ट्स
      </h1>
      <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800">विषय</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div>
          <label className="block text-gray-800">मिति</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-800">पत्र मिति</label>
          <input
            type="date"
            name="letter_date"
            value={formData.letter_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-800">कुल पृष्ठहरू</label>
          <input
            type="number"
            name="page_no"
            value={formData.page_no}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
      </form>
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={handleSubmit}
          type="submit"
          className="mt-4 bg-[#E68332] text-white px-4 rounded-lg py-2 hover:bg-[#c36F2a]"
        >
          पेश गर्नुहोस्
        </button>
        {showNewForm && (
          <button
            onClick={() => setShowNewForm(false)}
            className="mt-4 bg-[#B3F8CC] text-white px-4 rounded-lg py-2 hover:bg-[#89c29e]"
          >
            अर्को पेश गर्नुहोस्
          </button>
        )}
      </div>
    </div>
  );
};

export default PanjikaDocumentsForm;
