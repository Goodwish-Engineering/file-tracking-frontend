export const USER_TYPE_LABELS = {
  "1": "फाँट",
  "2": "शाखा प्रमुख", 
  "3": "शाखा अधिकारी",
  "4": "विभाग प्रमुख",
  "5": "प्रशासक"
};

export const USER_TYPE_OPTIONS = [
  { value: "1", label: "फाँट" },
  { value: "2", label: "शाखा प्रमुख" },
  { value: "3", label: "शाखा अधिकारी" },
  { value: "4", label: "विभाग प्रमुख" },
  { value: "5", label: "प्रशासक" }
];

export const SORT_FIELDS = {
  EMPLOYEE_ID: 'employee_id',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  POSITION: 'position',
  EMAIL: 'email'
};

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

export const MODAL_TYPES = {
  EMPLOYEE_DETAIL: 'employee_detail',
  ROLE_ASSIGNMENT: 'role_assignment',
  OFFICE_ASSIGNMENT: 'office_assignment'
};

export const LABELS = {
  PAGE_TITLE: "कर्मचारी विवरण",
  PAGE_SUBTITLE: "सबै कर्मचारीहरूको विस्तृत जानकारी हेर्नुहोस् र व्यवस्थापन गर्नुहोस्",
  SEARCH_PLACEHOLDER: "नाम, आईडी, पद, वा इमेल खोज्नुहोस्...",
  TOTAL_EMPLOYEES: "जम्मा",
  REFRESH: "अपडेट",
  LOADING: "कर्मचारीको डाटा लोड गर्दै...",
  NO_EMPLOYEES: "कुनै कर्मचारी फेला परेन",
  NO_EMPLOYEES_DESC: "हाल सिस्टममा कुनै कर्मचारी दर्ता छैन वा खोजी मापदण्डसँग मेल खाँदैन।",
  ERROR_FETCH: "कर्मचारी डाटा लोड गर्न समस्या भयो।",
  TRY_AGAIN: "फेरि प्रयास गर्नुहोस्",
  CLOSE: "बन्द गर्नुहोस्",
  CANCEL: "रद्द गर्नुहोस्",
  UPDATE: "परिवर्तन गर्नुहोस्",
  SUCCESS_UPDATE: "कर्मचारी सफलतापूर्वक अपडेट गरियो",
  ERROR_UPDATE: "कर्मचारी अपडेट गर्न असफल"
};

export const SUCCESS_MESSAGES = {
  EMPLOYEE_UPDATED: "कर्मचारी सफलतापूर्वक अपडेट गरियो",
  ROLE_UPDATED: "भूमिका सफलतापूर्वक परिवर्तन गरियो"
};

export const ERROR_MESSAGES = {
  EMPLOYEE_UPDATE_FAILED: "कर्मचारी अपडेट गर्न असफल",
  ROLE_UPDATE_FAILED: "भूमिका परिवर्तन गर्न असफल",
  FETCH_FAILED: "डाटा लोड गर्न असफल"
};

export const TABLE_HEADERS = {
  EMPLOYEE_ID: "कर्मचारी आईडी",
  FIRST_NAME: "पहिलो नाम",
  LAST_NAME: "अन्तिम नाम",
  POSITION: "पद",
  ACTIONS: "कार्य"
};

export const BUTTON_TITLES = {
  VIEW_DETAILS: "विस्तृत विवरण हेर्नुहोस्",
  EDIT_ROLE: "भूमिका सम्पादन गर्नुहोस्",
  EDIT_OFFICE: "कार्यालय परिवर्तन गर्नुहोस्"
};

export const SECTION_TITLES = {
  PERSONAL_INFO: "व्यक्तिगत जानकारी",
  OFFICE_INFO: "कार्यालय जानकारी", 
  ADDRESS_DOCS: "ठेगाना र कागजात",
  EDUCATION_ACHIEVEMENTS: "शैक्षिक र अन्य विवरण",
  EDUCATION: "शिक्षा",
  AWARDS: "पुरस्कार",
  PUNISHMENTS: "सजाय",
  LOAN_DETAILS: "ऋण विवरण"
};

export const INFO_LABELS = {
  USERNAME: "युजरनेम",
  EMAIL: "इमेल",
  FATHER_NAME: "बाबुको नाम",
  MOTHER_NAME: "आमाको नाम",
  GRANDFATHER_NAME: "हजुरबुबाको नाम",
  PHONE_NUMBER: "फोन नम्बर",
  MOBILE_NUMBER: "मोबाइल नम्बर",
  HOME_NUMBER: "घरको नम्बर",
  OFFICE: "कार्यालय",
  DEPARTMENT: "विभाग",
  APPOINTMENT_DATE: "नियुक्ति मिति",
  RECESS_DATE: "अवकाश मिति",
  EMPLOYEE_TYPE: "कर्मचारी प्रकार",
  NA_LA_KOS_NO: "NA LA KOS नम्बर",
  ACCUMULATION_FUND_NO: "संचय कोष नम्बर",
  PERMANENT_ADDRESS: "स्थायी ठेगाना",
  TEMPORARY_ADDRESS: "अस्थायी ठेगाना",
  CITIZENSHIP_ID: "नागरिकता नं.",
  CITIZENSHIP_DATE: "नागरिकता जारी मिति",
  CITIZENSHIP_DISTRICT: "नागरिकता जिल्ला",
  BANK_ACCOUNT_NO: "बैंक खाता नम्बर",
  BANK_NAME: "बैंकको नाम"
};

export const PLACEHOLDER_VALUES = {
  NOT_AVAILABLE: "—",
  NO_INFO: "उपलब्ध छैन",
  EDUCATION_PLACEHOLDER: "शैक्षिक विवरण उपलब्ध छैन",
  AWARDS_PLACEHOLDER: "पुरस्कार विवरण उपलब्ध छैन",
  PUNISHMENTS_PLACEHOLDER: "सजाय विवरण उपलब्ध छैन",
  LOAN_PLACEHOLDER: "ऋण विवरण उपलब्ध छैन"
};
