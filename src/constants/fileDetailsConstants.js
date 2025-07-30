// File Details Constants
export const LABELS = {
  // Form Title
  FORM_TITLE: "फारामको विवरण",
  FORM_SUBTITLE_NEPALI: "सम्भव भएसम्म सबैलाई नेपालीमा फारम भर्न अनुरोध छ।",
  FORM_SUBTITLE_ENGLISH: "(Everyone is requested to fill out the form in Nepali if possible.)",
  REQUIRED_FIELD_NOTE: "चिन्ह भएका फिल्ड अनिवार्य छन्",
  
  // Section Titles
  FILE_INFORMATION: "फाइल जानकारी",
  LOCATION_INFORMATION: "स्थान सम्बन्धी जानकारी",
  OFFICE_INFORMATION: "कार्यालय सम्बन्धी जानकारी",
  
  // Field Labels
  FILE_TYPE: "फाइल प्रकार",
  FILE_NAME: "फाइल नाम",
  SUBJECT: "विषय",
  RESPONSIBLE_PERSON: "फाइलको जिम्मेवार व्यक्ति",
  PRESENT_DATE: "हालको मिति",
  PROVINCE: "प्रदेश",
  DISTRICT: "जिल्ला",
  MUNICIPALITY: "नगरपालिका/गाउँपालिका",
  WARD_NUMBER: "वडा नम्बर",
  TOLE: "टोल",
  RELATED_OFFICE: "सम्बन्धित कार्यालय",
  DEPARTMENT: "विभाग",
  FAAT: "फाँट",
  
  // Placeholders
  SELECT_FILE_TYPE: "फाइल प्रकार छान्नुहोस्",
  ENTER_FILE_NAME: "फाइलको नाम लेख्नुहोस्",
  ENTER_SUBJECT: "फाइलको विषय लेख्नुहोस्",
  ENTER_RESPONSIBLE_PERSON: "जिम्मेवार व्यक्तिको नाम लेख्नुहोस्",
  DATE_PLACEHOLDER: "YYYY-MM-DD (उदाहरण: 2081-05-15)",
  SELECT_PROVINCE: "प्रदेश छान्नुहोस्",
  SELECT_DISTRICT: "जिल्ला छान्नुहोस्",
  SELECT_MUNICIPALITY: "नगरपालिका/गाउँपालिका छान्नुहोस्",
  ENTER_WARD_NUMBER: "वडा नम्बर लेख्नुहोस्",
  ENTER_TOLE: "टोल लेख्नुहोस्",
  SELECT_OFFICE: "कार्यालय छान्नुहोस्",
  SELECT_DEPARTMENT: "विभाग छान्नुहोस्",
  SELECT_FAAT: "फाँट छान्नुहोस्",
  
  // Buttons
  SUBMIT: "फारम पेश गर्नुहोस्",
  SUBMITTING: "पेश गर्दै...",
  RESET: "रिसेट गर्नुहोस्",
  
  // Messages
  SUBMISSION_SUCCESS: "File details submitted successfully!",
  SUBMISSION_ERROR: "Failed to submit file details.",
  REQUIRED_FIELD_ERROR: "यो फिल्ड आवश्यक छ",
  
  // Validation Messages
  FIELD_REQUIRED: "यो फिल्ड आवश्यक छ",
  SELECT_PROVINCE_FIRST: "पहिले प्रदेश छान्नुहोस्",
  SELECT_DISTRICT_FIRST: "पहिले जिल्ला छान्नुहोस्",
  SELECT_OFFICE_FIRST: "पहिले कार्यालय छान्नुहोस्",
  SELECT_DEPARTMENT_FIRST: "पहिले विभाग छान्नुहोस्",
  
  // Loading States
  LOADING_DISTRICTS: "जिल्लाहरू लोड हुँदै...",
  LOADING_MUNICIPALITIES: "नगरपालिकाहरू लोड हुँदै...",
  LOADING_DEPARTMENTS: "विभागहरू लोड हुँदै...",
  LOADING_FAATS: "फाँटहरू लोड हुँदै...",
  
  // Patra System Labels
  PATRA_SYSTEM: "पत्र प्रणाली",
  INBOX: "इनबक्स",
  SENT: "पठाइएको",
  COMPOSE: "नयाँ पत्र",
  DRAFT: "मस्यौदा",
  TRACKING: "ट्र्याकिङ",
  
  // Patra Actions
  COMPOSE_PATRA: "नयाँ पत्र लेख्नुहोस्",
  SEND_PATRA: "पत्र पठाउनुहोस्",
  REPLY_PATRA: "जवाफ दिनुहोस्",
  FORWARD_PATRA: "फर्वार्ड गर्नुहोस्",
  TRANSFER_PATRA: "स्थानान्तरण गर्नुहोस्",
  MARK_READ: "पढिएको चिन्ह लगाउनुहोस्",
  
  // Patra Fields
  RECIPIENTS: "प्राप्तकर्ताहरू",
  SENDER: "पठाउने व्यक्ति",
  PATRA_SUBJECT: "पत्रको विषय",
  PATRA_CONTENT: "पत्रको सामग्री",
  PRIORITY: "प्राथमिकता",
  ATTACHMENTS: "संलग्नकहरू",
  REFERENCE_NUMBER: "सन्दर्भ नम्बर",
  
  // Priority Levels
  PRIORITY_NORMAL: "सामान्य",
  PRIORITY_MEDIUM: "मध्यम",
  PRIORITY_HIGH: "उच्च", 
  PRIORITY_URGENT: "अति जरुरी",
  
  // Status
  STATUS_UNREAD: "नपढिएको",
  STATUS_READ: "पढिएको",
  STATUS_REPLIED: "जवाफ दिइएको",
  STATUS_FORWARDED: "फर्वार्ड गरिएको",
  STATUS_TRANSFERRED: "स्थानान्तरण गरिएको",
  
  // Messages
  PATRA_SENT_SUCCESS: "पत्र सफलतापूर्वक पठाइयो!",
  PATRA_SEND_ERROR: "पत्र पठाउन असफल भयो।",
  PATRA_TRANSFER_SUCCESS: "पत्र सफलतापूर्वक स्थानान्तरण गरियो!",
  PATRA_TRANSFER_ERROR: "पत्र स्थानान्तरण गर्न असफल भयो।",
  NO_PATRAS_FOUND: "कुनै पत्र भेटिएन",
  LOADING_PATRAS: "पत्रहरू लोड हुँदैछ...",
  
  // Validation Messages
  RECIPIENT_REQUIRED: "कम्तिमा एक प्राप्तकर्ता चयन गर्नुहोस्",
  SUBJECT_REQUIRED: "पत्रको विषय आवश्यक छ",
  CONTENT_REQUIRED: "पत्रको सामग्री आवश्यक छ",
  PRIORITY_REQUIRED: "प्राथमिकता चयन गर्नुहोस्",
};

