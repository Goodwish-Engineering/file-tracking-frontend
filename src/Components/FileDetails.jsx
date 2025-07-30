import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaFile,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";
import DateInputField from "../components/Common/DateInputField";

const FileDetails = ({ setShowButton, clearData }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const empId = localStorage.getItem("userId");
  const [show, setShow] = useState(true);

  const [formData, setFormData] = useState({
    file_name: "",
    subject: "",
    province: "",
    district: "",
    municipality: "",
    ward_no: "",
    tole: "",
    present_by: empId,
    submitted_by: "",
    present_date: "",
    related_guthi: "",
    related_department: "",
    related_faat: "",
    file_type: "",
  });

  const inputRefs = {
    file_name: useRef(null),
    subject: useRef(null),
    ward_no: useRef(null),
    tole: useRef(null),
    submitted_by: useRef(null),
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [fileTypes, setFileTypeData] = useState([]);
  const [datePickerKey, setDatePickerKey] = useState(0);

  const clearFields = () => {
    setFormData({
      file_name: "",
      subject: "",
      province: "",
      district: "",
      municipality: "",
      ward_no: "",
      tole: "",
      present_by: empId,
      submitted_by: "",
      present_date: "",
      related_guthi: "",
      related_department: "",
      related_faat: "",
      file_type: "",
    });

    // Clear all input fields manually
    Object.values(inputRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
  };

  // Fix: Use NepaliDatePicker with a unique key to force re-mount on clear
  // Add a state to force re-mounting the date picker when clearData changes
  useEffect(() => {
    clearFields();
    setShow(true);
    setDatePickerKey((prev) => prev + 1); // force re-mount of date picker
  }, [clearData]);

  // Fetch provinces and office data on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${baseUrl}/provinces/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    const fetchOfficeData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/offices/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.data) {
          setOfficeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Office data:", error);
        alert("Error fetching office data");
      }
    };
    const fetchFileTypes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/file-type/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.data) {
          setFileTypeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Office data:", error);
        alert("Error fetching office data");
      }
    };
    fetchProvinces();
    fetchOfficeData();
    fetchFileTypes();
  }, [baseUrl, token]);

  const fetchDistricts = async (province) => {
    if (!province) return;
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchMunicipalities = async (district) => {
    if (!district || !formData.province) return;
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${formData.province}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  // Update handleBlur to support both normal and date picker fields
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date field changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select inputs (which still use controlled approach)
  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("value:", name, value);

    if (name === "province") {
      // Reset district and municipality values
      if (inputRefs.district?.current) {
        inputRefs.district.current.value = "";
      }
      if (inputRefs.municipality?.current) {
        inputRefs.municipality.current.value = "";
      }

      setFormData((prev) => ({
        ...prev,
        district: "",
        municipality: "",
      }));

      setDistricts([]);
      setMunicipalities([]);
      fetchDistricts(value);
    }

    if (name === "district") {
      // Reset municipality value
      if (inputRefs.municipality?.current) {
        inputRefs.municipality.current.value = "";
      }

      setFormData((prev) => ({
        ...prev,
        municipality: "",
      }));

      setMunicipalities([]);
      fetchMunicipalities(value);
    }

    if (name === "related_guthi") {
      // Reset department and faat values
      setFormData((prev) => ({
        ...prev,
        related_department: "",
        related_faat: "",
      }));

      // Find and store the selected office object
      const selectedOfficeObj = officeData.find(
        (office) => office.id.toString() === value
      );
      setSelectedOffice(selectedOfficeObj);

      // Find departments for the selected office
      if (selectedOfficeObj && selectedOfficeObj.departments) {
        setDepartments(selectedOfficeObj.departments);
      } else {
        setDepartments([]);
      }
      setFaats([]); // Clear faats when office changes
    }

    if (name === "related_department") {
      // Reset faat value
      setFormData((prev) => ({
        ...prev,
        related_faat: "",
      }));

      // Only fetch faats if it's a head office
      if (selectedOffice?.is_head_office) {
        fetchFaats(value);
      } else {
        setFaats([]);
      }
    }
  };

  // Add fetchFaats function
  const fetchFaats = async (departmentId) => {
    if (!departmentId) {
      setFaats([]);
      return;
    }

    try {
      // Try direct department fetch first
      const response = await fetch(`${baseUrl}/department/${departmentId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Department Data:", data);
        
        // Extract faats from department response
        setFaats(data.faats || []); // Ensure it's always an array
      } else {
        // Fallback to the query parameter approach if direct fetch fails
        console.log("Trying fallback approach for faats...");
        const fallbackResponse = await fetch(`${baseUrl}/faat/?department=${departmentId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fetched faats (fallback):", fallbackData);
          setFaats(Array.isArray(fallbackData) ? fallbackData : []);
        } else {
          console.error("Fallback also failed");
          setFaats([]);
        }
      }
    } catch (error) {
      console.error("Error fetching faats:", error);
      setFaats([]); // Prevents UI crashes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only sync text input values from refs, not present_date
    const updatedFormData = { ...formData };
    Object.keys(inputRefs).forEach((name) => {
      if (inputRefs[name]?.current) {
        updatedFormData[name] = inputRefs[name].current.value;
      }
    });

    // Now use the updated form data
    const formDataToSend = new FormData();

    Object.keys(updatedFormData).forEach((key) => {
      formDataToSend.append(key, updatedFormData[key]);
    });

    try {
      const response = await fetch(`${baseUrl}/files/upload/`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `token ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("File details submitted successfully!");
        localStorage.setItem("fileId", data.id);
        setShow(false);
        // Remove the redirection toast
      } else {
        console.error("Server error:", data);
        toast.error("Failed to submit file details.");
      }
    } catch (error) {
      console.error("Error submitting file details:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Inline the FormField component functionality directly
  const renderSelectField = (label, name, options = [], placeholder, required = false, icon) => (
    <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
      <label htmlFor={name} className="block font-medium text-gray-700 mb-2 items-center">
        {icon && <span className="mr-2 text-[#ED772F]">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleSelectChange}
        className={`w-full border ${
          required && !formData[name] ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] focus:border-[#ED772F] transition-all duration-200 outline-none text-gray-700`}
        disabled={options.length === 0 && name !== "province"}
        required={required}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option
            key={typeof option === "object" ? option.id : option}
            value={typeof option === "object" ? option.id.toString() : option}
          >
            {typeof option === "object" ? option.name : option}
          </option>
        ))}
      </select>
      {required && !formData[name] && (
        <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
      )}
    </div>
  );

  const renderInputField = (label, name, type = "text", placeholder, required = false, icon) => (
    <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
      <label htmlFor={name} className="block font-medium text-gray-700 mb-2 items-center">
        {icon && <span className="mr-2 text-[#ED772F]">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        defaultValue={formData[name]}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] focus:border-[#ED772F] transition-all duration-200 outline-none text-gray-700"
        placeholder={placeholder}
        ref={inputRefs[name]}
        required={required}
      />
    </div>
  );

  return (
    <div className="w-[95%] md:w-[85%] mt-4 md:mt-5 md:my-10 mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-8 border-l-4 border-[#ED772F]">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-3 text-[#ED772F]">
          फारामको विवरण
        </h1>
        <div className="flex md:flex-row flex-col gap-2">
          <p className="text-red-500 text-lg font-normal text-center">
            सम्भव भएसम्म सबैलाई नेपालीमा फारम भर्न अनुरोध छ。
          </p>
          <p className="text-gray-600 text-lg font-normal text-center">
            (Everyone is requested to fill out the form in Nepali if possible.)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-red-500 font-bold">*</span>
            चिन्ह भएका फिल्ड अनिवार्य छन्
          </p>
        </div>

        {/* File Information Section */}
        <div className="border-b pb-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
            <BsFileEarmark className="mr-2 text-[#ED772F]" />
            फाइल जानकारी
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderSelectField(
              "फाइल प्रकार",
              "file_type",
              fileTypes,
              "फाइल प्रकार छान्नुहोस्",
              false,
              <FaFile />
            )}

            {renderInputField(
              "फाइल नाम",
              "file_name",
              "text",
              "फाइलको नाम लेख्नुहोस्",
              true,
              <FaFile />
            )}

            {renderInputField(
              "विषय",
              "subject",
              "text",
              "फाइलको विषय लेख्नुहोस्",
              true,
              <MdSubject />
            )}

            {renderInputField(
              "फाइलको जिम्मेवार व्यक्ति",
              "submitted_by",
              "text",
              "जिम्मेवार व्यक्तिको नाम लेख्नुहोस्",
              true,
              <FaUserCircle />
            )}

            <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
              <label className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-[#ED772F]" />
                हालको मिति
                <span className="text-red-500 ml-1">*</span>
              </label>
              <DateInputField
                name="present_date"
                value={formData.present_date}
                onChange={handleDateChange}
                placeholder="YYYY-MM-DD (उदाहरण: 2081-05-15)"
                primaryColor="orange-500"
                className="w-full"
              />
              {!formData.present_date && (
                <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="border-b pb-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-[#ED772F]" />
            स्थान जानकारी
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderSelectField(
              "प्रदेश",
              "province",
              provinces,
              "प्रदेश छान्नुहोस्",
              true,
              <FaMapMarkerAlt />
            )}

            {renderSelectField(
              "जिल्ला",
              "district",
              districts,
              "जिल्ला छान्नुहोस्",
              true,
              <FaMapMarkerAlt />
            )}

            {renderSelectField(
              "नगरपालिका",
              "municipality",
              municipalities,
              "नगरपालिका छान्नुहोस्",
              true,
              <FaMapMarkerAlt />
            )}

            {renderInputField(
              "वार्ड नं",
              "ward_no",
              "text",
              "वार्ड नम्बर राख्नुहोस्",
              true,
              <FaMapMarkerAlt />
            )}

            {renderInputField(
              "टोल",
              "tole",
              "text",
              "टोलको नाम राख्नुहोस्",
              false,
              <FaMapMarkerAlt />
            )}
          </div>
        </div>

        {/* Office Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
            <FaBuilding className="mr-2 text-[#ED772F]" />
            कार्यालय जानकारी
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderSelectField(
              "कार्यालय",
              "related_guthi",
              officeData.map(office => ({
                ...office,
                name: `${office.name} ${office.is_head_office ? "(मुख्य)" : "(शाखा)"}`
              })),
              "कार्यालय छान्नुहोस्",
              true,
              <FaBuilding />
            )}

            {renderSelectField(
              selectedOffice?.is_head_office ? "महाशाखा" : "शाखा",
              "related_department",
              departments,
              selectedOffice?.is_head_office ? "महाशाखा छान्नुहोस्" : "शाखा छान्नुहोस्",
              true,
              <FaBuilding />
            )}

            {selectedOffice?.is_head_office && renderSelectField(
              "शाखा",
              "related_faat",
              faats,
              "शाखा छान्नुहोस्",
              false,
              <FaBuilding />
            )}

            {selectedOffice && !selectedOffice.is_head_office && (
              <div className="col-span-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  यो शाखा कार्यालय भएकोले महाशाखा छनोट उपलब्ध छैन
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {show && (
            <button
              type="submit"
              className="px-8 py-3 bg-[#ED772F] text-white rounded-lg hover:bg-[#d9773b] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 text-lg font-medium"
            >
              <BsFileEarmark />
              रेकर्ड थप्नुहोस्
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FileDetails;
