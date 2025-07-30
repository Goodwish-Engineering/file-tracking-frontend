import React from 'react';
import { Toaster } from 'react-hot-toast';
import FileFormHeader from './FileFormHeader';
import FileInformationSection from './FileInformationSection';
import LocationInformationSection from './LocationInformationSection';
import OfficeInformationSection from './OfficeInformationSection';
import FormActionButtons from './FormActionButtons';
import { useFileForm } from '../../hooks/useFileForm';
import { useFileLocationData } from '../../hooks/useFileLocationData';
import { useFileOfficeData } from '../../hooks/useFileOfficeData';
import { useFileSubmission } from '../../hooks/useFileSubmission';

const FileDetailsRefactored = () => {
  // Custom hooks for data management
  const {
    formData,
    setFormData,
    inputRefs,
    setInputRef,
    handleBlur,
    handleSelectChange,
    resetForm
  } = useFileForm();

  const {
    provinces,
    districts,
    municipalities,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingMunicipalities
  } = useFileLocationData(formData.province, formData.district);

  const {
    offices,
    departments,
    faats,
    fileTypes,
    isLoadingOffices,
    isLoadingDepartments,
    isLoadingFaats,
    isLoadingFileTypes
  } = useFileOfficeData(formData.office, formData.departmentOffice);

  const {
    submitForm,
    isSubmitting
  } = useFileSubmission();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData, inputRefs);
  };

  const handleReset = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-6">
            {/* Header Section */}
            <FileFormHeader />

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Information Section */}
              <FileInformationSection
                formData={formData}
                fileTypes={fileTypes}
                handleBlur={handleBlur}
                handleSelectChange={handleSelectChange}
                setInputRef={setInputRef}
                isLoadingFileTypes={isLoadingFileTypes}
              />

              {/* Location Information Section */}
              <LocationInformationSection
                formData={formData}
                provinces={provinces}
                districts={districts}
                municipalities={municipalities}
                handleSelectChange={handleSelectChange}
                handleBlur={handleBlur}
                setInputRef={setInputRef}
                isLoadingProvinces={isLoadingProvinces}
                isLoadingDistricts={isLoadingDistricts}
                isLoadingMunicipalities={isLoadingMunicipalities}
              />

              {/* Office Information Section */}
              <OfficeInformationSection
                formData={formData}
                offices={offices}
                departments={departments}
                faats={faats}
                handleSelectChange={handleSelectChange}
                isLoadingOffices={isLoadingOffices}
                isLoadingDepartments={isLoadingDepartments}
                isLoadingFaats={isLoadingFaats}
              />

              {/* Action Buttons */}
              <FormActionButtons
                onSubmit={handleSubmit}
                onReset={handleReset}
                isSubmitting={isSubmitting}
                disabled={false}
              />
            </form>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
    </div>
  );
};

export default FileDetailsRefactored;
