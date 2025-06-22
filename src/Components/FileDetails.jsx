import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
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
import { GrStatusInfo } from "react-icons/gr";
import { MdSubject } from "react-icons/md";

const FileDetails = ({ setShowButton, clearData }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const empId = localStorage.getItem("userId");
  const userid = localStorage.getItem("userId");
  const [show, setShow] = useState(true);

  // Add missing state variable
  const [useManualDateInput, setUseManualDateInput] = useState(false);

  // This state will be used to track the current values
  const [formData, setFormData] = useState({
    file_name: "",
    subject: "",
    province: "",
    district: "",
    municipality: "",
    ward_no: "",
    tole: "",
    present_by: empId,
    submitted_by: "", // Already exists in state, ensure it's used in the form
    present_date: "",
    related_guthi: "",
    related_department: "",
    file_type: "",
  });

  // Form input references for direct DOM access
  const inputRefs = {
    file_name: useRef(null),
    subject: useRef(null),
    ward_no: useRef(null),
    tole: useRef(null),
    submitted_by: useRef(null), // Reference already exists, ensure it's used properly
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fileTypes, setFileTypeData] = useState([]);
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
      submitted_by: "", // Make sure this is cleared
      present_date: "",
      related_guthi: "",
      related_department: "",
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
  const [datePickerKey, setDatePickerKey] = useState(0);

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
      // Reset department value
      setFormData((prev) => ({
        ...prev,
        related_department: "",
      }));

      // Find departments for the selected office
      const selectedOffice = officeData.find(
        (office) => office.id.toString() === value
      );
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
      } else {
        setDepartments([]);
      }
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

  // Create form field component with uncontrolled inputs for text fields
  const FormField = ({
    label,
    name,
    type,
    options = [],
    placeholder,
    required = false,
    icon,
  }) => {
    if (type === "select") {
      return (
        <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
          <label
            htmlFor={name}
            className="block font-medium text-gray-700 mb-2 items-center"
          >
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
                value={
                  typeof option === "object" ? option.id.toString() : option
                }
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
    } else if (type === "nepali-date" || type === "date") {
      return (
        <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md p-2">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor={name}
              className="block font-medium text-gray-700 items-center"
            >
              <FaCalendarAlt className="mr-2 text-[#ED772F]" />
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Toggle between date picker and manual input */}
            <button
              type="button"
              onClick={() => setUseManualDateInput(!useManualDateInput)}
              className="text-xs text-blue-600 hover:underline"
            >
              {useManualDateInput
                ? "प्रयोग गर्नुहोस् पिकर"
                : "म्यानुअल इनपुट प्रयोग गर्नुहोस्"}
            </button>
          </div>

          {useManualDateInput ? (
            // Manual date input option
            <input
              type="text"
              name={name}
              value={formData[name] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [name]: e.target.value }))
              }
              placeholder="YYYY-MM-DD वा YYYY/MM/DD"
              className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] text-gray-700"
              required={required}
            />
          ) : (
            // Nepali Date Picker option
            <NepaliDatePicker
              key={datePickerKey + name}
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] text-gray-700"
              className="w-full"
              name={name}
              value={formData[name]}
              onSelect={(value) => {
                setFormData((prev) => ({ ...prev, [name]: value }));
              }}
              options={{
                calenderLocale: "ne",
                valueLocale: "en",
              }}
            />
          )}

          {required && !formData[name] && (
            <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
          )}
        </div>
      );
    } else {
      // Use uncontrolled components for text inputs
      return (
        <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
          <label
            htmlFor={name}
            className="block font-medium text-gray-700 mb-2  items-center"
          >
            {icon && <span className="mr-2 text-[#ED772F]">{icon}</span>}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            id={name}
            type={type || "text"}
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
    }
  };

  return (
    <>
      <div className="w-[95%] md:w-[85%] mt-4 md:mt-5 md:my-10 mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-8 border-l-4 border-[#ED772F]">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-3 text-[#ED772F]">
            फारामको विवरण
          </h1>
          <div className="flex md:flex-row flex-col gap-2">
            <p className="text-red-500 text-lg font-normal text-center">
              सम्भव भएसम्म सबैलाई नेपालीमा फारम भर्न अनुरोध छ।
            </p>
            <p className="text-gray-600 text-lg font-normal text-center">
              (Everyone is requested to fill out the form in Nepali if
              possible.)
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
              <FormField
                label="फाइल प्रकार"
                name="file_type"
                type="select"
                options={fileTypes}
                placeholder="फाइल प्रकार छान्नुहोस्"
                // required={true}
                icon={<FaFile />}
              />

              <FormField
                label="फाइल नाम"
                name="file_name"
                icon={<FaFile />}
                required={true}
                placeholder="फाइलको नाम लेख्नुहोस्"
              />

              <FormField
                label="विषय"
                name="subject"
                required={true}
                icon={<MdSubject />}
                placeholder="फाइलको विषय लेख्नुहोस्"
              />

              {/* Add the responsible person field here */}
              <FormField
                label="फाइलको जिम्मेवार व्यक्ति"
                name="submitted_by"
                icon={<FaUserCircle />}
                required={true}
                placeholder="जिम्मेवार व्यक्तिको नाम लेख्नुहोस्"
              />

              <FormField
                label="हालको मिति"
                name="present_date"
                type="nepali-date"
                required={true}
              />
            </div>
          </div>

          {/* Location Information Section */}
          <div className="border-b pb-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-[#ED772F]" />
              स्थान जानकारी
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                label="प्रदेश"
                name="province"
                type="select"
                options={provinces}
                placeholder="प्रदेश छान्नुहोस्"
                required={true}
                icon={<FaMapMarkerAlt />}
              />

              <FormField
                label="जिल्ला"
                name="district"
                type="select"
                options={districts}
                placeholder="जिल्ला छान्नुहोस्"
                required={true}
                icon={<FaMapMarkerAlt />}
              />

              <FormField
                label="नगरपालिका"
                name="municipality"
                type="select"
                options={municipalities}
                placeholder="नगरपालिका छान्नुहोस्"
                required={true}
                icon={<FaMapMarkerAlt />}
              />

              <FormField
                label="वार्ड नं"
                name="ward_no"
                placeholder="वार्ड नम्बर राख्नुहोस्"
                required={true}
                icon={<FaMapMarkerAlt />}
              />

              <FormField
                label="टोल"
                name="tole"
                placeholder="टोलको नाम राख्नुहोस्"
                icon={<FaMapMarkerAlt />}
              />
            </div>
          </div>

          {/* Office Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <FaBuilding className="mr-2 text-[#ED772F]" />
              कार्यालय जानकारी
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                label="कार्यालय"
                name="related_guthi"
                type="select"
                options={officeData}
                placeholder="कार्यालय छान्नुहोस्"
                required={true}
                icon={<FaBuilding />}
              />

              <FormField
                label="विभाग"
                name="related_department"
                type="select"
                options={departments}
                placeholder="विभाग छान्नुहोस्"
                required={true}
                icon={<FaBuilding />}
              />
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
    </>
  );
};

export default FileDetails;
