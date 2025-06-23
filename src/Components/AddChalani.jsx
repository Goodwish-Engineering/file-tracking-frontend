import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes, FaSave, FaFileAlt, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { MdSubject, MdDescription } from "react-icons/md";
import axios from "axios";
import FormField from "./Common/FormField";

const AddChalani = ({ isOpen, onClose, onSuccess }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    chalani_date: "",
    related_file: "",
    related_office: "",
    related_department: "",
    related_faat: "",
    patra_sankhya: "",
    subject: "",
    sending_department: "",
    pana_sankhya: "",
    remarks: "",
  });
  
  const [files, setFiles] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const [filesRes, officesRes, departmentsRes] = await Promise.all([
        axios.get(`${baseUrl}/file/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(`${baseUrl}/offices/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(`${baseUrl}/department/`, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      // Handle paginated file response
      let filesData = [];
      if (filesRes.data?.data && Array.isArray(filesRes.data.data)) {
        filesData = filesRes.data.data;
      } else if (Array.isArray(filesRes.data)) {
        filesData = filesRes.data;
      }

      setFiles(filesData);
      setOffices(Array.isArray(officesRes.data) ? officesRes.data : []);
      setAllDepartments(Array.isArray(departmentsRes.data) ? departmentsRes.data : []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setFiles([]);
      setOffices([]);
      setAllDepartments([]);
    }
  };

  // Handle office selection and load its departments
  const handleOfficeChange = async (e) => {
    const officeId = e.target.value;
    setFormData(prev => ({
      ...prev,
      related_office: officeId,
      related_department: "",
      related_faat: "",
    }));

    if (officeId) {
      try {
        const response = await fetch(`${baseUrl}/offices/${officeId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Office Data:", data);

          // Directly set departments from the response
          setDepartments(data.departments || []); // Ensure it's always an array
        } else {
          // Fallback to the query parameter approach if direct fetch fails
          const fallbackResponse = await fetch(`${baseUrl}/department/?office=${officeId}`, {
            headers: { Authorization: `Token ${token}` },
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setDepartments(Array.isArray(fallbackData) ? fallbackData : []);
          } else {
            throw new Error("Both department fetching methods failed");
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]); // Prevents UI crashes
      }
    } else {
      setDepartments([]);
      setFaats([]);
    }
  };

  // Handle department selection and load its faats
  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({
      ...prev,
      related_department: departmentId,
      related_faat: "",
    }));

    if (departmentId) {
      try {
        // Use the same pattern as in Register.jsx - direct URL path
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
    } else {
      setFaats([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.chalani_date) {
      newErrors.chalani_date = "चलानी मिति आवश्यक छ";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "विषय आवश्यक छ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        related_file: formData.related_file || null,
        related_office: formData.related_office || null,
        related_department: formData.related_department || null,
        related_faat: formData.related_faat || null,
        sending_department: formData.sending_department || null,
      };

      const response = await axios.post(`${baseUrl}/chalani/`, submitData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        onSuccess();
        onClose();
        resetForm();
        alert("चलानी सफलतापूर्वक थपियो");
      }
    } catch (error) {
      console.error("Error creating chalani:", error);
      if (error.response?.data) {
        const backendErrors = {};
        Object.keys(error.response.data).forEach(key => {
          backendErrors[key] = error.response.data[key][0] || "त्रुटि भयो";
        });
        setErrors(backendErrors);
      } else {
        alert("चलानी सिर्जना गर्न त्रुटि भयो");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      chalani_date: "",
      related_file: "",
      related_office: "",
      related_department: "",
      related_faat: "",
      patra_sankhya: "",
      subject: "",
      sending_department: "",
      pana_sankhya: "",
      remarks: "",
    });
    setErrors({});
    setDepartments([]);
    setFaats([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-[#E68332] to-[#c36f2a] text-white rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaFileAlt />
            नयाँ चलानी थप्नुहोस्
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Removed chalani_number field */}
            <div className="mb-0">
              <FormField
                label="चलानी मिति"
                name="chalani_date"
                type="date"
                value={formData.chalani_date}
                onChange={handleInputChange}
                required={true}
              />
              {errors.chalani_date && (
                <p className="text-red-500 text-sm mt-1">{errors.chalani_date}</p>
              )}
            </div>
          </div>

          {/* Related Information with Hierarchy: Office > Department > Faat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सम्बन्धित कार्यालय
              </label>
              <select
                name="related_office"
                value={formData.related_office}
                onChange={handleOfficeChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
              >
                <option value="">कार्यालय छान्नुहोस्</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सम्बन्धित विभाग
              </label>
              <select
                name="related_department"
                value={formData.related_department}
                onChange={handleDepartmentChange} // <-- Changed from handleInputChange to handleDepartmentChange
                disabled={!formData.related_office}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">विभाग छान्नुहोस्</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सम्बन्धित फाँट
              </label>
              <select
                name="related_faat"
                value={formData.related_faat}
                onChange={handleInputChange}
                disabled={!formData.related_department}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">फाँट छान्नुहोस्</option>
                {faats.map((faat) => (
                  <option key={faat.id} value={faat.id}>
                    {faat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File and Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सम्बन्धित फाइल
              </label>
              <select
                name="related_file"
                value={formData.related_file}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
              >
                <option value="">फाइल छान्नुहोस्</option>
                {files.map((file) => (
                  <option key={file.id} value={file.id}>
                    {String(file.file_name || 'Unknown File')} (#{String(file.file_number || 'N/A')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पत्र संख्या
              </label>
              <input
                type="text"
                name="patra_sankhya"
                value={formData.patra_sankhya}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="पत्र संख्या प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पृष्ठ संख्या
              </label>
              <input
                type="text"
                name="pana_sankhya"
                value={formData.pana_sankhya}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="पृष्ठ संख्या प्रविष्ट गर्नुहोस्"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पठाउने विभाग
              </label>
              <select
                name="sending_department"
                value={formData.sending_department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
              >
                <option value="">पठाउने विभाग छान्नुहोस्</option>
                {allDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              विषय *
            </label>
            <div className="relative">
              <MdSubject className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all resize-vertical ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="विषय प्रविष्ट गर्नुहोस्"
              />
            </div>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कैफियत
            </label>
            <div className="relative">
              <MdDescription className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all resize-vertical"
                placeholder="कैफियत प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#E68332] text-white rounded-lg hover:bg-[#c36f2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  सुरक्षित गर्दै...
                </>
              ) : (
                <>
                  <FaSave />
                  सुरक्षित गर्नुहोस्
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChalani;
