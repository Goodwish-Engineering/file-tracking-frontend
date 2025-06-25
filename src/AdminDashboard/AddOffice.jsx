import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaPlus,
  FaBuilding,
  FaLayerGroup,
  FaCheck,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import AddDepartOfOffice from "./AddDepartOfOffice";
import DisplayEditOffice from "./DisplayEditOffice";
import axios from "axios";
import { toast } from "react-toastify";

const AddOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [departments, setDepartments] = useState([
    {
      name: "",
      code: "",
      faats: [{ name: "", code: "" }], // Remove belongs_to from faats - they belong to department via department ID
    },
  ]);
  const [officeId, setOfficeId] = useState(null);
  const [buttonSubmitted, setButtonSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCodeChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentNameChange = (index, e) => {
    const newDepartments = [...departments];
    newDepartments[index].name = e.target.value;
    setDepartments(newDepartments);
  };
  const handleDepartmentCodeChange = (index, e) => {
    const newDepartments = [...departments];
    newDepartments[index].code = e.target.value;
    setDepartments(newDepartments);
  };

  const handleFaatNameChange = (departmentIndex, faatIndex, e) => {
    const newDepartments = [...departments];
    newDepartments[departmentIndex].faats[faatIndex] = {
      ...newDepartments[departmentIndex].faats[faatIndex],
      name: e.target.value,
    };
    setDepartments(newDepartments);
  };

  // New handler for faat code changes
  const handleFaatCodeChange = (departmentIndex, faatIndex, e) => {
    const newDepartments = [...departments];
    newDepartments[departmentIndex].faats[faatIndex] = {
      ...newDepartments[departmentIndex].faats[faatIndex],
      code: e.target.value,
    };
    setDepartments(newDepartments);
  };

  const addDepartmentField = () => {
    setDepartments([...departments, { name: "" }]);
  };

  const removeDepartmentField = (indexToRemove) => {
    // Prevent removing the last department field
    if (departments.length > 1) {
      setDepartments(departments.filter((_, index) => index !== indexToRemove));
    }
  };

  const addFaatField = (departmentIndex) => {
    const newDepartments = [...departments];
    newDepartments[departmentIndex].faats.push({
      name: "",
      code: "",
      // Remove belongs_to - faats are linked to departments via the department ID in the API call
    });
    setDepartments(newDepartments);
  };

  const removeFaatField = (departmentIndex, faatIndex) => {
    if (departments[departmentIndex].faats.length <= 1) return; // Keep at least one faat field

    const newDepartments = [...departments];
    newDepartments[departmentIndex].faats.splice(faatIndex, 1);
    setDepartments(newDepartments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validation
    if (!formData.name.trim()) {
      toast.error("कृपया कार्यालयको नाम हाल्नुहोस्");
      return;
    }

    // Check for empty departments
    const emptyDepartments = departments.filter((dept) => !dept.name.trim());
    if (emptyDepartments.length > 0) {
      toast.error("कृपया सबै विभागको नाम हाल्नुहोस् वा हटाउनुहोस्");
      return;
    }

    // Check for empty faats
    let hasEmptyFaats = false;
    departments.forEach((dept) => {
      if (dept.faats.some((faat) => !faat.name.trim() || !faat.code.trim())) {
        hasEmptyFaats = true;
      }
    });

    if (hasEmptyFaats) {
      toast.error("कृपया सबै फाँटको नाम र कोड हाल्नुहोस् वा हटाउनुहोस्");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. First create the office
      const response = await axios.post(`${baseUrl}/offices/`, formData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.data) {
        const newOfficeId = response.data.id;
        setOfficeId(newOfficeId);

        // 2. Then create departments for this office
        for (const department of departments) {
          if (department.name.trim() !== "") {
            const deptResponse = await axios.post(
              `${baseUrl}/department/`,
              { ...department, belongs_to: newOfficeId },
              { headers: { Authorization: `Token ${token}` } }
            );

            // 3. Create faats for this department
            const departmentId = deptResponse.data.id;
            for (const faat of department.faats) {
              if (faat.name.trim() !== "") {
                await axios.post(
                  `${baseUrl}/faat/`,
                  { name: faat.name, code: faat.code, belongs_to: departmentId }, // Use belongs_to instead of department
                  { headers: { Authorization: `Token ${token}` } }
                );
              }
            }
          }
        }

        setDataUpdated(true);
        setButtonSubmitted(true);
        toast.success("कार्यालय, विभाग र फाँट सफलतापूर्वक थपिए!");
        setSuccessMessage("Office, departments and faats added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setDataUpdated(false);
        }, 3000);

        // Reset form fields
        setFormData({ name: "", code: "" });
        setDepartments([{ name: "", code: "", faats: [{ name: "", code: "" }] }]); // Remove belongs_to from reset
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("डाटा थप्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto gap-6 p-4 min-h-screen bg-gray-50">
      {/* Add Office Form Section */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
          <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
            <h2 className="text-center font-bold text-2xl text-[#E68332] flex items-center justify-center gap-3">
              <FaBuilding className="text-[#E68332]" />
              कार्यालय, विभाग र फाँट व्यवस्थापन
            </h2>
            <p className="text-center text-gray-600 mt-1">
              नयाँ कार्यालय, सम्बन्धित विभागहरू र फाँटहरू थप्नुहोस्
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Office section */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="font-medium text-lg text-gray-800 mb-3 flex items-center">
                <FaBuilding className="mr-2 text-[#E68332]" />
                कार्यालय विवरण
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="mb-4">
                  <label className="text-gray-800 font-medium mb-2 flex items-center">
                    <span className="mr-1">कोड</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder="कार्यालयको कोड यहाँ लेख्नुहोस्"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-800 font-medium mb-2 flex items-center">
                    <span className="mr-1">कार्यालयको नाम</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder="कार्यालयको नाम यहाँ लेख्नुहोस्"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Departments and Faats section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-lg text-gray-800 flex items-center">
                  <FaLayerGroup className="mr-2 text-[#E68332]" />
                  विभाग र फाँटहरू
                </h3>
                <button
                  type="button"
                  onClick={() => setDepartments([...departments, { name: "", code: "", faats: [{ name: "", code: "" }] }])}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 flex items-center gap-1 text-sm transition-colors"
                >
                  <FaPlus size={12} />
                  <span>नयाँ विभाग</span>
                </button>
              </div>

              {/* Map through departments and their faats */}
              {departments.map((department, departmentIndex) => (
                <div
                  key={departmentIndex}
                  className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">विभाग #{departmentIndex + 1}</h4>
                    {departments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newDepartments = [...departments];
                          newDepartments.splice(departmentIndex, 1);
                          setDepartments(newDepartments);
                        }}
                        className="text-red-500 hover:bg-red-100 p-1 rounded-md"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {/* Department fields */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <input
                      type="text"
                      value={department.code}
                      onChange={(e) => {
                        const newDepartments = [...departments];
                        newDepartments[departmentIndex].code = e.target.value;
                        setDepartments(newDepartments);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                      placeholder={`विभाग कोड`}
                      required
                    />
                    <input
                      type="text"
                      value={department.name}
                      onChange={(e) => {
                        const newDepartments = [...departments];
                        newDepartments[departmentIndex].name = e.target.value;
                        setDepartments(newDepartments);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                      placeholder={`विभागको नाम`}
                      required
                    />
                  </div>

                  {/* Faats section */}
                  <div className="ml-6 border-l-2 border-blue-300 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center">
                        <FaLayerGroup className="mr-2 text-blue-500" />
                        फाँटहरू
                      </h5>
                      <button
                        type="button"
                        onClick={() => addFaatField(departmentIndex)}
                        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 flex items-center gap-1 text-xs transition-colors"
                      >
                        <FaPlus size={10} />
                        <span>फाँट थप्नुहोस्</span>
                      </button>
                    </div>

                    {/* Map through faats for this department */}
                    {department.faats.map((faat, faatIndex) => (
                      <div key={faatIndex} className="flex items-center gap-2 mb-2 group">
                        {/* Add code input for faat */}
                        <input
                          type="text"
                          value={faat.code}
                          onChange={(e) => handleFaatCodeChange(departmentIndex, faatIndex, e)}
                          className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`फाँट #${faatIndex + 1} कोड`}
                          required
                        />
                        <input
                          type="text"
                          value={faat.name}
                          onChange={(e) => handleFaatNameChange(departmentIndex, faatIndex, e)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`फाँट #${faatIndex + 1} नाम`}
                          required
                        />
                        {department.faats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaatField(departmentIndex, faatIndex)}
                            className="text-red-500 p-1 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    ))}

                    <p className="text-xs text-gray-500 italic mt-1">
                      प्रत्येक विभागमा कम्तिमा एउटा फाँट हुनुपर्छ
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className={`px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-[#E68332] hover:bg-[#c36f2a]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    प्रतिक्रिया पर्खँदै...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    सुरक्षित गर्नुहोस्
                  </>
                )}
              </button>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center animate-pulse">
                <p className="font-medium flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500" />
                  {successMessage}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Display/Edit Section */}
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DisplayEditOffice dataUpdated={dataUpdated} />
        </div>
      </div>
    </div>
  );
};

export default AddOffice;
