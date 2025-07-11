import React, { useEffect, useState } from "react";
import registerdetails from "./registerdetails.json";
import { useContext } from "react";
import { ApiContext } from "../config/baseUrl";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const Registration = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState([]);
  const [tempDistrict, setTemptDistrict] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [tempMunicipalities, setTempMunicipalities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null); // Add state to track selected office
  const [selectedProvince, setSelectedProvince] = useState("");
  const [datePickerKey, setDatePickerKey] = useState(0);
  const loanType = [
    {
      value: "Other Loan",
      name: "Other Loan",
    },
    {
      value: "Pregnancy Loan",
      name: "Pregnancy Loan",
    },
    {
      value: "Home Loan",
      name: "Home Loan",
    },
  ];
  const educationLevel = ["SLC", "+2", "Bachelor", "Master", "PhD"];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    grand_father_name: "",
    mother_name: "",
    username: "",
    password: "",
    email: "",
    perm_state: "",
    perm_district: "",
    perm_municipality: "",
    perm_ward_no: "",
    temp_state: "",
    temp_district: "",
    temp_municipality: "",
    temp_ward_no: "",
    citizenship_id: "",
    citizenship_date_of_issue: "",
    citizenship_district: "",
    home_number: "",
    phone_number: "",
    mobile_number: "",
    date_joined: "",
    recess_date: "",
    position: "",
    position_category: "",
    employee_id: "",
    employee_type: "",
    na_la_kos_no: "",
    accumulation_fund_no: "",
    bank_account_no: "",
    bank_name: "",
    duration: "",
    office: "",
    department: "",
    faat: "", // Add faat field
    user_type: "",
    loan_type: "",
    loan_name: "",
    interest_rate: "",
    max_amount: "",
    min_amount: "",
    max_tenure: "",
    min_tenure: "",
    education_level: "",
    institution: "",
    board: "",
    percentage: "",
    year: "",
    award_name: "",
    award_description: "",
    punishment_name: "",
    punishment_description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchProvince();
    fetchOffice();
  }, []);

  useEffect(() => {
    if (formData.office) {
      fetchDepartment(formData.office);
    }
  }, [formData.office]);

  useEffect(() => {
    if (formData.department) {
      fetchFaats(formData.department);
    }
  }, [formData.department]);

  const fetchProvince = async () => {
    try {
      const response = await fetch(`${baseUrl}/provinces/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchDistrict = async (province) => {
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistrict(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchTempDistrict = async (province) => {
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTemptDistrict(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchMunicipality = async (district) => {
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${selectedProvince}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchTempMunicipality = async (district) => {
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${selectedProvince}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTempMunicipalities(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchOffice = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchDepartment = async (officeId) => {
    try {
      const response = await fetch(`${baseUrl}/offices/${officeId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched Office Data:", data);

      // Directly set departments from the response
      setDepartments(data.departments || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]); // Prevents UI crashes
    }
  };

  const fetchFaats = async (departmentId) => {
    try {
      // Use the same pattern as fetchDepartment - direct URL path instead of query parameter
      const response = await fetch(`${baseUrl}/department/${departmentId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      console.log("Fetched Department Data:", data);

      // Extract faats from department response, similar to how departments are extracted from office
      setFaats(data.faats || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching faats:", error);
      setFaats([]); // Prevents UI crashes
    
      // Fallback to the old query parameter approach if the direct approach fails
      try {
        console.log("Trying fallback approach for faats...");
        const fallbackResponse = await fetch(`${baseUrl}/faat/?department=${departmentId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fetched faats (fallback):", fallbackData);
          setFaats(Array.isArray(fallbackData) ? fallbackData : []);
        }
      } catch (fallbackError) {
        console.error("Fallback approach also failed:", fallbackError);
      }
    }
  };

  const handleOfficeChange = (e) => {
    const { value } = e.target;
    
    // Find the selected office object
    const officeObj = offices.find(office => office.id.toString() === value);
    setSelectedOffice(officeObj);
    
    setFormData((prevData) => ({
      ...prevData,
      office: value,
      department: "",
      faat: "", // Reset faat when office changes
    }));
    
    // Clear departments and faats when office changes
    setDepartments([]);
    setFaats([]);
  };

  // Enhance the department change handler to fetch faats
  const handleDepartmentChange = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      department: value,
      faat: "",
    }));

    // Only fetch faats if it's a head office and department is selected
    if (value && selectedOffice?.is_head_office) {
      fetchFaats(value);
    } else {
      setFaats([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      loan: {
        loan_type: formData.loan_type,
        name: formData.loan_name,
        interest_rate: parseFloat(formData.interest_rate),
        max_amount: parseFloat(formData.max_amount),
        min_amount: parseFloat(formData.min_amount),
        max_tenure: parseInt(formData.max_tenure, 10),
        min_tenure: parseInt(formData.min_tenure, 10),
      },
      education: {
        education_level: formData.education_level,
        institution: formData.institution,
        board: formData.board,
        percentage: parseFloat(formData.percentage),
        year: parseInt(formData.year, 10),
      },
      awards: {
        name: formData.award_name,
        description: formData.award_description,
      },
      punishments: {
        name: formData.punishment_name,
        description: formData.punishment_description,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/user/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      console.log(formattedData);
      if (response.ok) {
        const result = await response.json();
        alert("Form submitted successfully!");
        window.location.reload();
        console.log(result);
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "perm_state") {
      setMunicipalities([]);
      fetchDistrict(event.target.value);
    } else {
      setTempMunicipalities([]);
      fetchTempDistrict(value);
    }
  };

  const handleDistrictChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "perm_district") {
      fetchMunicipality(event.target.value);
    } else {
      fetchTempMunicipality(value);
    }
  };

  const handleMunicipalityChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNepaliDateChange = (field, value, bsDate) => {
    setFormData((prev) => ({
      ...prev,
      [field]: bsDate || value,
    }));
  };

  return (
    <form
      className="md:w-[90%] w-full mx-auto p-6 space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-[#E68332]">कर्मचारी दर्ता फारम</h1>
      
      {/* Add explanatory text for required fields */}
      <div className="text-sm text-gray-600 italic mb-4">
        <span className="text-red-500">*</span> चिन्ह भएका फिल्डहरू अनिवार्य छन्
      </div>

      {/* Account Information */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          व्यक्तिगत जानकारी
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              पहिलो नाम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              अन्तिम नाम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              बुबाको नाम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              आमाको नाम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              हजुरबुबाको नाम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="grand_father_name"
              value={formData.grand_father_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          खाता जानकारी
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              युसरनेम <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              पासवर्ड <span className="text-red-500">*</span>
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              इमेल <span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          
          {/* Office, Department, Faat, and User Level - Mark as required */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              कार्यालय <span className="text-red-500">*</span>
            </span>
            <select
              name="office"
              value={formData.office}
              onChange={handleOfficeChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">कार्यालय छान्नुहोस्</option>
              {offices.map((office, index) => (
                <option key={index} value={office.id}>
                  {office.name} {office.is_head_office ? "(मुख्य)" : "(शाखा)"}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              विभाग {selectedOffice?.is_head_office && <span className="text-red-500">*</span>}
            </span>
            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!formData.office}
              required={selectedOffice?.is_head_office} // Only required for head offices
            >
              <option value="">विभाग छान्नुहोस्</option>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              ) : (
                <option disabled>कुनै विभाग उपलब्ध छैन</option>
              )}
            </select>
            {formData.office && !selectedOffice?.is_head_office && (
              <p className="text-sm text-yellow-600 mt-1">
                यो शाखा कार्यालय भएकोले विभाग छनोट वैकल्पिक छ
              </p>
            )}
          </label>

          {/* Only show faat selection for head offices */}
          {selectedOffice?.is_head_office && (
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                फाँट <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-1">(मुख्य कार्यालयमा मात्र)</span>
              </span>
              <select
                name="faat"
                value={formData.faat}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={!formData.department}
                required
              >
                <option value="">फाँट छान्नुहोस्</option>
                {faats.length > 0 ? (
                  faats.map((faat) => (
                    <option key={faat.id} value={faat.id}>
                      {faat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>कुनै फाँट उपलब्ध छैन</option>
                )}
              </select>
              {formData.department && faats.length === 0 && (
                <p className="text-sm text-orange-500 mt-1">
                  यस विभागमा कुनै फाँट छैन। कृपया पहिले फाँट थप्नुहोस्。
                </p>
              )}
            </label>
          )}

          {/* Show notice for branch offices */}
          {selectedOffice && !selectedOffice.is_head_office && (
            <div className="col-span-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                यो शाखा कार्यालय भएकोले फाँट असाइन गर्न सकिदैन। केवल मुख्य कार्यालयमा मात्र फाँट व्यवस्थापन गर्न सकिन्छ。
              </p>
            </div>
          )}

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              युसर लेवल <span className="text-red-500">*</span>
            </span>
            <select
              onChange={handleChange}
              name="user_type"
              value={formData.user_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">लेवल छान्नुहोस्</option>
              <option value={1}>फाँट</option>
              <option value={2}>शाखा प्रमुख</option>
              <option value={3}>शाखा अधिकारी</option>
              <option value={4}>विभाग प्रमुख</option>
              <option value={5}>प्रशासक</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* Permanent Address - Remove required indicators and attributes */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          स्थायी ठेगाना (Permanent Address)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              प्रोविंस
            </span>
            <select
              name="perm_state"
              value={formData.perm_state}
              onChange={handleProvinceChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a Province</option>{" "}
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              जिल्ला
            </span>
            <select
              name="perm_district"
              value={formData.perm_district}
              onChange={handleDistrictChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a district</option>{" "}
              {district.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              नगरपालिका
            </span>
            <select
              name="perm_municipality"
              value={formData.perm_municipality}
              onChange={handleMunicipalityChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a municipalities</option>{" "}
              {municipalities.map((municipalities, index) => (
                <option key={index} value={municipalities}>
                  {municipalities}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              वार्ड नं.
            </span>
            <input
              type="text"
              name="perm_ward_no"
              value={formData.perm_ward_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          अस्थायी ठेगाना (Temporary Address)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">प्रोविंस</span>

            <select
              name="temp_state"
              value={formData.temp_state}
              onChange={handleProvinceChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a Province</option>{" "}
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">जिल्ला</span>

            <select
              name="temp_district"
              value={formData.temp_district}
              onChange={handleDistrictChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a district</option>{" "}
              {tempDistrict.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">नगरपालिका</span>

            <select
              name="temp_municipality"
              value={formData.temp_municipality}
              onChange={handleMunicipalityChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a municipalities</option>{" "}
              {tempMunicipalities.map((municipalities, index) => (
                <option key={index} value={municipalities}>
                  {municipalities}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">वार्ड नं.</span>
            <input
              type="text"
              name="temp_ward_no"
              value={formData.temp_ward_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          नागरिकता जानकारी (Citizenship Information)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            नागरिकता आईडी
            <input
              type="text"
              name="citizenship_id"
              value={formData.citizenship_id}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            जारी मिति
            <NepaliDatePicker
              key={datePickerKey + "citizenship_date_of_issue"}
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.citizenship_date_of_issue || ""}
              onChange={(value, { bsDate }) =>
                handleNepaliDateChange("citizenship_date_of_issue", value, bsDate)
              }
              options={{ calenderLocale: "ne", valueLocale: "en" }}
              name="citizenship_date_of_issue"
            />
          </label>
          <label className="flex flex-col">
            जारी गरेको जिल्ला
            <input
              type="text"
              name="citizenship_district"
              value={formData.citizenship_district}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          सम्पर्क जानकारी
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            घर नम्बर
            <input
              type="text"
              name="home_number"
              value={formData.home_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            फोन नम्बर
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            मोबाइल नम्बर
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          काम विवरण
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            सामेल भएको मिति
            <NepaliDatePicker
              key={datePickerKey + "date_joined"}
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.date_joined || ""}
              onChange={(value, { bsDate }) =>
                handleNepaliDateChange("date_joined", value, bsDate)
              }
              options={{ calenderLocale: "ne", valueLocale: "en" }}
              name="date_joined"
            />
          </label>
          <label className="flex flex-col">
            अवकाश मिति(Recess Date)
            <NepaliDatePicker
              key={datePickerKey + "recess_date"}
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.recess_date || ""}
              onChange={(value, { bsDate }) =>
                handleNepaliDateChange("recess_date", value, bsDate)
              }
              options={{ calenderLocale: "ne", valueLocale: "en" }}
              name="recess_date"
            />
          </label>
          <label className="flex flex-col">
            पोसिशन
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            पोसिशन श्रेणी:
            <select
              onChange={handleChange}
              name="position_category"
              value={formData.position_category}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>सेलेक्ट पोसिशन श्रेणी</option>

              <option value={"Darbandi"}>Darbandi</option>
              <option value={"Kaaj"}>Kaaj</option>
            </select>
          </label>
          <label className="flex flex-col">
            कर्मचारी आईडी
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            कर्मचारी प्रकार
            <select
              onChange={handleChange}
              name="employee_type"
              value={formData.employee_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select employee type</option>
              {registerdetails.employment_types.map((types, index) => (
                <option value={types} key={index}>
                  {types}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            अवधि
            <NepaliDatePicker
              key={datePickerKey + "duration"}
              inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.duration || ""}
              onChange={(value, { bsDate }) =>
                handleNepaliDateChange("duration", value, bsDate)
              }
              options={{ calenderLocale: "ne", valueLocale: "en" }}
              name="duration"
            />
          </label>

          {/* Removed office, department, faat, and user_type fields from here */}
          {/* They have been moved to the खाता जानकारी (Account Information) section */}
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          बैंक विवरण
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Na La Kos No:
            <input
              type="text"
              name="na_la_kos_no"
              value={formData.na_la_kos_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            संचय कोष नं.
            <input
              type="text"
              name="accumulation_fund_no"
              value={formData.accumulation_fund_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            बैंक खाता नं.
            <input
              type="text"
              name="bank_account_no"
              value={formData.bank_account_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            बैंक नाम
            <select
              onChange={handleChange}
              name="bank_name"
              value={formData.bank_name}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option className="bg-gray-400">select bank</option>
              {registerdetails.banks.map((banks, index) => (
                <option value={banks} key={index}>
                  {banks}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          ऋण जानकारी
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            ऋण प्रकार
            <select
              onChange={handleChange}
              name="loan_type"
              value={formData.loan_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select loan type</option>
              {loanType.map((types, index) => (
                <option value={types.value} key={index}>
                  {types.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            ऋण नाम
            <input
              type="text"
              name="loan_name"
              value={formData.loan_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            ब्याज दर
            <input
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            अधिकतम रकम
            <input
              type="number"
              name="max_amount"
              value={formData.max_amount}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            न्यूनतम रकम
            <input
              type="number"
              name="min_amount"
              value={formData.min_amount}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            अधिकतम कार्यकाल
            <input
              type="number"
              name="max_tenure"
              value={formData.max_tenure}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            न्यूनतम कार्यकाल
            <input
              type="number"
              name="min_tenure"
              value={formData.min_tenure}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">शिक्षा</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            शिक्षा स्तर
            <select
              onChange={handleChange}
              name="education_level"
              value={formData.education_level}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select education Level</option>
              {educationLevel.map((types, index) => (
                <option value={types} key={index}>
                  {types}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            संस्था
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            बोर्ड
            <input
              type="text"
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            प्रतिशत
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            वर्ष
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          पुरस्कार
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            पुरस्कार नाम
            <input
              type="text"
              name="award_name"
              value={formData.award_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            विवरण
            <input
              type="text"
              name="award_description"
              value={formData.award_description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">सजाय</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            सजायको नाम
            <input
              type="text"
              name="punishment_name"
              value={formData.punishment_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            विवरण
            <input
              type="text"
              name="punishment_description"
              value={formData.punishment_description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full bg-[#E68332] text-white font-semibold py-2 rounded hover:bg-[#c27434] transition"
      >
        पेश गर्नुहोस्
      </button>
    </form>
  );
};

export default Registration;
