import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendPatra } from '../app/patraSlice';
import { FaPaperPlane, FaUser, FaFileAlt, FaTimes, FaPlus } from 'react-icons/fa';
import { MdSubject, MdDescription } from 'react-icons/md';
import { toast } from 'react-toastify';
import SelectOffice from '../Components/patra/SelectOffice';
import SelectDepartment from '../Components/patra/SelectDepartment';

const PatraCompose = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sending } = useSelector(state => state.patra);

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    receiver_office: '',
    receiver_department: '',
    priority: 'normal',
    file: null,
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOfficeChange = (officeId) => {
    setFormData(prev => ({
      ...prev,
      receiver_office: officeId,
      receiver_department: '' // Reset department when office changes
    }));
    if (errors.receiver_office) {
      setErrors(prev => ({ ...prev, receiver_office: '' }));
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setFormData(prev => ({ ...prev, receiver_department: departmentId }));
    if (errors.receiver_department) {
      setErrors(prev => ({ ...prev, receiver_department: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, file }));
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'पत्रको विषय आवश्यक छ';
    if (!formData.content.trim()) newErrors.content = 'पत्रको सामग्री आवश्यक छ';
    if (!formData.receiver_office) newErrors.receiver_office = 'प्राप्तकर्ता कार्यालय छान्नुहोस्';
    if (!formData.receiver_department) newErrors.receiver_department = 'प्राप्तकर्ता विभाग छान्नुहोस्';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्');
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'file') {
          submitData.append(key, value);
        }
      });
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      await dispatch(sendPatra(submitData)).unwrap();
      toast.success('पत्र सफलतापूर्वक पठाइयो!');
      navigate('/patra/sent');
    } catch (error) {
      console.error('Error sending patra:', error);
      toast.error('पत्र पठाउन असफल भयो');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaPaperPlane className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">नयाँ पत्र लेख्नुहोस्</h1>
        </div>
        <p className="text-gray-600">
          नयाँ पत्र तयार गरी पठाउनुहोस्
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Recipient Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            प्राप्तकर्ताहरू
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectOffice
              value={formData.receiver_office}
              onChange={handleOfficeChange}
              error={errors.receiver_office}
              required
            />
            
            <SelectDepartment
              officeId={formData.receiver_office}
              value={formData.receiver_department}
              onChange={handleDepartmentChange}
              error={errors.receiver_department}
              required
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              विषय <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MdSubject className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="पत्रको विषय लेख्नुहोस्"
                required
              />
            </div>
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              प्राथमिकता
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="low">कम</option>
              <option value="normal">सामान्य</option>
              <option value="high">उच्च</option>
              <option value="urgent">अति जरुरी</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पत्रको सामग्री <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MdDescription className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="पत्रको मुख्य सामग्री यहाँ लेख्नुहोस्..."
                required
              />
            </div>
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          {/* File Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              संलग्नक (वैकल्पिक)
            </label>
            {!formData.file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <FaFileAlt className="text-gray-400 text-3xl" />
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">फाइल संलग्न गर्नुहोस्</p>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                        <FaPlus className="mr-2" />
                        फाइल छान्नुहोस्
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 text-center max-w-xs">
                    PDF, DOC, DOCX, JPG, PNG फाइलहरू मात्र<br />
                    (अधिकतम 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FaFileAlt className="text-blue-600 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                    title="फाइल हटाउनुहोस्"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कैफियत (वैकल्पिक)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
              placeholder="थप टिप्पणी वा निर्देशनहरू..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/patra/inbox')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>पठाउँदै...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>पत्र पठाउनुहोस्</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatraCompose;
