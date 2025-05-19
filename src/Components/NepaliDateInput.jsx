import React from "react";
import NepaliDatePicker from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";

const NepaliDateInput = ({ value, onChange, name, required, label }) => (
  <div className="mb-4">
    {label && (
      <label className="block font-medium text-gray-800 mb-2" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <NepaliDatePicker
      inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
      value={value}
      onChange={({ bsDate }) => onChange({ target: { name, value: bsDate } })}
      options={{ calenderLocale: "ne", valueLocale: "en" }}
      name={name}
      required={required}
    />
    <small className="text-gray-500 mt-1 block">
      नेपाली मिति (BS) चयन गर्नुहोस्
    </small>
  </div>
);

export default NepaliDateInput;
