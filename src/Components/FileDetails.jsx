import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileDetails = ({ setShowButton, clearData, fileType }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const empId = localStorage.getItem("userId");
  const userid = localStorage.getItem("userId");
  // console.log(empId);
  // console.log("user is is:"+userid);
  const [show, setShow] = useState(true);
  
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
    submitted_by: "",
    present_date: "",
    related_guthi: "",
    related_department: "",
  });
  
  // Form input references for direct DOM access
  const inputRefs = {
    file_name: useRef(null),
    subject: useRef(null),
    ward_no: useRef(null),
    tole: useRef(null),
    submitted_by: useRef(null)
  };
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [departments, setDepartments] = useState([]);

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
    });
    
    // Clear all input fields manually
    Object.values(inputRefs).forEach(ref => {
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
    setDatePickerKey(prev => prev + 1); // force re-mount of date picker
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
    
    fetchProvinces();
    fetchOfficeData();
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
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "province") {
      // Reset district and municipality values
      if (inputRefs.district?.current) {
        inputRefs.district.current.value = "";
      }
      if (inputRefs.municipality?.current) {
        inputRefs.municipality.current.value = "";
      }
      
      setFormData(prev => ({ 
        ...prev, 
        district: "", 
        municipality: "" 
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
      
      setFormData(prev => ({ 
        ...prev, 
        municipality: "" 
      }));
      
      setMunicipalities([]);
      fetchMunicipalities(value);
    }
    
    if (name === "related_guthi") {
      // Reset department value
      setFormData(prev => ({ 
        ...prev, 
        related_department: "" 
      }));
      
      // Find departments for the selected office
      const selectedOffice = officeData.find(office => office.id.toString() === value);
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
      } else {
        setDepartments([]);
      }
    }
  };

  // Add file_type to formData if not present
  useEffect(() => {
    if (fileType) {
      setFormData(prev => ({
        ...prev,
        file_type: fileType
      }));
    }
  }, [fileType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    // Only sync text input values from refs, not present_date
    const updatedFormData = { ...formData };
    Object.keys(inputRefs).forEach(name => {
      if (inputRefs[name]?.current) {
        updatedFormData[name] = inputRefs[name].current.value;
      }
    });

    // Ensure file_type is set before submit
    if (fileType) {
      updatedFormData.file_type = fileType;
    }

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
        setShowButton(true);
        setShow(false);
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
  const FormField = ({ label, name, type, options = [], placeholder }) => {
    if (type === "select") {
      return (
        <div className="mb-4">
          <label htmlFor={name} className="block font-medium text-gray-800 mb-2">
            {label}
          </label>
          <select
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleSelectChange}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={options.length === 0 && name !== "province"}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option 
                key={typeof option === 'object' ? option.id : option} 
                value={typeof option === 'object' ? option.id.toString() : option}
              >
                {typeof option === 'object' ? option.name : option}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (type === "nepali-date" || type === "date") {
      return (
        <div className="mb-4">
          <label htmlFor={name} className="block font-medium text-gray-800 mb-2">
            {label} 
          </label>
          <NepaliDatePicker
            // key={datePickerKey + name}
            inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
            className=""
            name="present_date"
            value={formData['present_date']}
              onSelect={(value) => {
                setFormData((prev) => ({...prev, [name]: value }))
              }}

            options={{
              calenderLocale: "ne",
              valueLocale: "bs" // <-- Set to "bs" for Bikram Sambat (BS)
            }}
          />
        </div>
      );
    } else {
      // Use uncontrolled components for text inputs
      return (
        <div className="mb-4">
          <label htmlFor={name} className="block font-medium text-gray-800 mb-2">
            {label}
          </label>
          <input
            id={name}
            type={type || "text"}
            name={name}
            defaultValue={formData[name]} 
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder={placeholder}
            ref={inputRefs[name]}
          />
        </div>
      );
    }
  };

  return (
    <>
      <div className="w-[90%] md:w-[80%] mt-4 md:mt-5 md:my-10 mx-auto p-6">
        <h1 className="text-center text-2xl font-bold mb-6 text-[#ED772F]">
          फारामको विवरण
        </h1>
        <div className="flex md:flex-row flex-col gap-2 mb-4">
          <p className="text-red-500 text-lg font-normal text-center">सम्भव भएसम्म सबैलाई नेपालीमा फारम भर्न अनुरोध छ।</p>
          <p className="text-red-500 text-lg font-normal text-center">(Everyone is requested to fill out the form in Nepali if possible.)</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="फाइल नाम"
              name="file_name" 
              // placeholder="Enter file name"
            />
            
            <FormField 
              label="विषय"
              name="subject" 
              // required={true}
            />
            
            <FormField 
              label="प्रदेश"
              name="province" 
              type="select" 
              options={provinces}
              placeholder="प्रदेश छान्नुहोस्"
              // required={true}
            />
            
            <FormField 
              label="जिल्ला"
              name="district" 
              type="select" 
              options={districts}
              placeholder="जिल्ला छान्नुहोस्"
              // required={true}
            />
            
            <FormField 
              label="नगरपालिका"
              name="municipality" 
              type="select" 
              options={municipalities}
              placeholder="नगरपालिका छान्नुहोस्"
              // required={true}
            />
            
            <FormField 
              label="वार्ड नं"
              name="ward_no" 
              // placeholder="Enter ward number"
              // required={true}
            />
            
            <FormField 
              label="टोल"
              name="tole" 
              // placeholder="Enter tole"
            />
            
            <FormField 
              label="कर्मचारी नाम"
              name="submitted_by" 
              // placeholder="Enter submitter name"
              // required={true}
            />
            
            <FormField 
              label="हालको मिति"
              name="present_date" 
              type="nepali-date"
              // required={true}
            />
            
            <FormField 
              label="कार्यालय"
              name="related_guthi" 
              type="select" 
              options={officeData}
              placeholder="कार्यालय छान्नुहोस्"
              // required={true}
            />
            
            <FormField 
              label="विभाग"
              name="related_department" 
              type="select" 
              options={departments}
              placeholder="विभाग छान्नुहोस्"
              // required={true}
            />
          </div>
          
          <div className="mt-8 flex justify-center">
            {show && (
              <button
                type="submit"
                className="px-6 py-2 bg-[#ED772F] text-white rounded-lg hover:bg-[#d9773b] transition-all"
              >
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