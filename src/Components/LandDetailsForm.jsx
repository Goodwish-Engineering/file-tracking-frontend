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
    guthi_name: "",
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

      // Create the payload with the current fileId
      const payload = {
        ...formData,
        related_file: currentFileId,
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
        throw new Error(
          `Failed to submit land details: ${JSON.stringify(errorData)}`
        );
      }

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
      toast.error(`जग्गा विवरण थप्न असफल: ${error.message}`);
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
          <label className="block text-gray-800">जिल्ला</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-800">नगरपालिका</label>
          <input
            type="text"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-800">वार्ड नं</label>
          <input
            type="number"
            name="ward_no"
            value={formData.ward_no}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-800">कित्ता नं</label>
          <input
            type="text"
            name="kitta_no"
            value={formData.kitta_no}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-800">गुठी नाम</label>
          <select
            name="guthi_name"
            value={formData.guthi_name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">गुठी छान्नुहोस्</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-800">जग्गा प्रकार</label>
          <select
            name="land_type"
            value={formData.land_type}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">जग्गा प्रकार छान्नुहोस्</option>
            {LAND_TYPE_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-[#E68332] text-white px-6 py-2 rounded-lg hover:bg-[#c36f2a]"
          >
            पेश गर्नुहोस्
          </button>
        </div>
      </form>
    </div>
  );
};

export default LandDetailsForm;
