import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaFileAlt,
  FaBuilding,
  FaUserCircle,
  FaSave,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdSubject, MdDescription } from "react-icons/md";
import FormField from "./Common/FormField";

const AddDarta = ({ isOpen, onClose, onSuccess }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    darta_date: "",
    related_file: "",
    related_office: "",
    related_department: "",
    related_faat: "",
    subject: "",
    sender_name: "", // Updated field name
    sender_address: "", // Added from model
    pana_sankhya: "", // From model
    remarks: "",
  });

  const [files, setFiles] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const [filesRes, officesRes] = await Promise.all([
        fetch(`${baseUrl}/file/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch(`${baseUrl}/offices/`, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      if (filesRes.ok) {
        const filesData = await filesRes.json();
        // Handle paginated response
        const actualFiles = filesData.data || filesData;
        setFiles(Array.isArray(actualFiles) ? actualFiles.filter(file => !file.is_disabled) : []);
      }

      if (officesRes.ok) {
        const officesData = await officesRes.json();
        setOffices(Array.isArray(officesData) ? officesData : []);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setFiles([]);
      setOffices([]);
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
    
    if (!formData.darta_date) {
      newErrors.darta_date = "दर्ता मिति आवश्यक छ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        related_file: formData.related_file || null,
        related_office: formData.related_office || null,
        related_department: formData.related_department || null,
        related_faat: formData.related_faat || null,
        sending_department: formData.sending_department || null,
      };

      const response = await fetch(`${baseUrl}/darta/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("दर्ता रेकर्ड सफलतापूर्वक थपियो!");
        onSuccess?.();
        onClose();
        resetForm();
      } else {
        const errorData = await response.json();
        if (errorData) {
          const backendErrors = {};
          Object.keys(errorData).forEach(key => {
            backendErrors[key] = errorData[key][0] || "त्रुटि भयो";
          });
          setErrors(backendErrors);
        }
        toast.error("दर्ता रेकर्ड थप्न असफल भयो।");
      }
    } catch (error) {
      console.error("Error submitting darta:", error);
      toast.error(`त्रुटि: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      darta_date: "",
      related_file: "",
      related_office: "",
      related_department: "",
      related_faat: "",
      subject: "",
      sender_name: "", // Updated field name
      sender_address: "", // Added from model
      pana_sankhya: "", // From model
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
            नयाँ दर्ता थप्नुहोस्
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
            {/* Removed darta_number field */}
            <div className="mb-0">
              <FormField
                label="दर्ता मिति"
                name="darta_date"
                type="date"
                value={formData.darta_date}
                onChange={handleInputChange}
                required={true}
              />
              {errors.darta_date && (
                <p className="text-red-500 text-sm mt-1">{errors.darta_date}</p>
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
                onChange={handleDepartmentChange}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mb-0">
              <FormField
                label="पत्र मिति"
                name="patra_miti"
                type="date"
                value={formData.patra_miti}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                चलानी नम्बर
              </label>
              <input
                type="text"
                name="chalani_number"
                value={formData.chalani_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="चलानी नम्बर प्रविष्ट गर्नुहोस्"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पाना संख्या
              </label>
              <input
                type="text"
                name="pana_sankhya"
                value={formData.pana_sankhya}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="पाना संख्या प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>

          {/* Sender Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पठाउने व्यक्ति
              </label>
              <input
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="पठाउने व्यक्तिको नाम"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पाना संख्या
              </label>
              <input
                type="text"
                name="pana_sankhya"
                value={formData.pana_sankhya}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="पाना संख्या प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>

          {/* Sender Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पठाउने ठेगाना
            </label>
            <textarea
              name="sender_address"
              value={formData.sender_address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all resize-vertical"
              placeholder="पठाउने व्यक्तिको ठेगाना"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              विषय
            </label>
            <div className="relative">
              <MdSubject className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all resize-vertical"
                placeholder="विषय प्रविष्ट गर्नुहोस्"
              />
            </div>
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#E68332] text-white rounded-lg hover:bg-[#c36f2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
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

export default AddDarta;
