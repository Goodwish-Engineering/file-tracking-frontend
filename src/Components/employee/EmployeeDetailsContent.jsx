import React from 'react';
import { FaUserAlt, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { MdWorkOutline } from 'react-icons/md';
import { SECTION_TITLES, INFO_LABELS, PLACEHOLDER_VALUES } from '../../constants/employeeConstants';
import { USER_TYPE_LABELS } from '../../constants/employeeConstants';
import InfoItem from '../../Components/Common/InfoItem';

const PersonalInfoSection = ({ employee }) => (
  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
      <FaUserAlt className="text-[#E68332]" />
      {SECTION_TITLES.PERSONAL_INFO}
    </h3>
    <div className="space-y-2">
      <InfoItem label={INFO_LABELS.USERNAME} value={employee.username} />
      <InfoItem label={INFO_LABELS.EMAIL} value={employee.email} />
      <InfoItem label={INFO_LABELS.FATHER_NAME} value={employee.father_name} />
      <InfoItem label={INFO_LABELS.MOTHER_NAME} value={employee.mother_name} />
      <InfoItem label={INFO_LABELS.GRANDFATHER_NAME} value={employee.grand_father_name} />
      <InfoItem label={INFO_LABELS.PHONE_NUMBER} value={employee.phone_number} />
      <InfoItem label={INFO_LABELS.MOBILE_NUMBER} value={employee.mobile_number} />
      <InfoItem label={INFO_LABELS.HOME_NUMBER} value={employee.home_number} />
    </div>
  </div>
);

const OfficeInfoSection = ({ employee }) => (
  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
      <FaBuilding className="text-[#E68332]" />
      {SECTION_TITLES.OFFICE_INFO}
    </h3>
    <div className="space-y-2">
      <InfoItem label={INFO_LABELS.OFFICE} value={employee.office?.name} />
      <InfoItem label={INFO_LABELS.DEPARTMENT} value={employee.department?.name} />
      <InfoItem label={INFO_LABELS.APPOINTMENT_DATE} value={employee.date_joined} />
      <InfoItem label={INFO_LABELS.RECESS_DATE} value={employee.recess_date} />
      <InfoItem label={INFO_LABELS.EMPLOYEE_TYPE} value={employee.employee_type} />
      <InfoItem label={INFO_LABELS.NA_LA_KOS_NO} value={employee.na_la_kos_no} />
      <InfoItem label={INFO_LABELS.ACCUMULATION_FUND_NO} value={employee.accumulation_fund_no} />
    </div>
  </div>
);

const AddressDocumentsSection = ({ employee }) => (
  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
      <MdWorkOutline className="text-[#E68332]" />
      {SECTION_TITLES.ADDRESS_DOCS}
    </h3>
    <div className="space-y-2">
      <InfoItem 
        label={INFO_LABELS.PERMANENT_ADDRESS} 
        value={`${employee.perm_municipality || ''}, ${employee.perm_district || ''}, ${employee.perm_state || ''}`} 
      />
      <InfoItem 
        label={INFO_LABELS.TEMPORARY_ADDRESS} 
        value={`${employee.temp_municipality || ''}, ${employee.temp_district || ''}, ${employee.temp_state || ''}`}
      />
      <InfoItem label={INFO_LABELS.CITIZENSHIP_ID} value={employee.citizenship_id} />
      <InfoItem label={INFO_LABELS.CITIZENSHIP_DATE} value={employee.citizenship_date_of_issue} />
      <InfoItem label={INFO_LABELS.CITIZENSHIP_DISTRICT} value={employee.citizenship_district} />
      <InfoItem label={INFO_LABELS.BANK_ACCOUNT_NO} value={employee.bank_account_no} />
      <InfoItem label={INFO_LABELS.BANK_NAME} value={employee.bank_name} />
    </div>
  </div>
);

const EducationAchievementsSection = ({ employee }) => (
  <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
      <FaBriefcase className="text-[#E68332]" />
      {SECTION_TITLES.EDUCATION_ACHIEVEMENTS}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Education */}
      <div className="bg-white p-3 rounded-lg border border-gray-100">
        <h4 className="font-medium text-base text-gray-700 mb-2">{SECTION_TITLES.EDUCATION}</h4>
        {employee.education ? (
          <p className="text-sm text-gray-600">
            {`${employee.education.education_level || PLACEHOLDER_VALUES.NOT_AVAILABLE} from ${employee.education.institution || PLACEHOLDER_VALUES.NOT_AVAILABLE} (${employee.education.board || PLACEHOLDER_VALUES.NOT_AVAILABLE}, ${employee.education.year || PLACEHOLDER_VALUES.NOT_AVAILABLE}), ${employee.education.percentage || PLACEHOLDER_VALUES.NOT_AVAILABLE}%`}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">{PLACEHOLDER_VALUES.EDUCATION_PLACEHOLDER}</p>
        )}
      </div>
      
      {/* Awards */}
      <div className="bg-white p-3 rounded-lg border border-gray-100">
        <h4 className="font-medium text-base text-gray-700 mb-2">{SECTION_TITLES.AWARDS}</h4>
        {employee.awards ? (
          <p className="text-sm text-gray-600">
            {`${employee.awards.name} - ${employee.awards.description}`}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">{PLACEHOLDER_VALUES.AWARDS_PLACEHOLDER}</p>
        )}
      </div>
      
      {/* Punishments */}
      <div className="bg-white p-3 rounded-lg border border-gray-100">
        <h4 className="font-medium text-base text-gray-700 mb-2">{SECTION_TITLES.PUNISHMENTS}</h4>
        {employee.punishments ? (
          <p className="text-sm text-gray-600">
            {`${employee.punishments.name} - ${employee.punishments.description}`}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">{PLACEHOLDER_VALUES.PUNISHMENTS_PLACEHOLDER}</p>
        )}
      </div>
    </div>
    
    {/* Loan Details */}
    <div className="mt-4 bg-white p-3 rounded-lg border border-gray-100">
      <h4 className="font-medium text-base text-gray-700 mb-2">{SECTION_TITLES.LOAN_DETAILS}</h4>
      {employee.loan ? (
        <p className="text-sm text-gray-600">
          {`${employee.loan.loan_type} - ${employee.loan.name}, ब्याज दर: ${employee.loan.interest_rate}%, रकम: ${employee.loan.min_amount} - ${employee.loan.max_amount}, अवधि: ${employee.loan.min_tenure} - ${employee.loan.max_tenure} वर्ष`}
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic">{PLACEHOLDER_VALUES.LOAN_PLACEHOLDER}</p>
      )}
    </div>
  </div>
);

const EmployeeProfile = ({ employee }) => (
  <div className="mb-6 pb-6 border-b border-gray-200">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="bg-gray-100 p-6 rounded-full">
        <FaUserAlt className="text-5xl text-gray-400" />
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-gray-800">
          {`${employee.first_name || ''} ${employee.last_name || ''}`}
        </h3>
        <p className="text-gray-500">{employee.position || 'अनौपचारिक पद'}</p>
        <p className="text-sm text-gray-600 mt-2">
          आईडी: {employee.employee_id || 'अनुपलब्ध'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {USER_TYPE_LABELS[employee.user_type] || "अन्य"}
          </span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            {employee.is_active ? "सक्रिय" : "निष्क्रिय"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeDetailsContent = ({ employee }) => (
  <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
    <EmployeeProfile employee={employee} />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PersonalInfoSection employee={employee} />
      <OfficeInfoSection employee={employee} />
      <AddressDocumentsSection employee={employee} />
      <EducationAchievementsSection employee={employee} />
    </div>
  </div>
);

export default EmployeeDetailsContent;