export const FORM_SECTIONS = {
  FILE_INFO: "file_info",
  LOCATION: "location", 
  OFFICE: "office"
};

export const FIELD_NAMES = {
  FILE_TYPE: "file_type",
  FILE_NAME: "file_name",
  SUBJECT: "subject",
  SUBMITTED_BY: "submitted_by",
  PRESENT_DATE: "present_date",
  PROVINCE: "province",
  DISTRICT: "district",
  MUNICIPALITY: "municipality",
  WARD_NO: "ward_no",
  TOLE: "tole",
  RELATED_GUTHI: "related_guthi",
  RELATED_DEPARTMENT: "related_department",
  RELATED_FAAT: "related_faat",
  PRESENT_BY: "present_by"
};

export const DEFAULT_FORM_DATA = {
  [FIELD_NAMES.FILE_NAME]: "",
  [FIELD_NAMES.SUBJECT]: "",
  [FIELD_NAMES.PROVINCE]: "",
  [FIELD_NAMES.DISTRICT]: "",
  [FIELD_NAMES.MUNICIPALITY]: "",
  [FIELD_NAMES.WARD_NO]: "",
  [FIELD_NAMES.TOLE]: "",
  [FIELD_NAMES.SUBMITTED_BY]: "",
  [FIELD_NAMES.PRESENT_DATE]: "",
  [FIELD_NAMES.RELATED_GUTHI]: "",
  [FIELD_NAMES.RELATED_DEPARTMENT]: "",
  [FIELD_NAMES.RELATED_FAAT]: "",
  [FIELD_NAMES.FILE_TYPE]: "",
};

export const REQUIRED_FIELDS = [
  FIELD_NAMES.FILE_NAME,
  FIELD_NAMES.SUBJECT,
  FIELD_NAMES.SUBMITTED_BY,
  FIELD_NAMES.PRESENT_DATE
];

export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: "फाइल विवरण सफलतापूर्वक पेश गरियो!",
  DATA_SAVED: "डाटा सफलतापूर्वक सेभ गरियो!"
};

export const ERROR_MESSAGES = {
  SUBMISSION_FAILED: "फाइल विवरण पेश गर्न असफल",
  NETWORK_ERROR: "नेटवर्क त्रुटि देखा पर्यो",
  VALIDATION_ERROR: "कृपया आवश्यक फिल्डहरू भर्नुहोस्"
};

export const API_ENDPOINTS = {
  FILES_UPLOAD: "/files/upload/",
  PROVINCES: "/provinces/",
  DISTRICTS: "/districts/",
  MUNICIPALITIES: "/municipality/",
  OFFICES: "/offices/",
  FILE_TYPES: "/file-type/",
  DEPARTMENTS: "/department/",
  FAATS: "/faat/"
};
