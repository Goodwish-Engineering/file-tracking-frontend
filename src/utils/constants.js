export const USER_TYPES = {
  FAAT: "1",
  BRANCH_HEAD: "2", 
  BRANCH_OFFICER: "3",
  DEPARTMENT_HEAD: "4",
  ADMIN: "5"
};

export const ADMIN_LEVEL = "5";

export const isAdmin = (level) => {
  return level === ADMIN_LEVEL || level === "admin";
};

export const USER_TYPE_LABELS = {
  [USER_TYPES.FAAT]: "फाँट",
  [USER_TYPES.BRANCH_HEAD]: "शाखा प्रमुख",
  [USER_TYPES.BRANCH_OFFICER]: "शाखा अधिकारी", 
  [USER_TYPES.DEPARTMENT_HEAD]: "विभाग प्रमुख",
  [USER_TYPES.ADMIN]: "प्रशासक"
};

export const OFFICE_TYPES = {
  HEAD: "मुख्य कार्यालय",
  BRANCH: "शाखा कार्यालय"
};

// Common colors
export const COLORS = {
  PRIMARY: '#E68332',
  PRIMARY_HOVER: '#c36f2a',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6'
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'यो फिल्ड आवश्यक छ',
  INVALID_EMAIL: 'वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्',
  MIN_LENGTH: 'न्यूनतम लम्बाइ आवश्यक छ'
};

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  OUTLINE: 'outline',
  GHOST: 'ghost'
};

export const MODAL_SIZES = {
  SM: 'sm',
  MD: 'md', 
  LG: 'lg',
  XL: 'xl',
  FULL: 'full'
};
