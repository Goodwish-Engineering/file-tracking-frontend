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
import DisplayEditOffice from "./DisplayEditOffice";
import axios from "axios";
import { toast } from "react-toastify";

const AddOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [formData, setFormData] = useState({ name: "", code: "", is_head_office: false });
  const [departments, setDepartments] = useState([
    {
      name: "",
      code: "",
      faats: [{ name: "", code: "" }],
    },
  ]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const updateDepartment = (index, field, value) => {
    const newDepartments = [...departments];
    newDepartments[index][field] = value;
    setDepartments(newDepartments);
  };

  const updateFaat = (deptIndex, faatIndex, field, value) => {
    const newDepartments = [...departments];
    newDepartments[deptIndex].faats[faatIndex][field] = value;
    setDepartments(newDepartments);
  };

  const addDepartment = () => {
    setDepartments([
      ...departments,
      { 
        name: "", 
        code: "", 
        faats: formData.is_head_office ? [{ name: "", code: "" }] : [] 
      }
    ]);
  };

  const removeDepartment = (indexToRemove) => {
    if (departments.length > 1) {
      setDepartments(departments.filter((_, index) => index !== indexToRemove));
    }
  };

  const addFaat = (departmentIndex) => {
    const newDepartments = [...departments];
    newDepartments[departmentIndex].faats.push({ name: "", code: "" });
    setDepartments(newDepartments);
  };

  const removeFaat = (departmentIndex, faatIndex) => {
    if (departments[departmentIndex].faats.length <= 1) return;
    
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

    const emptyDepartments = departments.filter((dept) => !dept.name.trim());
    if (emptyDepartments.length > 0) {
      toast.error("कृपया सबै विभागको नाम हाल्नुहोस् वा हटाउनुहोस्");
      return;
    }

    if (formData.is_head_office) {
      let hasEmptyFaats = false;
      departments.forEach((dept) => {
        if (dept.faats.some((faat) => !faat.name.trim() || !faat.code.trim())) {
          hasEmptyFaats = true;
        }
      });

      if (hasEmptyFaats) {
        toast.error("कृपया सबै शाखाको नाम र कोड हाल्नुहोस् वा हटाउनुहोस्");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/offices/`, formData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.data) {
        const newOfficeId = response.data.id;

        for (const department of departments) {
          if (department.name.trim() !== "") {
            const deptResponse = await axios.post(
              `${baseUrl}/department/`,
              { ...department, belongs_to: newOfficeId },
              { headers: { Authorization: `Token ${token}` } }
            );

            if (formData.is_head_office) {
              const departmentId = deptResponse.data.id;
              for (const faat of department.faats) {
                if (faat.name.trim() !== "") {
                  await axios.post(
                    `${baseUrl}/faat/`,
                    { name: faat.name, code: faat.code, belongs_to: departmentId },
                    { headers: { Authorization: `Token ${token}` } }
                  );
                }
              }
            }
          }
        }

        setDataUpdated(true);
        toast.success("कार्यालय, विभाग र शाखा सफलतापूर्वक थपिए!");
        
        setTimeout(() => {
          setDataUpdated(false);
        }, 3000);

        setFormData({ name: "", code: "", is_head_office: false });
        setDepartments([{ name: "", code: "", faats: [{ name: "", code: "" }] }]);
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
              कार्यालय, विभाग र शाखा व्यवस्थापन
            </h2>
            <p className="text-center text-gray-600 mt-1">
              नयाँ कार्यालय, सम्बन्धित विभागहरू र शाखाहरू थप्नुहोस्
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Office section */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="font-medium text-lg text-gray-800 mb-3 flex items-center">
                <FaBuilding className="mr-2 text-[#E68332]" />
                कार्यालय विवरण
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    कोड <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder="कार्यालयको कोड यहाँ लेख्नुहोस्"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    कार्यालयको नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder="कार्यालयको नाम यहाँ लेख्नुहोस्"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_head_office"
                    checked={formData.is_head_office}
                    onChange={handleChange}
                    className="mr-3 h-4 w-4 text-[#E68332] focus:ring-[#E68332] border-gray-300 rounded"
                  />
                  <span className="text-gray-800 font-medium">यो मुख्य कार्यालय हो</span>
                </label>
                <p className="text-sm text-gray-500 mt-1 ml-7">
                  {formData.is_head_office 
                    ? "मुख्य कार्यालयमा मात्र शाखाहरू थप्न सकिन्छ" 
                    : "सामान्य कार्यालयमा शाखाहरू थप्न सकिदैन"}
                </p>
              </div>
            </div>

            {/* Departments and Faats section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-lg text-gray-800 flex items-center">
                  <FaLayerGroup className="mr-2 text-[#E68332]" />
                  महाशाखा/शाखा {formData.is_head_office ? "र शाखाहरू" : ""}
                </h3>
                <button
                  type="button"
                  onClick={addDepartment}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 flex items-center gap-1 text-sm transition-colors"
                >
                  <FaPlus size={12} />
                  <span>{formData.is_head_office ? "नयाँ महाशाखा" : "नयाँ शाखा"}</span>
                </button>
              </div>

              {!formData.is_head_office && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <FaLayerGroup className="mr-2" />
                    यो सामान्य कार्यालय भएकोले शाखाहरू थप्न सकिदैन। केवल मुख्य कार्यालयमा मात्र शाखाहरू व्यवस्थापन गर्न सकिन्छ。
                  </p>
                </div>
              )}

              {departments.map((department, departmentIndex) => (
                <div key={departmentIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">
                      {formData.is_head_office ? "महाशाखा" : "शाखा"} #{departmentIndex + 1}
                    </h4>
                    {departments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDepartment(departmentIndex)}
                        className="text-red-500 hover:bg-red-100 p-1 rounded-md"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <input
                      type="text"
                      value={department.code}
                      onChange={(e) => updateDepartment(departmentIndex, 'code', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                      placeholder={formData.is_head_office ? "महाशाखा कोड" : "शाखा कोड"}
                      required
                    />
                    <input
                      type="text"
                      value={department.name}
                      onChange={(e) => updateDepartment(departmentIndex, 'name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                      placeholder={formData.is_head_office ? "महाशाखाको नाम" : "शाखाको नाम"}
                      required
                    />
                  </div>

                  {formData.is_head_office && (
                    <div className="ml-6 border-l-2 border-blue-300 pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700 flex items-center">
                          <FaLayerGroup className="mr-2 text-blue-500" />
                          शाखाहरू
                        </h5>
                        <button
                          type="button"
                          onClick={() => addFaat(departmentIndex)}
                          className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 flex items-center gap-1 text-xs transition-colors"
                        >
                          <FaPlus size={10} />
                          <span>शाखा थप्नुहोस्</span>
                        </button>
                      </div>

                      {department.faats && department.faats.map((faat, faatIndex) => (
                        <div key={faatIndex} className="flex items-center gap-2 mb-2 group">
                          <input
                            type="text"
                            value={faat.code}
                            onChange={(e) => updateFaat(departmentIndex, faatIndex, 'code', e.target.value)}
                            className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`शाखा #${faatIndex + 1} कोड`}
                            required
                          />
                          <input
                            type="text"
                            value={faat.name}
                            onChange={(e) => updateFaat(departmentIndex, faatIndex, 'name', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`शाखा #${faatIndex + 1} नाम`}
                            required
                          />
                          {department.faats.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFaat(departmentIndex, faatIndex)}
                              className="text-red-500 p-1 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                      ))}

                      <p className="text-xs text-gray-500 italic mt-1">
                        मुख्य कार्यालयमा प्रत्येक महाशाखामा कम्तिमा एउटा शाखा हुनुपर्छ
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className={`px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${
                  isSubmitting ? "bg-gray-400" : "bg-[#E68332] hover:bg-[#c36f2a]"
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
                             