import React, { useEffect, useState } from "react";
import registerdetails from "./registerdetails.json";
import { useContext } from "react";
import { ApiContext } from "../config/baseUrl";
import { useSelector } from "react-redux";

const Registration = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState([]);
  const [tempDistrict, setTemptDistrict] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [tempMunicipalities, setTempMunicipalities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
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

  // Format date input as YYYY-MM-DD
  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
        6,
        8
      )}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name.includes("date") || name.includes("miti") || name === "duration") {
      processedValue = formatDateInput(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
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

  const handleOfficeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      office: value,
      department: "",
    }));
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

  return (
    <form
      className="md:w-[90%] w-full mx-auto p-6 space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-[#E68332]">कर्मचारी दर्ता फारम</h1>

      {/* Account Information */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          व्यक्तिगत जानकारी
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">पहिलो नाम</span>
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
              अन्तिम नाम
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
              बुबाको नाम
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
            <span className="text-sm font-medium text-gray-900">आमाको नाम</span>
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
              हजुरबुबाको नाम
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
            <span className="text-sm font-medium text-gray-900">युसरनेम</span>
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
            <span className="text-sm font-medium text-gray-900">पासवर्ड</span>
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
            <span className="text-sm font-medium text-gray-900">इमेल</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
        </div>
      </fieldset>

      {/* Permanent Address */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          स्थायी ठेगाना (Permanent Address)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">प्रोविंस</span>

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
            <span className="text-sm font-medium text-gray-900">जिल्ला</span>

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
            <span className="text-sm font-medium text-gray-900">नगरपालिका</span>

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
            <span className="text-sm font-medium text-gray-900">वार्ड नं.</span>
            <input
              type="text"
              name="perm_ward_no"
              value={formData.perm_ward_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
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
            <input
              type="text"
              name="citizenship_date_of_issue"
              value={formData.citizenship_date_of_issue}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <input
              type="text"
              name="date_joined"
              value={formData.date_joined}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            अवकाश मिति(Recess Date)
            <input
              type="text"
              name="recess_date"
              value={formData.recess_date}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              maxLength="10"
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>

          <label className="flex flex-col">
            कार्यालय
            <select
              name="office"
              value={formData.office}
              onChange={handleOfficeChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select an Office</option>
              {offices.map((office, index) => (
                <option key={index} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            विभाग
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!formData.office}
            >
              <option value="">Select a Department</option>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              ) : (
                <option disabled>No departments available</option>
              )}
            </select>
          </label>

          <label className="flex flex-col">
            युसर लेवल
            <select
              onChange={handleChange}
              name="user_type"
              value={formData.user_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select level </option>

              <option value={1}>Faat</option>
              <option value={2}>Branch Head</option>
              <option value={3}>Branch officer</option>
              <option value={4}>Division Head</option>
              <option value={5}>Admin</option>
            </select>
          </label>
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
