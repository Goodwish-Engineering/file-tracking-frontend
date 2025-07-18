import React, { useState } from "react";
import { FaPlus, FaBuilding, FaLayerGroup, FaCheck, FaTrash } from "react-icons/fa";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import DisplayEditOffice from "./DisplayEditOffice";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { toast } from "react-toastify";

const AddOffice = () => {
  const { post, loading } = useApi();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [departments, setDepartments] = useState([
    { name: "", code: "", faats: [{ name: "", code: "" }] },
  ]);

  const { values: formData, handleChange, reset } = useForm({
    name: "",
    code: "",
    is_head_office: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.error("कृपया सबै फाँटको नाम र कोड हाल्नुहोस् वा हटाउनुहोस्");
        return;
      }
    }

    try {
      const response = await post('/offices/', formData);
      
      if (response) {
        const newOfficeId = response.id;

        for (const department of departments) {
          if (department.name.trim() !== "") {
            const deptResponse = await post('/department/', {
              ...department,
              belongs_to: newOfficeId
            });

            if (formData.is_head_office) {
              const departmentId = deptResponse.id;
              for (const faat of department.faats) {
                if (faat.name.trim() !== "") {
                  await post('/faat/', {
                    name: faat.name,
                    code: faat.code,
                    belongs_to: departmentId
                  });
                }
              }
            }
          }
        }

        setDataUpdated(true);
        toast.success("कार्यालय, विभाग र फाँट सफलतापूर्वक थपिए!");
        
        setTimeout(() => {
          setDataUpdated(false);
        }, 3000);

        reset();
        setDepartments([{ name: "", code: "", faats: [{ name: "", code: "" }] }]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("डाटा थप्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।");
    }
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

  return (
    <div className="flex flex-col w-full mx-auto gap-6 p-4 min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl mx-auto">
        <Card
          title="कार्यालय, विभाग र फाँट व्यवस्थापन"
          subtitle="नयाँ कार्यालय, सम्बन्धित विभागहरू र फाँटहरू थप्नुहोस्"
          icon={<FaBuilding />}
          variant="gradient"
        >
          <form onSubmit={handleSubmit}>
            {/* Office section */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="font-medium text-lg text-gray-800 mb-3 flex items-center">
                <FaBuilding className="mr-2 text-[#E68332]" />
                कार्यालय विवरण
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="कोड"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="कार्यालयको कोड यहाँ लेख्नुहोस्"
                  required
                />
                <Input
                  label="कार्यालयको नाम"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="कार्यालयको नाम यहाँ लेख्नुहोस्"
                  required
                />
              </div>

              <div className="mb-4">
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
                <Button
                  type="button"
                  onClick={addDepartment}
                  variant="success"
                  size="sm"
                  icon={<FaPlus />}
                >
                  {formData.is_head_office ? "नयाँ महाशाखा" : "नयाँ शाखा"}
                </Button>
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
                      <Button
                        type="button"
                        onClick={() => removeDepartment(departmentIndex)}
                        variant="danger"
                        size="sm"
                        icon={<FaTrash />}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Input
                      name={`dept_code_${departmentIndex}`}
                      value={department.code}
                      onChange={(e) => updateDepartment(departmentIndex, 'code', e.target.value)}
                      placeholder={formData.is_head_office ? "महाशाखा कोड" : "शाखा कोड"}
                      required
                      className="mb-0"
                    />
                    <Input
                      name={`dept_name_${departmentIndex}`}
                      value={department.name}
                      onChange={(e) => updateDepartment(departmentIndex, 'name', e.target.value)}
                      placeholder={formData.is_head_office ? "महाशाखाको नाम" : "शाखाको नाम"}
                      required
                      className="mb-0"
                    />
                  </div>

                  {formData.is_head_office && (
                    <div className="ml-6 border-l-2 border-blue-300 pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700 flex items-center">
                          <FaLayerGroup className="mr-2 text-blue-500" />
                          शाखाहरू
                        </h5>
                        <Button
                          type="button"
                          onClick={() => addFaat(departmentIndex)}
                          variant="outline"
                          size="sm"
                          icon={<FaPlus />}
                        >
                          शाखा थप्नुहोस्
                        </Button>
                      </div>

                      {department.faats && department.faats.map((faat, faatIndex) => (
                        <div key={faatIndex} className="flex items-center gap-2 mb-2">
                          <Input
                            name={`faat_code_${departmentIndex}_${faatIndex}`}
                            value={faat.code}
                            onChange={(e) => updateFaat(departmentIndex, faatIndex, 'code', e.target.value)}
                            placeholder={`शाखा #${faatIndex + 1} कोड`}
                            required
                            className="mb-0 w-1/3"
                          />
                          <Input
                            name={`faat_name_${departmentIndex}_${faatIndex}`}
                            value={faat.name}
                            onChange={(e) => updateFaat(departmentIndex, faatIndex, 'name', e.target.value)}
                            placeholder={`शाखा #${faatIndex + 1} नाम`}
                            required
                            className="mb-0 flex-1"
                          />
                          {department.faats.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeFaat(departmentIndex, faatIndex)}
                              variant="danger"
                              size="sm"
                              icon={<FaTrash />}
                            />
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
              <Button
                type="submit"
                isLoading={loading}
                icon={<FaCheck />}
                size="lg"
              >
                सुरक्षित गर्नुहोस्
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <DisplayEditOffice dataUpdated={dataUpdated} />
        </Card>
      </div>
    </div>
  );
};

export default AddOffice;
                   