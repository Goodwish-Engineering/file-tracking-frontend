import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LAND_TYPE_CHOICES = [
  { value: "अधिनस्थ", label: "अधिनस्थ" },
  { value: "रैतानी", label: "रैतानी" },
  { value: "तैनाथी", label: "तैनाथी" },
];

const LandDetailsForm = ({ onSuccess }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const fileId = localStorage.getItem("fileId");
  const [offices, setOffices] = useState([]);
  const [formData, setFormData] = useState({
    district: "",
    municipality: "",
    ward_no: "",
    kitta_no: "",
    guthi_name: "", // This will store the office ID
    land_type: "",
    related_file: fileId,
  });

  // Fetch offices data only
  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/offices/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.data) {
          setOffices(response.data);
        }
      } catch (error) {
        console.error("Error fetching Office data:", error);
        toast.error("Error fetching office data");
      }
    };

    fetchOfficeData();
  }, [baseUrl, token]);

  // Update related_file whenever fileId changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      related_file: fileId,
    }));
  }, [fileId]);

  // Simple input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure we're using the latest fileId
      const currentFileId = localStorage.getItem("fileId");

      // Find office name for guthi_name field
      const selectedOffice = offices.find(
        (office) => office.id.toString() === formData.guthi_name
      );
      const guthiName = selectedOffice ? selectedOffice.name : null;

      // Create the payload with proper data types
      const payload = {
        district: formData.district || null,
        municipality: formData.municipality || null,
        ward_no: formData.ward_no ? parseInt(formData.ward_no) : null,
        kitta_no: formData.kitta_no || null,
        guthi_name: guthiName, // Send office name as string
        land_type: formData.land_type || "other",
        related_file: parseInt(currentFileId),
      };

      console.log("Submitting land details:", payload);

      const response = await fetch(`${baseUrl}/land-details/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);

        // Create a more user-friendly error message
        let errorMessage = "जग्गा विवरण थप्न असफल: ";
        if (errorData.detail) {
          errorMessage += errorData.detail;
        } else if (errorData.error) {
          errorMessage += errorData.error;
        } else {
          // Handle field-specific errors
          const fieldErrors = [];
          Object.keys(errorData).forEach((field) => {
            if (Array.isArray(errorData[field])) {
              fieldErrors.push(`${field}: ${errorData[field].join(", ")}`);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage += fieldErrors.join("; ");
          } else {
            errorMessage += "अज्ञात त्रुटि";
          }
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);

      toast.success("जग्गा विवरण सफलतापूर्वक थपियो!");

      // Reset the form
      setFormData({
        district: "",
        municipality: "",
        ward_no: "",
        kitta_no: "",
        guthi_name: "",
        land_type: "",
        related_file: currentFileId,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting land details:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 mb-6 w-[90%] md:w-[80%] mx-auto bg-white rounded-lg shadow-inner shadow-gray-200">
      <h1 className="text-center text-xl font-bold text-[#E68332] mb-6">
        जग्गा विवरण
      </h1>
      <form
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-gray-800 font-medium mb-2">
            जिल्ला
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            placeholder="जिल्लाको नाम लेख्नुहोस्"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            नगरपालिका
          </label>
          <input
            type="text"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            placeholder="नगरपालिकाको नाम लेख्नुहोस्"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            वार्ड नं
          </label>
          <input
            type="number"
            name="ward_no"
            value={formData.ward_no}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            placeholder="वार्ड नम्बर लेख्नुहोस्"
            min="1"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            कित्ता नं
          </label>
          <input
            type="text"
            name="kitta_no"
            value={formData.kitta_no}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            placeholder="कित्ता नम्बर लेख्नुहोस्"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            गुठी नाम <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="guthi_name"
              value={formData.guthi_name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-8"
              required
            >
              <option value="">गुठी छान्नुहोस्</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            जग्गा प्रकार <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="land_type"
              value={formData.land_type}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E68332] focus:border-transparent appearance-none bg-white pr-8"
              required
            >
              <option value="">जग्गा प्रकार छान्नुहोस्</option>
              {LAND_TYPE_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#E68332] text-white px-8 py-3 rounded-lg hover:bg-[#c36f2a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 text-lg font-medium"
          >
            पेश गर्नुहोस्
          </button>
        </div>
      </form>
    </div>
  );
};

export default LandDetailsForm;
