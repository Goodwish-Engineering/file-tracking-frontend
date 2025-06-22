import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PanjikaTippani = ({ isOpen, onClose }) => {
  // Add modal functionality
  if (!isOpen) return null;

  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const fileId = localStorage.getItem("fileId");
  const token = localStorage.getItem("token");
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

  const handleChange = (e) => {
    setCurrentTippani({
      ...currentTippani,
      [e.target.name]: e.target.value,
    });
  };

  const handleNepaliDateChange = (field, value) => {
    setCurrentTippani((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Date field ${field} updated:`, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a clean payload for the API
      const payload = { ...currentTippani, related_file: fileId };

      // Log the payload to verify data is correct
      console.log("Submitting Tippani data:", payload);

      // Make the API request
      const response = await fetch(`${baseUrl}/tippani/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to save Tippani: ${JSON.stringify(errorData)}`);
      }

      // Process successful response
      const newTippani = await response.json();
      setTippanis([...tippanis, newTippani]);

      // Reset form fields after successful submission
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

      toast.success("पञ्जिका टिप्पणी सफलतापूर्वक थपियो");

      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error saving Tippani:", error);
      toast.error(`त्रुटि: ${error.message}`);
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

        <h1 className="text-center font-bold text-2xl mb-6 text-[#E68332]">
          पञ्जिका विवरण टिप्नी
        </h1>
        <form
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-gray-800 font-medium">विषय</label>
            <input
              type="text"
              name="subject"
              value={currentTippani.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">पेश गर्ने व्यक्ति</label>
            <input
              type="text"
              name="submitted_by"
              value={currentTippani.submitted_by}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">पेश मिति</label>
            <NepaliDatePicker
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              name="submitted_date"
              value={currentTippani.submitted_date}
              onSelect={(value) => {
                handleNepaliDateChange("submitted_date", value);
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "en",
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">कैफियत</label>
            <input
              type="text"
              name="remarks"
              value={currentTippani.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">स्वीकृत गरिएको द्वारा</label>
            <input
              type="text"
              name="approved_by"
              value={currentTippani.approved_by}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">स्वीकृति मिति</label>
            <NepaliDatePicker
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              name="approved_date"
              value={currentTippani.approved_date}
              onSelect={(value) => {
                handleNepaliDateChange("approved_date", value);
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "en",
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">टिप्पणी मिति</label>
            <NepaliDatePicker
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              name="tippani_date"
              value={currentTippani.tippani_date}
              onSelect={(value) => {
                handleNepaliDateChange("tippani_date", value);
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "en",
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium">पाना संख्या</label>
            <input
              type="text"
              name="page_no"
              value={currentTippani.page_no}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-5 justify-center my-3">
            <button
              type="submit"
              className="bg-[#E68332] text-white px-6 py-2 rounded-lg hover:bg-[#c36f2a]"
            >
              पेश गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PanjikaTippani;
