import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaFile, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";
import UniversalInput from "../components/ui/UniversalInput";
import { useSimpleForm } from "../hooks/useSimpleForm";
import { validateRequired } from "../utils/helpers";

const FileDetails = ({ setShowButton, clearData }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const empId = localStorage.getItem("userId");

  const { values: formData, errors, handleChange, setValue, validate } = useSimpleForm({
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

  const [dropdownData, setDropdownData] = useState({
    provinces: [],
    districts: [],
    municipalities: [],
    offices: [],
    departments: [],
    faats: [],
    fileTypes: []
  });

  const [selectedOffice, setSelectedOffice] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [provincesRes, officesRes, fileTypesRes] = await Promise.all([
          fetch(`${baseUrl}/province/`),
          fetch(`${baseUrl}/offices/`, { headers: { Authorization: `Token ${token}` } }),
          fetch(`${baseUrl}/file-type/`, { headers: { Authorization: `Token ${token}` } })
        ]);

        const [provinces, offices, fileTypes] = await Promise.all([
          provincesRes.json(),
          officesRes.json(),
          fileTypesRes.json()
        ]);

        setDropdownData(prev => ({
          ...prev,
          provinces: provinces || [],
          offices: offices || [],
          fileTypes: fileTypes || []
        }));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("डाटा लोड गर्न समस्या भयो");
      }
    };

    fetchInitialData();
  }, [baseUrl, token]);

  // Handle cascading dropdowns
  const handleFieldChange = async (e) => {
    const { name, value } = e.target;
    handleChange(e);

    if (name === "province") {
      setValue("district", "");
      setValue("municipality", "");
      setDropdownData(prev => ({ ...prev, districts: [], municipalities: [] }));
      
      if (value) {
        try {
          const response = await fetch(`${baseUrl}/district/?province=${value}`);
          const districts = await response.json();
          setDropdownData(prev => ({ ...prev, districts: districts || [] }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    }

    if (name === "district") {
      setValue("municipality", "");
      setDropdownData(prev => ({ ...prev, municipalities: [] }));
      
      if (value) {
        try {
          const response = await fetch(`${baseUrl}/municipality/?district=${value}`);
          const municipalities = await response.json();
          setDropdownData(prev => ({ ...prev, municipalities: municipalities || [] }));
        } catch (error) {
          console.error("Error fetching municipalities:", error);
        }
      }
    }

    if (name === "related_guthi") {
      setValue("related_department", "");
      setValue("related_faat", "");
      
      const office = dropdownData.offices.find(office => office.id.toString() === value);
      setSelectedOffice(office);
      
      if (office?.departments) {
        setDropdownData(prev => ({ ...prev, departments: office.departments, faats: [] }));
      }
    }

    if (name === "related_department") {
      setValue("related_faat", "");
      
      if (selectedOffice?.is_head_office && value) {
        try {
          const response = await fetch(`${baseUrl}/faat/?department=${value}`, {
            headers: { Authorization: `Token ${token}` }
          });
          const faats = await response.json();
          setDropdownData(prev => ({ ...prev, faats: faats || [] }));
        } catch (error) {
          console.error("Error fetching faats:", error);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationRules = {
      file_name: { required: true, message: "फाइल नाम आवश्यक छ" },
      subject: { required: true, message: "विषय आवश्यक छ" },
      province: { required: true, message: "प्रदेश आवश्यक छ" },
      district: { required: true, message: "जिल्ला आवश्यक छ" },
      municipality: { required: true, message: "नगरपालिका आवश्यक छ" },
      ward_no: { required: true, message: "वार्ड नं आवश्यक छ" },
      submitted_by: { required: true, message: "जिम्मेवार व्यक्ति आवश्यक छ" },
      present_date: { required: true, message: "हालको मिति आवश्यक छ" },
      related_guthi: { required: true, message: "कार्यालय आवश्यक छ" },
      related_department: { required: true, message: "विभाग आवश्यक छ" }
    };

    if (!validate(validationRules)) {
      toast.error("कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/file/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("फाइल सफलतापूर्वक थपियो!");
        if (setShowButton) setShowButton(false);
        if (clearData) clearData();
      } else {
        toast.error("फाइल थप्न असफल");
      }
    } catch (error) {
      console.error("Error submitting file:", error);
      toast.error("फाइल पेश गर्न समस्या भयो");
    }
  };

  const formFields = [
    // File Information
    {
      section: "फाइल जानकारी",
      icon: <BsFileEarmark />,
      fields: [
        { name: "file_type", label: "फाइल प्रकार", type: "select", options: dropdownData.fileTypes, icon: <FaFile /> },
        { name: "file_name", label: "फाइल नाम", placeholder: "फाइलको नाम लेख्नुहोस्", required: true, icon: <FaFile /> },
        { name: "subject", label: "विषय", placeholder: "फाइलको विषय लेख्नुहोस्", required: true, icon: <MdSubject /> },
        { name: "submitted_by", label: "जिम्मेवार व्यक्ति", placeholder: "जिम्मेवार व्यक्तिको नाम लेख्नुहोस्", required: true, icon: <FaUserCircle /> },
        { name: "present_date", label: "हालको मिति", type: "date", placeholder: "YYYY-MM-DD", required: true, icon: <FaCalendarAlt /> }
      ]
    },
    // Location Information
    {
      section: "स्थान जानकारी",
      icon: <FaMapMarkerAlt />,
      fields: [
        { name: "province", label: "प्रदेश", type: "select", options: dropdownData.provinces, required: true, icon: <FaMapMarkerAlt /> },
        { name: "district", label: "जिल्ला", type: "select", options: dropdownData.districts, required: true, icon: <FaMapMarkerAlt /> },
        { name: "municipality", label: "नगरपालिका", type: "select", options: dropdownData.municipalities, required: true, icon: <FaMapMarkerAlt /> },
        { name: "ward_no", label: "वार्ड नं", placeholder: "वार्ड नम्बर राख्नुहोस्", required: true, icon: <FaMapMarkerAlt /> },
        { name: "tole", label: "टोल", placeholder: "टोलको नाम राख्नुहोस्", icon: <FaMapMarkerAlt /> }
      ]
    },
    // Office Information
    {
      section: "कार्यालय जानकारी",
      icon: <FaBuilding />,
      fields: [
        { 
          name: "related_guthi", 
          label: "कार्यालय", 
          type: "select", 
          options: dropdownData.offices.map(office => ({
            ...office,
            name: `${office.name} ${office.is_head_office ? "(मुख्य)" : "(शाखा)"}`
          })), 
          required: true, 
          icon: <FaBuilding /> 
        },
        { 
          name: "related_department", 
          label: selectedOffice?.is_head_office ? "महाशाखा" : "शाखा", 
          type: "select", 
          options: dropdownData.departments, 
          required: true, 
          icon: <FaBuilding /> 
        },
        ...(selectedOffice?.is_head_office ? [{
          name: "related_faat", 
          label: "शाखा", 
          type: "select", 
          options: dropdownData.faats, 
          icon: <FaBuilding /> 
        }] : [])
      ]
    }
  ];

  return (
    <div className="w-[95%] md:w-[85%] mt-4 md:mt-5 mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-8 border-l-4 border-[#ED772F]">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-3 text-[#ED772F]">
          फाइल विवरण फारम
        </h1>
        <div className="text-center">
          <p className="text-red-500 font-medium">
            सम्भव भएसम्म सबैलाई नेपालीमा फारम भर्न अनुरोध छ।
          </p>
          <p className="text-gray-600 text-sm">
            (Everyone is requested to fill out the form in Nepali if possible.)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-red-500 font-bold">*</span>
            चिन्ह भएका फिल्ड अनिवार्य छन्
          </p>
        </div>

        {formFields.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border-b pb-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              {section.icon}
              <span className="ml-2">{section.section}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className={field.name === "subject" ? "md:col-span-2" : ""}>
                  <UniversalInput
                    {...field}
                    value={formData[field.name]}
                    onChange={handleFieldChange}
                    error={errors[field.name]}
                    disabled={field.type === 'select' && field.options.length === 0 && field.name !== 'province'}
                  />
                </div>
              ))}
            </div>

            {selectedOffice && !selectedOffice.is_head_office && section.section === "कार्यालय जानकारी" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  यो शाखा कार्यालय भएकोले शाखा छनोट उपलब्ध छैन
                </p>
              </div>
            )}
          </div>
        ))}

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#ED772F] text-white rounded-lg hover:bg-[#d9773b] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 text-lg font-medium"
          >
            <BsFileEarmark />
            रेकर्ड थप्नुहोस्
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileDetails;
