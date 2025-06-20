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
  FaPaperPlane,
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";
import FormField from "./Common/FormField";

const AddChalani = ({ isOpen, onClose, onSuccess }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    chalani_number: "",
    chalani_date: "",
    related_file: "",
    related_department: "",
    related_office: "",
    receiving_department: "",
    receiving_office: "",
    patra_sankhya: "",
    patra_miti: "",
    subject: "",
    sender_name: "",
    receiver_name: "",
    pana_sankhya: "",
    remarks: "",
    dispatch_method: "",
    urgency_level: "medium",
    reference_number: "",
    karmachari: "",
  });

  const [files, setFiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
      fetchDepartments();
      fetchOffices();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data.filter(file => !file.is_disabled));
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseUrl}/department/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOffices(data);
      }
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  // Format date input as YYYY-MM-DD
  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name.includes('date') || name.includes('miti')) {
      processedValue = formatDateInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/chalani/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("चलानी रेकर्ड सफलतापूर्वक थपियो!");
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          chalani_number: "",
          chalani_date: "",
          related_file: "",
          related_department: "",
          related_office: "",
          receiving_department: "",
          receiving_office: "",
          patra_sankhya: "",
          patra_miti: "",
          subject: "",
          sender_name: "",
          receiver_name: "",
          pana_sankhya: "",
          remarks: "",
          dispatch_method: "",
          urgency_level: "medium",
          reference_number: "",
          karmachari: "",
        });
      } else {
        const errorData = await response.json();
        toast.error("चलानी रेकर्ड थप्न असफल भयो।");
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error submitting chalani:", error);
      toast.error(`त्रुटि: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-6 rounded-t-xl border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#E68332]">
                नयाँ चलानी रेकर्ड थप्नुहोस्
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                चलानी रेकर्डको सम्पूर्ण विवरण भर्नुहोस्
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="animate-fadeIn">
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                चिन्ह भएका फिल्ड अनिवार्य छन्
              </p>
            </div>

            {/* Basic Information Section */}
            <div className="border-b pb-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <FaPaperPlane className="mr-2 text-[#E68332]" />
                आधारभूत जानकारी
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="चलानी नम्बर"
                  name="chalani_number"
                  icon={<FaFileAlt />}
                  required={true}
                  placeholder="चलानी नम्बर लेख्नुहोस्"
                  value={formData.chalani_number}
                  onChange={handleChange}
                />

                <FormField
                  label="चलानी मिति"
                  name="chalani_date"
                  type="date"
                  required={true}
                  value={formData.chalani_date}
                  onChange={handleChange}
                />

                <FormField
                  label="सम्बन्धित फाइल"
                  name="related_file"
                  type="select"
                  options={files}
                  placeholder="फाइल छान्नुहोस्"
                  icon={<FaFileAlt />}
                  value={formData.related_file}
                  onChange={handleChange}
                />

                <FormField
                  label="पत्र संख्या"
                  name="patra_sankhya"
                  icon={<FaFileAlt />}
                  placeholder="पत्र संख्या लेख्नुहोस्"
                  value={formData.patra_sankhya}
                  onChange={handleChange}
                />

                <FormField
                  label="पत्र मिति"
                  name="patra_miti"
                  type="date"
                  value={formData.patra_miti}
                  onChange={handleChange}
                />

                <FormField
                  label="सन्दर्भ नम्बर"
                  name="reference_number"
                  icon={<FaFileAlt />}
                  placeholder="सन्दर्भ नम्बर लेख्नुहोस्"
                  value={formData.reference_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Sender and Receiver Information */}
            <div className="border-b pb-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <FaBuilding className="mr-2 text-[#E68332]" />
                पठाउने र बुझाउने जानकारी
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="सम्बन्धित विभाग (पठाउने)"
                  name="related_department"
                  type="select"
                  options={departments}
                  placeholder="विभाग छान्नुहोस्"
                  icon={<FaBuilding />}
                  value={formData.related_department}
                  onChange={handleChange}
                />

                <FormField
                  label="सम्बन्धित कार्यालय (पठाउने)"
                  name="related_office"
                  type="select"
                  options={offices}
                  placeholder="कार्यालय छान्नुहोस्"
                  icon={<FaBuilding />}
                  value={formData.related_office}
                  onChange={handleChange}
                />

                <FormField
                  label="बुझाउने विभाग"
                  name="receiving_department"
                  type="select"
                  options={departments}
                  placeholder="बुझाउने विभाग छान्नुहोस्"
                  icon={<FaBuilding />}
                  value={formData.receiving_department}
                  onChange={handleChange}
                />

                <FormField
                  label="बुझाउने कार्यालय"
                  name="receiving_office"
                  type="select"
                  options={offices}
                  placeholder="बुझाउने कार्यालय छान्नुहोस्"
                  icon={<FaBuilding />}
                  value={formData.receiving_office}
                  onChange={handleChange}
                />

                <FormField
                  label="पठाउने व्यक्ति"
                  name="sender_name"
                  icon={<FaUserCircle />}
                  placeholder="पठाउने व्यक्तिको नाम"
                  value={formData.sender_name}
                  onChange={handleChange}
                />

                <FormField
                  label="बुझाउने व्यक्ति"
                  name="receiver_name"
                  icon={<FaUserCircle />}
                  placeholder="बुझाउने व्यक्तिको नाम"
                  value={formData.receiver_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <MdSubject className="mr-2 text-[#E68332]" />
                अन्य विवरणहरू
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="विषय"
                  name="subject"
                  isTextarea={true}
                  rows={3}
                  icon={<MdSubject />}
                  placeholder="विषय लेख्नुहोस्"
                  value={formData.subject}
                  onChange={handleChange}
                />

                <FormField
                  label="पाठाउने तरिका"
                  name="dispatch_method"
                  type="select"
                  options={[
                    { value: "hand_delivery", label: "हातैमा" },
                    { value: "post", label: "हुलाक" },
                    { value: "email", label: "इमेल" },
                    { value: "fax", label: "फ्याक्स" },
                    { value: "courier", label: "कुरियर" },
                  ]}
                  placeholder="पाठाउने तरिका छान्नुहोस्"
                  icon={<FaPaperPlane />}
                  value={formData.dispatch_method}
                  onChange={handleChange}
                />

                <FormField
                  label="जरुरी स्तर"
                  name="urgency_level"
                  type="select"
                  options={[
                    { value: "low", label: "कम" },
                    { value: "medium", label: "मध्यम" },
                    { value: "high", label: "उच्च" },
                    { value: "urgent", label: "अति जरुरी" },
                  ]}
                  icon={<FaFileAlt />}
                  value={formData.urgency_level}
                  onChange={handleChange}
                />

                <FormField
                  label="पाना संख्या"
                  name="pana_sankhya"
                  icon={<FaFileAlt />}
                  placeholder="पाना संख्या लेख्नुहोस्"
                  value={formData.pana_sankhya}
                  onChange={handleChange}
                />

                <FormField
                  label="कर्मचारी"
                  name="karmachari"
                  icon={<FaUserCircle />}
                  placeholder="कर्मचारीको नाम लेख्नुहोस्"
                  value={formData.karmachari}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  label="कैफियत"
                  name="remarks"
                  isTextarea={true}
                  rows={3}
                  icon={<MdSubject />}
                  placeholder="कैफियत लेख्नुहोस्"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-4 mt-8 sticky bottom-0 bg-white py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                <FaTimes />
                रद्द गर्नुहोस्
              </button>
              
              <button
                type="submit"
                className={`px-8 py-3 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-lg font-medium ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#E68332] hover:bg-[#d9773b]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddChalani;

