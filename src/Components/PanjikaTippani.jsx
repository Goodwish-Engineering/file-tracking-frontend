import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

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
  const [datePickerKey, setDatePickerKey] = useState(0);

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
      alert("Panjika Tippani added successfully");
    } catch (error) {
      console.error("Error saving Tippani:", error);
    }
  };

  const addNewForm = () => {
    setShowAddButton(false);
  };

  const handleNepaliDateChange = (field, value, bsDate) => {
    setCurrentTippani((prev) => ({
      ...prev,
      [field]: bsDate || value,
    }));
  };

  return (
    <div className="p-4 w-[90%] md:w-[80%] mx-auto my-4 bg-white shadow-gray-200 rounded-lg shadow-inner border-2">
      <h1 className="text-center font-bold text-2xl mb-6 text-[#E68332]">
        पञ्जिका विवरण टिप्नी
      </h1>
      <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800 font-medium">विषय</label>
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
          <label className="block text-gray-800 font-medium">पेश गर्ने व्यक्ति</label>
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
          <label className="block text-gray-800 font-medium">पेश मिति</label>
          <NepaliDatePicker
            key={datePickerKey + "submitted_date"}
            inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={currentTippani.submitted_date || ""}
            onChange={(value, { bsDate }) =>
              handleNepaliDateChange("submitted_date", value, bsDate)
            }
            options={{ calenderLocale: "ne", valueLocale: "bs" }}
            name="submitted_date"
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
            required
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
            required
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium">स्वीकृति मिति</label>
          <NepaliDatePicker
            key={datePickerKey + "approved_date"}
            inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={currentTippani.approved_date || ""}
            onChange={(value, { bsDate }) =>
              handleNepaliDateChange("approved_date", value, bsDate)
            }
            options={{ calenderLocale: "ne", valueLocale: "bs" }}
            name="approved_date"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium">टिप्पणी मिति</label>
          <NepaliDatePicker
            key={datePickerKey + "tippani_date"}
            inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={currentTippani.tippani_date || ""}
            onChange={(value, { bsDate }) =>
              handleNepaliDateChange("tippani_date", value, bsDate)
            }
            options={{ calenderLocale: "ne", valueLocale: "bs" }}
            name="tippani_date"
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
          पेश गर्नुहोस्
        </button>

        {/* {showAddButton && (
          <button
            onClick={addNewForm}
            className="mt-1 bg-[#B3F8CC] text-white px-4 py-2 rounded-lg hover:bg-[#89c29e]"
          >
            अर्को पेश गर्नुहोस्
          </button>
        )} */}
      </div>
    </div>
  );
};

export default PanjikaTippani;
