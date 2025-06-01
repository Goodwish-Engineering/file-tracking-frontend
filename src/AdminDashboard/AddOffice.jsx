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
  const [departments, setDepartments] = useState([{ name: "", code: "" }]);
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

  const addDepartmentField = () => {
    setDepartments([...departments, { name: "" }]);
  };

  const removeDepartmentField = (indexToRemove) => {
    // Prevent removing the last department field
    if (departments.length > 1) {
      setDepartments(departments.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validation
    if (!formData.name.trim()) {
      toast.error("कृपया कार्यालयको नाम हाल्नुहोस्");
      return;
    }

    const emptyDepartments = departments.filter((dept) => !dept.name.trim());
    if (emptyDepartments.length > 0) {
      toast.error("कृपया सबै विभागको नाम हाल्नुहोस् वा हटाउनुहोस्");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/offices/`, formData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.data) {
        const newOfficeId = response.data.id;
        setOfficeId(newOfficeId);

        for (const department of departments) {
          if (department.name.trim() !== "") {
            await axios.post(
              `${baseUrl}/department/`,
              { ...department, belongs_to: newOfficeId },
              {
                headers: { Authorization: `Token ${token}` },
              }
            );
          }
        }
        setDataUpdated(true);
        setButtonSubmitted(true);
        toast.success("कार्यालय र विभागहरू सफलतापूर्वक थपिए!");
        setSuccessMessage("Office and departments added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setDataUpdated(false);
        }, 3000);

        // Reset form fields
        setFormData({ name: "", code: "" });
        setDepartments([{ name: "", code: "" }]);
      }
    } catch (error) {
      console.error("Error saving office or department:", error);
      toast.error("कार्यालय थप्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।");
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
              कार्यालय र विभाग व्यवस्थापन
            </h2>
            <p className="text-center text-gray-600 mt-1">
              नयाँ कार्यालय र सम्बन्धित विभागहरू थप्नुहोस्
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-6">
                <label className="text-gray-800 font-medium mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-[#E68332]" />
                  कोड
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleCodeChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                  placeholder="कार्यालयको कोड यहाँ लेख्नुहोस्"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="text-gray-800 font-medium mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-[#E68332]" />
                  कार्यालयको नाम
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                  placeholder="कार्यालयको नाम यहाँ लेख्नुहोस्"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-800 font-medium flex items-center">
                  <FaLayerGroup className="mr-2 text-[#E68332]" />
                  विभागहरू
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={addDepartmentField}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 flex items-center gap-1 text-sm transition-colors"
                >
                  <FaPlus size={12} />
                  <span>नयाँ विभाग</span>
                </button>
              </div>

              {departments.map((department, index) => (
                <div key={index} className="flex items-center gap-2 mb-3 group">
                  <input
                    type="text"
                    value={department.code}
                    onChange={(e) => handleDepartmentCodeChange(index, e)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder={`विभाग #${index + 1} कोड`}
                    required
                  />
                  <input
                    type="text"
                    value={department.name}
                    onChange={(e) => handleDepartmentNameChange(index, e)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder={`विभाग #${index + 1} नाम`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeDepartmentField(index)}
                    className={`text-red-500 p-2 rounded-md hover:bg-red-100 transition-colors ${
                      departments.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={departments.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <p className="text-sm text-gray-500 italic mt-1">
                कम्तिमा एउटा विभाग हुनुपर्छ
              </p>
            </div>

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

      {/* Display/Edit Section - Now positioned below the form */}
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DisplayEditOffice dataUpdated={dataUpdated} />
        </div>
      </div>
    </div>
  );
};

export default AddOffice;
