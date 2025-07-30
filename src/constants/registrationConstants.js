// Registration form constants and validation rules
export const REGISTRATION_CONSTANTS = {
  // User types with proper 5-level hierarchy (lowest to highest authority)
  USER_TYPES: [
    { value: "1", label: "फाँट कर्मचारी" },
    { value: "2", label: "शाखा अधिकारी" },
    { value: "3", label: "शाखा प्रमुख" },
    { value: "4", label: "विभाग प्रमुख" },
    { value: "5", label: "प्रशासक" }
  ],

  // Employee types
  EMPLOYEE_TYPES: [
    { value: "permanent", label: "स्थायी" },
    { value: "temporary", label: "अस्थायी" },
    { value: "contract", label: "करार" }
  ],

  // Position categories
  POSITION_CATEGORIES: [
    { value: "administrative", label: "प्रशासनिक" },
    { value: "technical", label: "प्राविधिक" },
    { value: "support", label: "सहायक" }
  ],

  // Education levels
  EDUCATION_LEVELS: ["SLC", "+2", "Bachelor", "Master", "PhD"],

  // Loan types
  LOAN_TYPES: [
    { value: "home", label: "घर ऋण" },
    { value: "personal", label: "व्यक्तिगत ऋण" },
    { value: "educational", label: "शैक्षिक ऋण" },
    { value: "other", label: "अन्य ऋण" }
  ],

  // Relations for guarantor
  RELATIONS: [
    "बुबा", "आमा", "छोरा", "छोरी", "पति", "पत्नी", "दाजु", "भाइ", 
    "दिदी", "बहिनी", "साथी", "सहकर्मी", "अन्य"
  ],

  // Form field labels
  LABELS: {
    // Personal Info
    FIRST_NAME: "पहिलो नाम",
    LAST_NAME: "अन्तिम नाम",
    FATHER_NAME: "बुबाको नाम",
    MOTHER_NAME: "आमाको नाम",
    GRANDFATHER_NAME: "हजुरबुबाको नाम",
    USERNAME: "प्रयोगकर्ता नाम",
    PASSWORD: "पासवर्ड",
    EMAIL: "इमेल",
    
    // Address
    PERMANENT_ADDRESS: "स्थायी ठेगाना",
    TEMPORARY_ADDRESS: "अस्थायी ठेगाना",
    PROVINCE: "प्रदेश",
    DISTRICT: "जिल्ला",
    MUNICIPALITY: "नगरपालिका/गाउँपालिका",
    WARD_NO: "वडा नं.",
    
    // Citizenship
    CITIZENSHIP_ID: "नागरिकता नं.",
    CITIZENSHIP_DATE: "नागरिकता जारी मिति",
    CITIZENSHIP_DISTRICT: "नागरिकता जारी जिल्ला",
    
    // Contact
    HOME_NUMBER: "घरको नम्बर",
    PHONE_NUMBER: "फोन नम्बर",
    MOBILE_NUMBER: "मोबाइल नम्बर",
    
    // Office Details
    DATE_JOINED: "सेवामा प्रवेश मिति",
    POSITION: "पद",
    POSITION_CATEGORY: "पद श्रेणी",
    EMPLOYEE_ID: "कर्मचारी आईडी",
    EMPLOYEE_TYPE: "कर्मचारी प्रकार",
    OFFICE: "कार्यालय",
    DEPARTMENT: "विभाग",
    FAAT: "फाँट",
    USER_TYPE: "प्रयोगकर्ता प्रकार",
    
    // Education
    EDUCATION_LEVEL: "शैक्षिक योग्यता",
    INSTITUTION: "संस्था",
    BOARD: "बोर्ड",
    PERCENTAGE: "प्रतिशत",
    YEAR: "वर्ष",
    
    // Awards & Punishments
    AWARD_NAME: "पुरस्कारको नाम",
    AWARD_DESCRIPTION: "पुरस्कारको विवरण",
    PUNISHMENT_NAME: "सजायको नाम",
    PUNISHMENT_DESCRIPTION: "सजायको विवरण",
    
    // Loan
    HAS_LOAN: "ऋण छ?",
    LOAN_TYPE: "ऋणको प्रकार",
    LOAN_AMOUNT: "ऋण रकम",
    LOAN_SOURCE: "ऋणको स्रोत",
    
    // Guarantor Details
    GUARANTOR_NAME: "जमानीदारको नाम",
    GUARANTOR_RELATION: "जमानीदारको नाता",
    GUARANTOR_CONTACT: "जमानीदारको सम्पर्क",
    GUARANTOR_ADDRESS: "जमानीदारको ठेगाना"
  },

  // Validation messages
  VALIDATION_MESSAGES: {
    REQUIRED: "यो फिल्ड आवश्यक छ",
    EMAIL_INVALID: "मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्",
    PASSWORD_MIN_LENGTH: "पासवर्ड कम्तिमा ८ अक्षरको हुनुपर्छ",
    CITIZENSHIP_INVALID: "मान्य नागरिकता नम्बर प्रविष्ट गर्नुहोस्",
    PHONE_INVALID: "मान्य फोन नम्बर प्रविष्ट गर्नुहोस्",
    PERCENTAGE_INVALID: "प्रतिशत ०-१०० को बीचमा हुनुपर्छ"
  }
};

