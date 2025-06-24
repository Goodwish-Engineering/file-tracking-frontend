import React from "react";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";
import DateInputField from "./Common/DateInputField";
import { 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBuilding, 
  FaUser, 
  FaSpinner,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";

const DartaEditForm = ({ 
  dartaRecord,
  editFormData,
  handleInputChange,
  handleDateInputChange,
  handleSaveEdit,
  handleCancelEdit,
  updateLoading
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <InfoCard title="आधारभूत जानकारी" icon={<BsFileEarmark />} borderColor="[#E68332]">
        <InfoItem
          label="दर्ता नम्बर"
          value={dartaRecord.darta_number}
          icon={<FaFileAlt />}
          primaryColor="[#E68332]"
        />
        
        {/* Use DateInputField for darta_date */}
        <div className="flex items-start">
          <div className="flex items-center min-w-0 flex-1">
            <span className="mr-2 text-gray-400 flex-shrink-0"><FaCalendarAlt /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">दर्ता मिति</p>
              <DateInputField 
                name="darta_date"
                value={editFormData.darta_date || ''}
                onChange={handleDateInputChange}
                primaryColor="[#E68332]"
              />
            </div>
          </div>
        </div>
        
        <InfoItem
          label="पत्र संख्या"
          value={dartaRecord.patra_sankhya}
          icon={<FaFileAlt />}
          fieldName="patra_sankhya"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
        
        {/* Use DateInputField for patra_miti */}
        <div className="flex items-start">
          <div className="flex items-center min-w-0 flex-1">
            <span className="mr-2 text-gray-400 flex-shrink-0"><FaCalendarAlt /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">पत्र मिति</p>
              <DateInputField 
                name="patra_miti"
                value={editFormData.patra_miti || ''}
                onChange={handleDateInputChange}
                primaryColor="[#E68332]"
              />
            </div>
          </div>
        </div>
        
        <InfoItem
          label="चलानी नम्बर"
          value={dartaRecord.chalani_number}
          icon={<FaFileAlt />}
          fieldName="chalani_number"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
      </InfoCard>

      {/* Office Information */}
      <InfoCard title="कार्यालय जानकारी" icon={<FaBuilding />} borderColor="[#E68332]">
        <InfoItem
          label="सम्बन्धित विभाग"
          value={dartaRecord.related_department_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="सम्बन्धित कार्यालय"
          value={dartaRecord.related_office_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="सम्बन्धित फाँट"
          value={dartaRecord.related_faat_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पठाउने विभाग"
          value={dartaRecord.sending_department_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
      </InfoCard>

      {/* Subject and Description */}
      <InfoCard title="विषय र विवरण" icon={<MdSubject />} borderColor="[#E68332]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">विषय</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <textarea
                name="subject"
                value={editFormData.subject || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] text-sm bg-white"
                rows={3}
                placeholder="विषय प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">कैफियत</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <textarea
                name="remarks"
                value={editFormData.remarks || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] text-sm bg-white"
                rows={4}
                placeholder="कैफियत प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Additional Details */}
      <InfoCard title="अन्य विवरणहरू" icon={<FaUser />} borderColor="[#E68332]">
        <InfoItem
          label="टोक आदेश दिने"
          value={dartaRecord.tok_aadesh_dine}
          icon={<FaUser />}
          fieldName="tok_aadesh_dine"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पाना संख्या"
          value={dartaRecord.pana_sankhya}
          icon={<FaFileAlt />}
          fieldName="pana_sankhya"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पत्र बुझाउने फाँट"
          value={dartaRecord.patra_bujaune_faat}
          icon={<FaBuilding />}
          fieldName="patra_bujaune_faat"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="कर्मचारी"
          value={dartaRecord.karmachari}
          icon={<FaUser />}
          fieldName="karmachari"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
          primaryColor="[#E68332]"
        />
      </InfoCard>
      
      {/* Save/Cancel buttons */}
      <div className="lg:col-span-2 flex justify-end gap-3 mt-4">
        <button
          onClick={handleCancelEdit}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaTimes />
          रद्द गर्नुहोस्
        </button>
        <button
          onClick={handleSaveEdit}
          disabled={updateLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {updateLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
          {updateLoading ? 'सुरक्षित गर्दै...' : 'सुरक्षित गर्नुहोस्'}
        </button>
      </div>
    </div>
  );
};

export default DartaEditForm;
