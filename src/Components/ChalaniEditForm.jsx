import React from "react";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";
import DateInputField from "./Common/DateInputField";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdSubject } from "react-icons/md";

const ChalaniEditForm = ({
  chalaniRecord,
  editFormData,
  handleInputChange,
  handleDateInputChange,
  handleSaveEdit,
  handleCancelEdit,
  updateLoading,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <InfoCard title="आधारभूत जानकारी" icon={<FaPaperPlane />}>
        <InfoItem
          label="चलानी नम्बर"
          value={chalaniRecord.chalani_number}
          icon={<FaFileAlt />}
        />

        {/* Use DateInputField for chalani_date */}
        <div className="flex items-start">
          <div className="flex items-center min-w-0 flex-1">
            <span className="mr-2 text-gray-400 flex-shrink-0">
              <FaCalendarAlt />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">चलानी मिति</p>
              <DateInputField
                name="chalani_date"
                value={editFormData.chalani_date || ""}
                onChange={handleDateInputChange}
                primaryColor="blue-500"
              />
            </div>
          </div>
        </div>

        <InfoItem
          label="दर्ता नम्बर"
          value={chalaniRecord.darta_number}
          icon={<FaFileAlt />}
        />

        {/* Use DateInputField for darta_date */}
        <div className="flex items-start">
          <div className="flex items-center min-w-0 flex-1">
            <span className="mr-2 text-gray-400 flex-shrink-0">
              <FaCalendarAlt />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">दर्ता मिति</p>
              <DateInputField
                name="darta_date"
                value={editFormData.darta_date || ""}
                onChange={handleDateInputChange}
                primaryColor="blue-500"
              />
            </div>
          </div>
        </div>

        <InfoItem
          label="पत्र संख्या"
          value={chalaniRecord.patra_sankhya}
          icon={<FaFileAlt />}
          fieldName="patra_sankhya"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
        />
      </InfoCard>

      {/* Office Information */}
      <InfoCard title="कार्यालय जानकारी" icon={<FaBuilding />}>
        <InfoItem
          label="सम्बन्धित विभाग"
          value={chalaniRecord.related_department_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="सम्बन्धित कार्यालय"
          value={chalaniRecord.related_office_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="सम्बन्धित फाँट"
          value={chalaniRecord.related_faat_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="पठाउने विभाग"
          value={chalaniRecord.sending_department_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="पठाउने स्थान"
          value={chalaniRecord.pathaaune_thau}
          icon={<FaPaperPlane />}
          fieldName="pathaaune_thau"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
        />
        <InfoItem
          label="प्राप्त गर्ने व्यक्ति"
          value={chalaniRecord.prapta_garne_byakti}
          icon={<FaUser />}
          fieldName="prapta_garne_byakti"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
        />
      </InfoCard>

      {/* Subject and Description */}
      <InfoCard
        title="विषय र विवरण"
        icon={<MdSubject />}
        className="lg:col-span-2"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">विषय</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <textarea
                name="subject"
                value={editFormData.subject || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
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
                value={editFormData.remarks || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                rows={4}
                placeholder="कैफियत प्रविष्ट गर्नुहोस्"
              />
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Additional Details */}
      <InfoCard title="अन्य विवरणहरू" icon={<FaUser />}>
        <InfoItem
          label="कर्मचारी"
          value={chalaniRecord.karmachari}
          icon={<FaUser />}
          fieldName="karmachari"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
        />
        <InfoItem
          label="पाना संख्या"
          value={chalaniRecord.pana_sankhya}
          icon={<FaFileAlt />}
          fieldName="pana_sankhya"
          isEditing={true}
          formData={editFormData}
          onChange={handleInputChange}
        />
        <InfoItem
          label="सम्बन्धित फाँट"
          value={chalaniRecord.related_faat}
          icon={<FaBuilding />}
        />
      </InfoCard>

      {/* File Information - Display only */}
      {chalaniRecord.related_file_detail && (
        <InfoCard title="सम्बन्धित फाइल जानकारी" icon={<FaFileAlt />}>
          <InfoItem
            label="फाइल नाम"
            value={chalaniRecord.related_file_detail.file_name}
            icon={<FaFileAlt />}
          />
          <InfoItem
            label="फाइल कोड"
            value={chalaniRecord.related_file_detail.file_code}
            icon={<FaFileAlt />}
          />
          <InfoItem
            label="फाइल ID"
            value={chalaniRecord.related_file_detail.id}
            icon={<FaFileAlt />}
          />
        </InfoCard>
      )}

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
          {updateLoading ? "सुरक्षित गर्दै..." : "सुरक्षित गर्नुहोस्"}
        </button>
      </div>
    </div>
  );
};

export default ChalaniEditForm;