// Form validation rules
export const VALIDATION_RULES = {
  required: (value) => value?.trim() !== "",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value?.length >= 8,
  citizenship: (value) => /^\d{1,}-\d{1,}-\d{1,}$/.test(value),
  phone: (value) => /^(\+977)?[0-9]{8,10}$/.test(value),
  percentage: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  }
};

// Initial form state - Phase 1 (Essential fields only)
export const INITIAL_PHASE1_STATE = {
  // Personal Information (Required for Phase 1)
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  email: "",
  
  // Office Assignment (Required for Phase 1)
  office: "",
  department: "",
  user_type: ""
};

// Initial form state - Phase 2 (Additional details)
export const INITIAL_PHASE2_STATE = {
  // Extended Personal Info
  father_name: "",
  grand_father_name: "",
  mother_name: "",
  date_of_birth: "",

  // Address Information
  perm_state: "",
  perm_district: "",
  perm_municipality: "",
  perm_ward_no: "",
  temp_state: "",
  temp_district: "",
  temp_municipality: "",
  temp_ward_no: "",

  // Citizenship Details
  citizenship_id: "",
  citizenship_date_of_issue: "",
  citizenship_district: "",

  // Contact Information
  home_number: "",
  phone_number: "",
  mobile_number: "",

  // Extended Office Details
  date_joined: "",
  recess_date: "",
  position: "",
  position_category: "",
  employee_type: "",
  employee_id: "",
  na_la_kos_no: "",
  accumulation_fund_no: "",
  bank_name: "",
  bank_account_no: "",
  faat: "",

  // Education
  education_level: "",
  institution: "",
  board: "",
  percentage: "",
  year: "",

  // Awards & Punishments
  award_name: "",
  award_description: "",
  punishment_name: "",
  punishment_description: "",

  // Loan Details
  has_loan: "",
  loan_type: "",
  loan_amount: "",
  loan_source: "",
  interest_rate: "",
  loan_tenure: "",
  monthly_emi: "",
  guarantor_name: "",
  guarantor_relation: "",
  guarantor_contact: "",
  guarantor_address: "",
  loan_purpose: "",
  repayment_status: ""
};

// Combined initial state for backward compatibility
export const INITIAL_FORM_STATE = {
  ...INITIAL_PHASE1_STATE,
  ...INITIAL_PHASE2_STATE
};

// Phase 1 required fields (Essential registration)
export const ESSENTIAL_REQUIRED_FIELDS = [
  'first_name', 'last_name', 'email', 'username', 'password', 
  'user_type', 'office', 'department'
  // Note: 'faat' is added dynamically if office is head office
];

// Phase 1 required fields (backward compatibility)
export const PHASE1_REQUIRED_FIELDS = [
  'first_name', 'last_name', 'username', 'password', 'email', 
  'office', 'department', 'user_type'
];

// Phase 2 recommended fields
export const PHASE2_RECOMMENDED_FIELDS = [
  'perm_state', 'perm_district', 'perm_municipality', 'perm_ward_no',
  'citizenship_id', 'mobile_number', 'date_joined'
];
